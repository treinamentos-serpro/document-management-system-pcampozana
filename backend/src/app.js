// Servidor backend do Document Management System.
// Arquitetura: Clean Architecture simples com 4 camadas (routes → controllers → services → repositories).
// Persistência: Armazenamento local via multer com diskStorage; metadados em memória.

require('dotenv').config();

const express = require('express');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware: parsear JSON
app.use(express.json());

// Middleware: CORS
// Permite requisições do frontend (Vite dev server por padrão em localhost:5173)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

// Rotas de saúde
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Rotas da API
app.use('/api', apiRoutes);

// Middleware: tratamento de rotas não encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Rota não encontrada'
  });
});

// Middleware: tratamento de erros global
app.use((err, req, res, next) => {
  console.error(`Erro não tratado: ${err.message}`);

  res.status(500).json({
    success: false,
    error: 'Erro interno do servidor'
  });
});

// Iniciar servidor se este arquivo for executado diretamente
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`DMS backend ouvindo na porta ${PORT} (${process.env.NODE_ENV || 'development'})`);
  });
}

module.exports = app;
