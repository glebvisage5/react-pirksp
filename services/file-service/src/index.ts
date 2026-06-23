import "./config/env";
import path from "path";
import express from "express";
import cors from "cors";
import { errorHandler } from "@ecosystem/shared";
import filesRouter from "./modules/files/files.router";
import { env } from "./config/env";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/api/health", (_req, res) => res.json({ service: "file", status: "ok" }));

const uploadsDir = path.resolve(env.UPLOAD_DIR);
app.use("/uploads", express.static(uploadsDir));

app.use("/api/files", filesRouter);
app.use(errorHandler);

app.listen(Number(env.PORT), () => console.log(`file-service :${env.PORT}`));
