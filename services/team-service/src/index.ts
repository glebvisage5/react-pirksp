import "./config/env";
import express from "express";
import cors from "cors";
import { errorHandler } from "@ecosystem/shared";
import teamsRouter from "./modules/teams/teams.router";
import { env } from "./config/env";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/api/health", (_req, res) => res.json({ service: "team", status: "ok" }));
app.use("/api/teams", teamsRouter);
app.use(errorHandler);

app.listen(Number(env.PORT), () => console.log(`team-service :${env.PORT}`));
