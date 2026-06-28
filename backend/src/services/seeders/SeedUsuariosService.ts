import { UsuarioModel } from "../../entities/models/UsuarioModel.ts";

export class SeedUsuariosService {
    private readonly mockUsuarios = [
        {nome: "Helenilson", email: "helen.herron.taft@my-own-personal-domain.com"},
        {nome: "Marivalda", email: "marivaldinha@ze.com"},
        {nome: "Ezequiel Zezao", email: "ezequilewsoin@gmail.com"},
        {nome: "Jabiracuseithons", email: "cobra@gmail.com"},
        {nome: "Heitor Dias", email: "heitor@heitor.com"}
    ]
    
    async executar(): Promise<void> {
        try {
            const totalUsers = await UsuarioModel.countDocuments();
            if (totalUsers < 5) {
                await UsuarioModel.deleteMany({});

                await UsuarioModel.insertMany(this.mockUsuarios);
                
                console.log("Usuários inseridos com sucesso no banco de dados.");
            }
            else {
                console.log("Cadastros suficientes de Usuários no Banco de Dados.")
            }
        }catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error("Erro desconhecido ao Seedear o Banco de Dados.");
        }
    }
}