import express, { Application } from "express";
import connectDB from "./configs/db";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();

connectDB();

//middlewares
app.use(express.json());

//rutas

app.get("/", (req, res) => {
    res.json("Funcionando correctamente")
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API lista: http:/localhost:${PORT}/`);
});
