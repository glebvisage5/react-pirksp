import "./config/env";
import express from "express";
import cors from "cors";
import { errorHandler } from "@ecosystem/shared";
import gtaRouter from "./modules/gta/gta.router";
import submissionsRouter from "./modules/gta/submissions.router";
import { purgeExpiredArchive } from "./modules/gta/submissions.service";
import { env } from "./config/env";

const app = express();
app.set("trust proxy", true); // needed to read the real client IP (X-Forwarded-For) behind the gateway, used for the public submissions rate limit
app.use(express.json());
app.use(cors());

app.get("/api/health", (_req, res) => res.json({ service: "gta", status: "ok" }));

app.use("/api/gta", gtaRouter);
app.use("/api/gta", submissionsRouter);
app.use(errorHandler);

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
purgeExpiredArchive().catch((err) => console.error("Archive purge failed:", err));
setInterval(() => {
  purgeExpiredArchive().catch((err) => console.error("Archive purge failed:", err));
}, ONE_DAY_MS);

app.listen(Number(env.PORT), () => console.log(`gta-service :${env.PORT}`));
