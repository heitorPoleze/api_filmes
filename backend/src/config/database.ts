import * as dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

export const connectDB = async () => {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/catalogo_filmes';
    
    try{
        await mongoose.connect(mongoURI);
        console.log("Banco conectado com sucesso!");
    }catch (error){
        if(error instanceof Error){
            console.error(error.message);
        }else{
            console.error("Erro desconhecido ao conectar ao banco de dados.");
        }

    }
}