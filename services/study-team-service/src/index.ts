import "./config/env";
import express from "express";
import cors from "cors";
import { errorHandler } from "@ecosystem/shared";
import studyTeamsRouter from "./modules/study-teams/study-teams.router";
import { env } from "./config/env";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/api/health", (_req, res) => res.json({ service: "study-team", status: "ok" }));
app.use("/api/study-teams", studyTeamsRouter);
app.use(errorHandler);

app.listen(Number(env.PORT), () => console.log(`study-team-service :${env.PORT}`));
