import { Router } from "express";
import { ObraController } from "../controllers/ObraController.ts";

const obraRoutes = Router();
const obraController = new ObraController();

obraRoutes.post("/", (req, res) => obraController.criar(req, res));
obraRoutes.post("/muitos", (req, res) => obraController.criarMuitos(req, res));

obraRoutes.get("/", (req, res) => obraController.buscarTodos(req, res));
obraRoutes.get("/:id", (req, res) => obraController.buscarPorId(req, res));

obraRoutes.put("/:id", (req, res) => obraController.atualizar(req, res));

obraRoutes.delete("/:id", (req, res) => obraController.deletar(req, res));

export { obraRoutes };