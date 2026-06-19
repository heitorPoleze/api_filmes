import express from "express";
import cors from 'cors';

export const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const API_VERSION = "/api/v2";
//app.use(`${API_VERSION}/auth`, authRotas`);
