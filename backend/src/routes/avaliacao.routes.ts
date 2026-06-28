import { Router } from "express";
import { AvaliacaoController } from "../controllers/AvaliacaoController.ts";

const avaliacaoRouter = Router();
const controller = new AvaliacaoController();

avaliacaoRouter.post("/", (req, res) => controller.criar(req, res));

avaliacaoRouter.get("/", (req, res) => controller.buscarTodos(req, res));
avaliacaoRouter.get("/:id", (req, res) => controller.buscarPorId(req, res));
avaliacaoRouter.get("/ranking/usuarios", (req, res) => controller.rankingUsuarios(req, res));
avaliacaoRouter.get("/ranking/obras", (req, res) => controller.rankingObras(req, res));

avaliacaoRouter.put("/:id", (req, res) => controller.atualizar(req, res));

avaliacaoRouter.delete("/:id", (req, res) => controller.deletar(req, res));

export { avaliacaoRouter };