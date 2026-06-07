#!/usr/bin/env bash
# Fuzz test runner — checks API for common security issues
# Usage: ./runner.sh [BASE_URL]
# Requires: curl, jq

export PATH="/usr/local/bin:/usr/bin:/bin:$PATH"
set -uo pipefail

BASE="${1:-http://localhost:4000}"
PASS=0
FAIL=0
TOTAL=0

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_pass() { echo -e "  ${GREEN}PASS${NC} $1"; PASS=$((PASS+1)); TOTAL=$((TOTAL+1)); }
log_fail() { echo -e "  ${RED}FAIL${NC} $1"; FAIL=$((FAIL+1)); TOTAL=$((TOTAL+1)); }
log_info() { echo -e "  ${YELLOW}INFO${NC} $1"; }

# ── Helpers ──────────────────────────────────────────────────────────────────

check_no_stack_trace() {
  local body="$1" label="$2"
  if echo "$body" | grep -qiE "(Error:|at Object\.|at Function\.|\.js:[0-9]|node_modules)"; then
    log_fail "$label — stack trace leaked"
  else
    log_pass "$label — no stack trace"
  fi
}

check_no_sql_error() {
  local body="$1" label="$2"
  if echo "$body" | grep -qiE "(syntax error|pg_|SELECT|INSERT|UPDATE|DELETE|column .* does not exist|relation .* does not exist)"; then
    log_fail "$label — SQL error leaked"
  else
    log_pass "$label — no SQL error"
  fi
}

check_status() {
  local got="$1" expected="$2" label="$3"
  if [ "$got" = "$expected" ]; then
    log_pass "$label — HTTP $got"
  else
    log_fail "$label — expected $expected, got $got"
  fi
}

check_not_500() {
  local got="$1" label="$2"
  if [ "$got" = "500" ]; then
    log_fail "$label — HTTP 500"
  else
    log_pass "$label — no 500 (got $got)"
  fi
}

# ── Auth setup ────────────────────────────────────────────────────────────────

echo ""
echo "▶ Setting up test user..."

REGISTER=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"Fuzz Tester","email":"fuzz_test_'$RANDOM'@test.com","password":"FuzzPass1!"}')

