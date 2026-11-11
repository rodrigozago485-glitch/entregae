
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3333;

// Middlewares
app.use(cors({
  origin: "http://localhost:5173"
}));

app.use(express.json());

// Rota de teste
app.get("/health", (req, res) => {
  return res.status(200).json({
    status: "online",
    message: "API do Delivery funcionando!",
    timestamp: new Date().toISOString()
  });
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
