import "./config/env";
import express from "express";
import cors from "cors";
import { errorHandler } from "@ecosystem/shared";
import usersRouter from "./modules/users/users.router";
import { env } from "./config/env";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/api/health", (_req, res) => res.json({ service: "user", status: "ok" }));
app.use("/api/users", usersRouter);
app.use(errorHandler);

app.listen(Number(env.PORT), () => console.log(`user-service :${env.PORT}`));
