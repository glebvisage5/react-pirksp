import "./config/env";
import express from "express";
import cors from "cors";
import { errorHandler } from "@ecosystem/shared";
import coursesRouter from "./modules/courses/courses.router";
import { env } from "./config/env";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/api/health", (_req, res) => res.json({ service: "course", status: "ok" }));
app.use("/api/courses", coursesRouter);
app.use(errorHandler);

app.listen(Number(env.PORT), () => console.log(`course-service :${env.PORT}`));