# Login with known user
LOGIN_BODY=$(curl -s -X POST "$BASE/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}')
TOKEN=$(echo "$LOGIN_BODY" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo -e "${RED}ERROR: Could not get token. Is the server running? Is test@example.com registered?${NC}"
  exit 1
fi
echo "  Token acquired."

AUTH="-H 'Authorization: Bearer $TOKEN'"

# ── Auth fuzz ─────────────────────────────────────────────────────────────────

echo ""
echo "▶ [auth] Input validation & error handling"

# Empty body
R=$(curl -s -o /tmp/fuzz_body.txt -w "%{http_code}" -X POST "$BASE/api/auth/login" \
  -H "Content-Type: application/json" -d '{}')
check_not_500 "$R" "login empty body"
check_no_stack_trace "$(cat /tmp/fuzz_body.txt)" "login empty body"

# SQL injection in email (use jq to safely build JSON to avoid quoting issues)
SQLI_PAYLOADS=(
  "' OR '1'='1"
  "admin'--"
  "' UNION SELECT 1,2,3--"
  "'; DROP TABLE users;--"
)
for payload in "${SQLI_PAYLOADS[@]}"; do
  BODY=$(jq -n --arg e "$payload" '{"email":$e,"password":"anything"}')
  R=$(curl -s -o /tmp/fuzz_body.txt -w "%{http_code}" -X POST "$BASE/api/auth/login" \
    -H "Content-Type: application/json" -d "$BODY")
  check_not_500 "$R" "login sql injection: ${payload:0:20}"
  check_no_sql_error "$(cat /tmp/fuzz_body.txt)" "login sql injection response"
  check_no_stack_trace "$(cat /tmp/fuzz_body.txt)" "login sql injection stack"
done

# Oversized input
BIG=$(python3 -c "print('A'*10000)")
R=$(curl -s -o /tmp/fuzz_body.txt -w "%{http_code}" -X POST "$BASE/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"$BIG\",\"email\":\"big@test.com\",\"password\":\"pass123\"}")
check_not_500 "$R" "register oversized name"
check_no_stack_trace "$(cat /tmp/fuzz_body.txt)" "register oversized name"

# Wrong content type
R=$(curl -s -o /tmp/fuzz_body.txt -w "%{http_code}" -X POST "$BASE/api/auth/login" \
  -H "Content-Type: text/plain" -d "not json")
check_not_500 "$R" "login wrong content-type"

# Invalid JSON
R=$(curl -s -o /tmp/fuzz_body.txt -w "%{http_code}" -X POST "$BASE/api/auth/login" \
  -H "Content-Type: application/json" -d '{bad json}')
check_not_500 "$R" "login invalid JSON"

# ── Auth guard ────────────────────────────────────────────────────────────────

echo ""
echo "▶ [auth] Unauthorized access"

PROTECTED_ENDPOINTS=(
  "GET /api/auth/me"
  "GET /api/courses"
  "GET /api/tasks"
  "GET /api/teams"
)
for ep in "${PROTECTED_ENDPOINTS[@]}"; do
  EP_METHOD=$(echo "$ep" | cut -d' ' -f1)
  EP_PATH=$(echo "$ep" | cut -d' ' -f2)
  R=$(curl -s -o /dev/null -w "%{http_code}" -X "$EP_METHOD" "$BASE$EP_PATH")
  check_status "$R" "401" "no token → $ep"
done

# Tampered token
FAKE_TOKEN="eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDAiLCJyb2xlIjoiYWRtaW4ifQ.FAKE"
R=$(curl -s -o /tmp/fuzz_body.txt -w "%{http_code}" \
  -H "Authorization: Bearer $FAKE_TOKEN" "$BASE/api/auth/me")
check_status "$R" "401" "tampered JWT"
check_no_stack_trace "$(cat /tmp/fuzz_body.txt)" "tampered JWT"

# ── Courses fuzz ──────────────────────────────────────────────────────────────

echo ""
echo "▶ [courses] Input validation"

# GET non-existent course
R=$(curl -s -o /tmp/fuzz_body.txt -w "%{http_code}" \
  -H "Authorization: Bearer $TOKEN" "$BASE/api/courses/00000000-0000-0000-0000-000000000000")
check_not_500 "$R" "course non-existent UUID"
check_no_stack_trace "$(cat /tmp/fuzz_body.txt)" "course non-existent UUID"

# Invalid UUID
R=$(curl -s -o /tmp/fuzz_body.txt -w "%{http_code}" \
  -H "Authorization: Bearer $TOKEN" "$BASE/api/courses/not-a-uuid")
check_not_500 "$R" "course invalid UUID"
check_no_sql_error "$(cat /tmp/fuzz_body.txt)" "course invalid UUID"

# SQL injection in query param
R=$(curl -s -o /tmp/fuzz_body.txt -w "%{http_code}" \
  -H "Authorization: Bearer $TOKEN" \
  "$BASE/api/courses?search=' OR 1=1--")
check_not_500 "$R" "courses search sql injection"
check_no_sql_error "$(cat /tmp/fuzz_body.txt)" "courses search sql injection"

# Create course missing required fields
R=$(curl -s -o /tmp/fuzz_body.txt -w "%{http_code}" -X POST "$BASE/api/courses" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" -d '{}')
check_not_500 "$R" "create course empty body"

# XSS in course title
R=$(curl -s -o /tmp/fuzz_body.txt -w "%{http_code}" -X POST "$BASE/api/courses" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"<script>alert(1)</script>","description":"xss","level":"beginner","duration_hours":1}')
check_not_500 "$R" "create course XSS title"

# ── Tasks fuzz ────────────────────────────────────────────────────────────────

echo ""
echo "▶ [tasks] Input validation"

# Invalid status
R=$(curl -s -o /tmp/fuzz_body.txt -w "%{http_code}" -X POST "$BASE/api/tasks" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","status":"INVALID_STATUS","due_date":"not-a-date"}')
check_not_500 "$R" "task invalid status"

# Negative priority
R=$(curl -s -o /tmp/fuzz_body.txt -w "%{http_code}" -X POST "$BASE/api/tasks" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"T","priority":"9999"}')
check_not_500 "$R" "task invalid priority"

# PATCH non-existent task
R=$(curl -s -o /tmp/fuzz_body.txt -w "%{http_code}" \
  -X PATCH "$BASE/api/tasks/00000000-0000-0000-0000-000000000000" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"done"}')
check_not_500 "$R" "patch non-existent task"

# ── Teams fuzz ────────────────────────────────────────────────────────────────

echo ""
echo "▶ [teams] Input validation"

# Create team empty name
R=$(curl -s -o /tmp/fuzz_body.txt -w "%{http_code}" -X POST "$BASE/api/teams" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"","description":"x"}')
check_not_500 "$R" "team empty name"

# Create team — name too short
R=$(curl -s -o /tmp/fuzz_body.txt -w "%{http_code}" -X POST "$BASE/api/teams" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"a","description":"x"}')
check_not_500 "$R" "team name too short"

# Get team with random UUID (not member)
R=$(curl -s -o /tmp/fuzz_body.txt -w "%{http_code}" \
  -H "Authorization: Bearer $TOKEN" \
  "$BASE/api/teams/00000000-0000-0000-0000-000000000000")
check_not_500 "$R" "team non-existent UUID"
check_no_stack_trace "$(cat /tmp/fuzz_body.txt)" "team non-existent UUID"

# SQL injection in team name
SQLI_TEAM_BODY=$(jq -n --arg n "Team'); DROP TABLE teams;--" '{"name":$n,"description":"sql"}')
R=$(curl -s -o /tmp/fuzz_body.txt -w "%{http_code}" -X POST "$BASE/api/teams" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "$SQLI_TEAM_BODY")
check_not_500 "$R" "team sql injection name"
check_no_sql_error "$(cat /tmp/fuzz_body.txt)" "team sql injection name"

# Add member with invalid UUID
R=$(curl -s -o /tmp/fuzz_body.txt -w "%{http_code}" -X POST \
  "$BASE/api/teams/00000000-0000-0000-0000-000000000000/members" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"user_id":"not-a-uuid","role":"Member"}')
check_not_500 "$R" "add member invalid uuid"

# ── Teams — IDOR check ────────────────────────────────────────────────────────

echo ""
echo "▶ [teams] IDOR / privilege escalation"

# Register a second user, try to access first user's team
SECOND_EMAIL="fuzz_second_$RANDOM@test.com"
curl -s -X POST "$BASE/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Second\",\"email\":\"$SECOND_EMAIL\",\"password\":\"Test1234!\"}" > /dev/null

LOGIN2=$(curl -s -X POST "$BASE/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$SECOND_EMAIL\",\"password\":\"Test1234!\"}")
TOKEN2=$(echo "$LOGIN2" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)

if [ -n "$TOKEN2" ]; then
  # Get list of first user's teams
  TEAM_ID=$(curl -s -H "Authorization: Bearer $TOKEN" "$BASE/api/teams" | \
    python3 -c "import sys,json; teams=json.load(sys.stdin); print(teams[0]['id'] if teams else '')" 2>/dev/null || echo "")

  if [ -n "$TEAM_ID" ]; then
    # Second user tries to access first user's team
    R=$(curl -s -o /tmp/fuzz_body.txt -w "%{http_code}" \
      -H "Authorization: Bearer $TOKEN2" "$BASE/api/teams/$TEAM_ID")
    if [ "$R" = "200" ]; then
      log_fail "IDOR: non-member can read team $TEAM_ID"
    else
      log_pass "IDOR: non-member blocked from team ($R)"
    fi

    # Second user tries to create project in first user's team
    R=$(curl -s -o /tmp/fuzz_body.txt -w "%{http_code}" \
      -X POST "$BASE/api/teams/$TEAM_ID/projects" \
      -H "Authorization: Bearer $TOKEN2" \
      -H "Content-Type: application/json" \
      -d '{"title":"IDOR Project","status":"active"}')
    if [ "$R" = "201" ]; then
      log_fail "IDOR: non-member created project in team"
    else
      log_pass "IDOR: non-member blocked from creating project ($R)"
    fi
  else
    log_info "No team found for IDOR test, skipping"
  fi
else
  log_info "Could not register second user, skipping IDOR test"
fi

# ── File upload fuzz ──────────────────────────────────────────────────────────

echo ""
echo "▶ [files] Upload limits & type checks"

TEAM_ID=$(curl -s -H "Authorization: Bearer $TOKEN" "$BASE/api/teams" | \
  python3 -c "import sys,json; teams=json.load(sys.stdin); print(teams[0]['id'] if teams else '')" 2>/dev/null || echo "")

if [ -n "$TEAM_ID" ]; then
  # Upload a normal small file
  echo "test file content" > /tmp/fuzz_test.txt
  R=$(curl -s -o /tmp/fuzz_body.txt -w "%{http_code}" \
    -X POST "$BASE/api/teams/$TEAM_ID/files" \
    -H "Authorization: Bearer $TOKEN" \
    -F "file=@/tmp/fuzz_test.txt")
  check_not_500 "$R" "upload small text file"

  # Upload with no file field
  R=$(curl -s -o /tmp/fuzz_body.txt -w "%{http_code}" \
    -X POST "$BASE/api/teams/$TEAM_ID/files" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: multipart/form-data")
  check_not_500 "$R" "upload no file field"
  check_status "$R" "400" "upload no file returns 400"

  # Try to delete non-existent file
  R=$(curl -s -o /tmp/fuzz_body.txt -w "%{http_code}" \
    -X DELETE "$BASE/api/teams/files/00000000-0000-0000-0000-000000000000" \
    -H "Authorization: Bearer $TOKEN")
  check_not_500 "$R" "delete non-existent file"
else
  log_info "No team for file tests, skipping"
fi

# ── HTTP method fuzzing ───────────────────────────────────────────────────────

echo ""
echo "▶ [http] Wrong methods"

WRONG_METHOD_CASES=(
  "DELETE /api/auth/login"
  "PUT /api/auth/register"
  "PATCH /api/auth/login"
)
for ep in "${WRONG_METHOD_CASES[@]}"; do
  EP_METHOD=$(echo "$ep" | cut -d' ' -f1)
  EP_PATH=$(echo "$ep" | cut -d' ' -f2)
  R=$(curl -s -o /dev/null -w "%{http_code}" -X "$EP_METHOD" "$BASE$EP_PATH" \
    -H "Content-Type: application/json" -d '{}')
  check_not_500 "$R" "wrong method $ep"
done

# ── Rate limit / DoS basics ───────────────────────────────────────────────────

echo ""
echo "▶ [dos] Rapid repeat requests"

ERRORS=0
for i in $(seq 1 20); do
  R=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"nonexistent@x.com","password":"wrong"}')
  if [ "$R" = "500" ]; then
    ((ERRORS++))
  fi
done
if [ "$ERRORS" -gt 0 ]; then
  log_fail "Rapid login attempts caused $ERRORS × 500"
else
  log_pass "20 rapid login attempts — no 500s"
fi

# ── Summary ───────────────────────────────────────────────────────────────────

echo ""
echo "══════════════════════════════════════════════"
echo -e "  Results: ${GREEN}$PASS passed${NC} / ${RED}$FAIL failed${NC} / $TOTAL total"
echo "══════════════════════════════════════════════"

if [ "$FAIL" -gt 0 ]; then
  exit 1
fi
