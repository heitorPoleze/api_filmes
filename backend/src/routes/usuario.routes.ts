import { Router } from "express";
import { UsuarioController } from "../controllers/UsuarioController.ts";

const userRoutes = Router();
const usuarioController = new UsuarioController();

userRoutes.post("/", (req, res) => usuarioController.criarUsuario(req, res));
userRoutes.post("/muitos", (req, res) => usuarioController.criarMuitos(req, res));

userRoutes.get("/", (req, res) => usuarioController.buscarTodos(req, res));
userRoutes.get("/:id", (req, res) => usuarioController.buscarPorId(req, res));

userRoutes.put("/:id", (req, res) => usuarioController.atualizar(req, res));

userRoutes.delete("/:id", (req, res) => usuarioController.deletar(req, res));

userRoutes.post("/:idUser/favoritos/:idObra", (req, res) => usuarioController.adicionarFavorito(req, res));
userRoutes.delete("/:idUser/favoritos/:idObra", (req, res) => usuarioController.removerFavorito(req, res));

export {userRoutes};