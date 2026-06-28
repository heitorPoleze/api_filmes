import express from "express";
import cors from 'cors';
import {userRoutes} from "../routes/usuario.routes.ts";
import { obraRoutes } from "../routes/obra.routes.ts";
import { avaliacaoRouter } from "../routes/avaliacao.routes.ts";

export const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const API_VERSION = "/api/v2";
app.use(`${API_VERSION}/usuarios`, userRoutes);
app.use(`${API_VERSION}/obras`, obraRoutes);
app.use(`${API_VERSION}/avaliacoes`, avaliacaoRouter);