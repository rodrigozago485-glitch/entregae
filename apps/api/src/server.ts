
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3333;

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

// Rota principal
app.get("/", (req, res) => {
  return res.status(200).json({
    status: "online",
    message: "Bem-vindo à API do Entregaê!",
    version: "1.0.0",
  });
});

// Rota de teste
app.get("/health", (req, res) => {
  return res.status(200).json({
    status: "online",
    message: "API do Entregaê funcionando!",
    timestamp: new Date().toISOString(),
  });
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor do Entregaê rodando em http://localhost:${PORT}`);
});
