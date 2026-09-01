# 🚀 Document Management System - Guia de Uso

## 📦 Início Rápido

### Terminal 1: Backend (Express)

```bash
cd backend
npm install
npm start
```

Servidor escuta em `http://localhost:3000`

**Variáveis de ambiente disponíveis (em `.env`):**
```
PORT=3000
NODE_ENV=development
STORAGE_PATH=./backend/storage
MAX_FILE_SIZE=10485760
CORS_ORIGIN=http://localhost:5173
```

---

### Terminal 2: Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Acesse em `http://localhost:5173`

---

## 📝 Como Usar

### 1. Iniciar
- Abra http://localhost:5173 no navegador
- Digite seu email ou usuário (ex: `usuario@test.com`)

### 2. Fazer Upload
- Clique em "Selecionar arquivo"
- Escolha qualquer arquivo (máx 10MB)
- Clique em "Enviar"
- Lista atualiza automaticamente ✅

### 3. Listar Documentos
- Todos seus documentos aparecem na tabela
- Mostra: Nome, Tamanho, Data, Ação

### 4. Fazer Download
- Clique no botão "Baixar"
- Arquivo salva no seu computador
- Nome original é preservado ✓

---

## 🧪 Testar via cURL

### Upload
```bash
curl -X POST http://localhost:3000/api/upload \
  -F "file=@seu-arquivo.pdf" \
  -F "owner=usuario@test.com"
```

### Listar
```bash
curl "http://localhost:3000/api/documents?owner=usuario@test.com"
```

### Download
```bash
curl "http://localhost:3000/api/documents/{id}/download?owner=usuario@test.com" \
  -o arquivo-baixado.pdf
```

---

## 🏗️ Arquitetura

### Backend (Clean Architecture)
```
routes/ → controllers/ → services/ → repositories/
```

- **routes/apiRoutes.js**: endpoints HTTP
- **controllers/**: UploadController, DocumentController
- **services/DocumentService.js**: lógica de negócio
- **repositories/DocumentRepository.js**: dados em memória
- **config/multerConfig.js**: upload com diskStorage

### Frontend (React)
```
components/ → services/api.js → App.jsx
```

- **UploadForm.jsx**: formulário de upload
- **DocumentList.jsx**: tabela com downloads
- **api.js**: serviço HTTP centralizado

---

## 📊 Testes

### Backend
```bash
cd backend
npm test
```

11 testes unitários cobrindo:
- Repository (CRUD em memória)
- Service (validações e lógica)
- Controllers (integração HTTP)

---

## 🐛 Solução de Problemas

### "Rota não encontrada"
✅ **Resolvido!** Proxy do Vite agora funciona corretamente.

### Arquivo não faz upload
- Verifique se o arquivo é < 10MB
- Confirme que backend está rodando na porta 3000

### Download vazio
- Certifique-se que está usando o mesmo `owner` para upload e download
- Tente fazer logout/login (limpar localStorage)

---

## 📁 Estrutura de Arquivos

```
backend/
  src/
    config/multerConfig.js      → Configuração do multer
    controllers/
      UploadController.js       → POST /api/upload
      DocumentController.js     → GET /api/documents, /api/documents/:id/download
    routes/apiRoutes.js         → Roteador HTTP
    services/DocumentService.js → Lógica de negócio
    repositories/DocumentRepository.js → Dados em memória
    app.js                      → Servidor Express
  storage/                       → Arquivos enviados
  test/                          → Testes unitários

frontend/
  src/
    components/
      UploadForm.jsx            → Formulário de upload
      DocumentList.jsx          → Tabela de documentos
    services/api.js             → Cliente HTTP
    App.jsx                      → Componente principal
  vite.config.js                → Proxy /api → localhost:3000
```

---

## 🔑 Recursos

- ✅ Upload com armazenamento local (multer)
- ✅ Metadados em memória
- ✅ Download com permissões de acesso
- ✅ Interface React responsiva
- ✅ Testes automatizados
- ✅ CORS configurado
- ✅ Proxy Vite para dev

---

## 📝 Especificação Completa

Ver [docs/specs/dms-spec.md](../docs/specs/dms-spec.md) para:
- Requisitos funcionais e não-funcionais
- Contratos de API com exemplos
- Modelo de dados
- Plano de implementação

---

**Pronto para usar! 🎉**
