import "./config/env";
import express from "express";
import cors from "cors";
import { errorHandler } from "@ecosystem/shared";
import tasksRouter from "./modules/tasks/tasks.router";
import { env } from "./config/env";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/api/health", (_req, res) => res.json({ service: "task", status: "ok" }));
app.use("/api/tasks", tasksRouter);
app.use(errorHandler);

app.listen(Number(env.PORT), () => console.log(`task-service :${env.PORT}`));
