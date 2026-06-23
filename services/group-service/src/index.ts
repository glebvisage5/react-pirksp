import "./config/env";
import express from "express";
import cors from "cors";
import { errorHandler } from "@ecosystem/shared";
import groupsRouter from "./modules/groups/groups.router";
import { env } from "./config/env";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/api/health", (_req, res) => res.json({ service: "group", status: "ok" }));
app.use("/api/groups", groupsRouter);
app.use(errorHandler);

app.listen(Number(env.PORT), () => console.log(`group-service :${env.PORT}`));
