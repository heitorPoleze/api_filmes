import { app } from "./config/app.ts";
import { connectDB } from "./config/database.ts";
import { SeedDatabaseService } from "./services/SeedDatabaseService.ts";

const start = async () =>{
    const PORT = process.env.PORT || 3333;
    app.listen(PORT, () => console.log("rodando na porta ", PORT));
    await connectDB();

    const seeder = new SeedDatabaseService();
    await seeder.executar();
}

start();