import { app } from "./config/app.ts";
import { connectDB } from "./config/database.ts";
import { SeedDatabaseService } from "./services/SeedDatabaseService.ts";

const start = async () =>{
    app.listen(3000, () => console.log("rodando na porta 3000"));
    await connectDB();

    const seeder = new SeedDatabaseService();
    await seeder.executar();
}

start();