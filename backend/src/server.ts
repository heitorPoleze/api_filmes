import { app } from "./config/app.ts";
import { connectDB } from "./config/database.ts";
import { SeedAvaliacoesService } from "./services/seeders/SeedAvaliacoesService.ts";
import { SeedUsuariosService } from "./services/seeders/SeedUsuariosService.ts";
import { SeedObrasService } from "./services/SeedObrasService.ts";

const start = async () =>{
    const PORT = process.env.PORT || 3333;
    app.listen(PORT, () => console.log("rodando na porta ", PORT));
    await connectDB();

    const obraSeeder = new SeedObrasService();
    await obraSeeder.executar();

    const userSeeder = new SeedUsuariosService();
    await userSeeder.executar();

    const avaliacaoSeeder = new SeedAvaliacoesService();
    await avaliacaoSeeder.executar();
}

start();