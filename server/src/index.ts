import "./config/env"; // must be first
import path from "path";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import authRouter from "./modules/auth/auth.router";
import coursesRouter from "./modules/courses/courses.router";
import tasksRouter from "./modules/tasks/tasks.router";
import groupsRouter from "./modules/groups/groups.router";
import teamsRouter from "./modules/teams/teams.router";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Catch malformed JSON before it reaches route handlers
app.use((err: unknown, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof SyntaxError && "body" in err) {
    res.status(400).json({ error: "Invalid JSON" });
    return;
  }
  next(err);
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Serve uploaded files
const uploadsDir = path.resolve(env.UPLOAD_DIR);
app.use("/uploads", express.static(uploadsDir));

app.use("/api/auth", authRouter);
app.use("/api/courses", coursesRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/groups", groupsRouter);
app.use("/api/teams", teamsRouter);

app.use(errorHandler);

app.listen(Number(env.PORT), () => {
  console.log(`Server running on http://localhost:${env.PORT}`);
});
