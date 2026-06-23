import "./config/env";
import express from "express";
import cors from "cors";
import { errorHandler } from "@ecosystem/shared";
import authRouter from "./modules/auth/auth.router";
import { env } from "./config/env";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/api/health", (_req, res) => res.json({ service: "auth", status: "ok" }));
app.use("/api/auth", authRouter);
app.use(errorHandler);

app.listen(Number(env.PORT), () => console.log(`auth-service :${env.PORT}`));
