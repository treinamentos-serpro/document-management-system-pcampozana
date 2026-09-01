# Especificação - Document Management System

> Especificação técnica completa para orientar o desenvolvimento guiado por
> especificação (Spec Driven Development). Versão 1.0.

## 1. Objetivo

Entregar um sistema web que permite ao usuário fazer upload de documentos,
listá-los e baixá-los de forma segura, com armazenamento local e gestão
simples por usuário.

## 2. Escopo

### Dentro do escopo

- Upload de um ou mais documentos em formato binário via formulário multipart
- Listagem de documentos enviados pelo usuário autenticado
- Download de documentos pelo identificador único
- Armazenamento de metadados em memória
- Gravação de arquivos no filesystem local via multer
- Configuração da aplicação via variáveis de ambiente (12-Factor App)
- Interface web simples com React

### Fora do escopo

- Armazenamento externo (S3, Google Cloud Storage, etc)
- Serviços de upload de terceiros
- Versionamento de documentos
- Autenticação/autorização avançada (OAuth, JWT)
- Busca full-text de documentos
- Compressão ou transformação de arquivos
- Backup automático

## 3. Requisitos Funcionais

| ID    | Descrição                                                          | Prioridade |
| ----- | ------------------------------------------------------------------ | ---------- |
| RF-01 | O usuário pode fazer upload de um documento                        | Alta       |
| RF-02 | O sistema valida o arquivo antes de aceitar o upload               | Alta       |
| RF-03 | O sistema retorna os metadados do documento após upload bem-sucedido| Alta       |
| RF-04 | O usuário pode listar todos os seus documentos                     | Alta       |
| RF-05 | A listagem exibe nome original, tamanho, data e ID único            | Alta       |
| RF-06 | O usuário pode baixar um documento pelo ID                         | Alta       |
| RF-07 | O sistema retorna o arquivo com o content-type correto             | Alta       |
| RF-08 | O sistema retorna erro se o documento não existe                   | Alta       |
| RF-09 | O sistema retorna erro se o ID do documento não pertence ao usuário| Alta       |

## 4. Requisitos Não Funcionais

| ID     | Descrição                                                    | Prioridade |
| ------ | ------------------------------------------------------------ | ---------- |
| RNF-01 | Arquivos gravados no filesystem local via multer diskStorage | Alta       |
| RNF-02 | Metadados mantidos em memória (sem banco de dados)           | Alta       |
| RNF-03 | Configuração via variáveis de ambiente (.env)                | Alta       |
| RNF-04 | Backend em Node.js + Express (CommonJS)                      | Alta       |
| RNF-05 | Frontend em React + Vite (ESM)                               | Alta       |
| RNF-06 | Sem TypeScript (JavaScript puro)                             | Alta       |
| RNF-07 | Máximo 10MB por arquivo (validado no backend)                | Média      |
| RNF-08 | Tempo de resposta < 500ms para listagem de até 100 docs      | Média      |
| RNF-09 | Código segue SOLID, DRY, KISS, YAGNI                         | Alta       |
| RNF-10 | Código sem overengineering ou abstrações desnecessárias      | Alta       |

## 5. Modelo de Dados

### Documento (Metadados)

Estrutura de dados mantida em memória representando um documento:

| Campo       | Tipo   | Obrigatório | Descrição                              |
| ----------- | ------ | ----------- | -------------------------------------- |
| id          | string | Sim         | UUID v4, identificador único           |
| originalName| string | Sim         | Nome original do arquivo enviado       |
| filename    | string | Sim         | Nome armazenado no filesystem (hashed) |
| size        | number | Sim         | Tamanho em bytes                       |
| mimetype    | string | Sim         | MIME type (ex: application/pdf)        |
| uploadedAt  | string | Sim         | Data/hora ISO 8601 UTC                 |
| owner       | string | Sim         | ID do usuário dono (username/email)    |
| storagePath | string | Sim         | Caminho relativo em `backend/storage`  |

**Exemplo de objeto documento:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "originalName": "relatorio-vendas.pdf",
  "filename": "550e8400-e29b-41d4-a716-446655440000.pdf",
  "size": 2048576,
  "mimetype": "application/pdf",
  "uploadedAt": "2025-01-15T14:30:45.000Z",
  "owner": "usuario@example.com",
  "storagePath": "backend/storage/550e8400-e29b-41d4-a716-446655440000.pdf"
}
```

## 6. Contratos de API

Todos os endpoints estão prefixados com `/api`.

### 6.1 POST /api/upload

Faz upload de um documento.

**Requisição:**

- **Método:** POST
- **Content-Type:** multipart/form-data
- **Parâmetros do corpo:**
  - `file` (obrigatório): arquivo binário
  - `owner` (obrigatório): identificador do usuário (username ou email)

**Exemplo de requisição (curl):**

```bash
curl -X POST http://localhost:3000/api/upload \
  -F "file=@relatorio.pdf" \
  -F "owner=usuario@example.com"
```

**Resposta (201 Created):**

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "originalName": "relatorio-vendas.pdf",
    "size": 2048576,
    "mimetype": "application/pdf",
    "uploadedAt": "2025-01-15T14:30:45.000Z",
    "owner": "usuario@example.com"
  }
}
```

**Respostas de erro:**

- **400 Bad Request** - arquivo não fornecido ou owner ausente

```json
{
  "success": false,
  "error": "Arquivo e owner são obrigatórios"
}
```

- **413 Payload Too Large** - arquivo maior que 10MB

```json
{
  "success": false,
  "error": "Arquivo excede o tamanho máximo de 10MB"
}
```

- **500 Internal Server Error** - erro ao gravar arquivo

```json
{
  "success": false,
  "error": "Erro ao processar upload"
}
```

---

### 6.2 GET /api/documents

Lista todos os documentos do usuário.

**Requisição:**

- **Método:** GET
- **Query Parameters:**
  - `owner` (obrigatório): identificador do usuário

**Exemplo de requisição:**

```bash
curl "http://localhost:3000/api/documents?owner=usuario@example.com"
```

**Resposta (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "originalName": "relatorio-vendas.pdf",
      "size": 2048576,
      "mimetype": "application/pdf",
      "uploadedAt": "2025-01-15T14:30:45.000Z",
      "owner": "usuario@example.com"
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "originalName": "planilha-orcamento.xlsx",
      "size": 512000,
      "mimetype": "application/vnd.ms-excel",
      "uploadedAt": "2025-01-14T10:15:20.000Z",
      "owner": "usuario@example.com"
    }
  ]
}
```

**Respostas de erro:**

- **400 Bad Request** - owner ausente

```json
{
  "success": false,
  "error": "Parâmetro owner é obrigatório"
}
```

- **200 OK (lista vazia)**

```json
{
  "success": true,
  "data": []
}
```

---

### 6.3 GET /api/documents/:id/download

Baixa um documento específico.

**Requisição:**

- **Método:** GET
- **Path Parameters:**
  - `id` (obrigatório): UUID do documento
- **Query Parameters:**
  - `owner` (obrigatório): identificador do usuário

**Exemplo de requisição:**

```bash
curl -O "http://localhost:3000/api/documents/550e8400-e29b-41d4-a716-446655440000/download?owner=usuario@example.com"
```

**Resposta (200 OK):**

- **Content-Type:** conforme o MIME type do arquivo (application/pdf, text/plain, etc)
- **Content-Disposition:** attachment; filename="{originalName}"
- **Corpo:** conteúdo binário do arquivo

**Respostas de erro:**

- **400 Bad Request** - id ou owner ausente

```json
{
  "success": false,
  "error": "Parâmetro owner é obrigatório"
}
```

- **404 Not Found** - documento não existe

```json
{
  "success": false,
  "error": "Documento não encontrado"
}
```

- **403 Forbidden** - documento não pertence ao usuário

```json
{
  "success": false,
  "error": "Acesso negado a este documento"
}
```

- **500 Internal Server Error** - erro ao ler arquivo

```json
{
  "success": false,
  "error": "Erro ao processar download"
}
```

---

## 7. Decisões Arquiteturais

### 7.1 Clean Architecture Simples

O backend segue Clean Architecture em 4 camadas:

```
routes/ → controllers/ → services/ → repositories/
```

- **routes/**: definem endpoints e delegam para controllers
- **controllers/**: tratam entrada/saída HTTP e validação básica
- **services/**: concentram regras de negócio
- **repositories/**: cuidam da persistência (filesystem)

Fluxo de dependência: `routes -> controllers -> services -> repositories`.
Camadas internas não conhecem camadas externas.

### 7.2 Armazenamento Local com Multer

- Arquivos são gravados em `backend/storage/{uuid}.{ext}`
- Multer utiliza `diskStorage` (não memória)
- Nomes de arquivo são hasheados com UUID para evitar colisões
- Metadados armazenados em memória (estrutura de dados JavaScript)

### 7.3 Frontend Componentes React

- Componentes funcionais com React Hooks
- Estrutura: `components/`, `pages/`, `services/`
- Comunicação via `fetch` com proxy `/api` (Vite)
- Sem TypeScript, JavaScript puro com comentários em português

### 7.4 Variáveis de Ambiente

Aplicação segue 12-Factor App:

- `.env` na raiz do backend (não commitado)
- `NODE_ENV`, `PORT`, `STORAGE_PATH`, `MAX_FILE_SIZE` configuráveis
- Valores padrão seguros no código

---

## 8. Plano de Execução

Implementação em 5 fases sequenciais. Cada fase é independentemente testável.

### Fase 1: Setup do Backend (Dias 1-2)

**Objetivo:** Estrutura inicial, dependências, configuração.

- [ ] Inicializar projeto com `npm init`
- [ ] Instalar dependências: express, multer, cors, dotenv
- [ ] Criar estrutura de pastas: `src/routes`, `src/controllers`, `src/services`, `src/repositories`
- [ ] Implementar middleware de CORS e body-parser
- [ ] Configurar variáveis de ambiente (.env, .env.example)
- [ ] Criar `backend/storage/` para armazenamento de arquivos
- [ ] Configurar eslint com regras de estilo
- [ ] Teste manual: servidor inicia sem erros

**Verificação:** `npm start` executa sem erros, servidor escuta na porta configurada.

---

### Fase 2: Setup do Frontend (Dias 2-3)

**Objetivo:** Estrutura React, build, proxy API.

- [ ] Inicializar projeto com `npm create vite@latest -- --template react`
- [ ] Instalar dependências do projeto
- [ ] Configurar proxy `/api` no `vite.config.js` para `http://localhost:3000`
- [ ] Criar estrutura de pastas: `src/components`, `src/pages`, `src/services`
- [ ] Implementar `src/services/api.js` com funções genéricas de fetch
- [ ] Criar layout base com header e container
- [ ] Teste manual: `npm run dev` executa sem erros, página carrega no navegador

**Verificação:** Frontend carrega sem erros, proxy configurado (network tab mostra `/api/*`).

---

### Fase 3: Features Backend (Dias 3-5)

**Objetivo:** Endpoints de upload, listagem e download.

- [ ] **Repository:** Implementar `DocumentRepository` com métodos:
  - `create(metadata)` - salva metadados em memória
  - `findById(id)` - busca documento por ID
  - `findByOwner(owner)` - lista documentos do usuário
  - `delete(id)` - remove documento (opcional para MVP)

- [ ] **Service:** Implementar `DocumentService` com lógica de negócio:
  - `uploadDocument(file, owner)` - valida e cria documento
  - `getDocuments(owner)` - retorna lista
  - `downloadDocument(id, owner)` - valida acesso e retorna metadados
  - Validação de tamanho máximo (10MB)
  - Geração de UUID para cada documento

- [ ] **Controller:** Implementar `UploadController`:
  - `POST /upload` - recebe file + owner via multer, chama service
  - Tratamento de erros (400, 413, 500)
  - Resposta em JSON estruturado

- [ ] **Controller:** Implementar `DocumentController`:
  - `GET /documents` - lista documentos do owner
  - `GET /documents/:id/download` - retorna arquivo binário
  - Tratamento de erros (400, 403, 404, 500)

- [ ] **Route:** Conectar `/api/upload`, `/api/documents`, `/api/documents/:id/download`

- [ ] Testes unitários para cada camada (repository, service)

**Verificação:** 
- `POST /api/upload` salva arquivo e retorna metadados
- `GET /api/documents?owner=user` lista documentos
- `GET /api/documents/{id}/download?owner=user` baixa arquivo
- Validações funcionam (sem arquivo, sem owner, ID inexistente, acesso negado)

---

### Fase 4: Features Frontend (Dias 5-7)

**Objetivo:** Interface de upload, listagem e download.

- [ ] **Componente `UploadForm`:**
  - Input file
  - Input de email/usuário
  - Botão submit
  - Feedback de carregamento (spinner)
  - Mensagens de erro/sucesso

- [ ] **Componente `DocumentList`:**
  - Tabela ou cards mostrando documentos
  - Colunas: Nome, Tamanho, Data, Ação (Download)
  - Botão "Download" que chama `/api/documents/:id/download`

- [ ] **Página `App` (ou `HomePage`):**
  - Integra UploadForm e DocumentList
  - Estado para owner (localStorage ou input)
  - Recarrega lista após upload bem-sucedido
  - Integração com `src/services/api.js`

- [ ] **Service `DocumentService.js`:**
  - `uploadDocument(file, owner)` - POST /api/upload
  - `listDocuments(owner)` - GET /api/documents
  - `downloadDocument(id, owner)` - GET /api/documents/{id}/download (blob)

- [ ] Styling básico (CSS ou Tailwind)

**Verificação:**
- Upload funciona: arquivo é enviado, lista atualiza automaticamente
- Listagem exibe documentos corretos
- Download funciona: arquivo é salvo no dispositivo
- Mensagens de erro são exibidas ao usuário

---

### Fase 5: Testes e Validação (Dias 7-8)

**Objetivo:** Cobertura de testes, validação de requisitos.

- [ ] **Testes Backend:**
  - `test/repositories/DocumentRepository.test.js` - CRUD em memória
  - `test/services/DocumentService.test.js` - lógica de negócio, validações
  - `test/controllers/UploadController.test.js` - integração com multer
  - `test/controllers/DocumentController.test.js` - listagem e download
  - Rodar: `npm test`

- [ ] **Testes Frontend (opcional para MVP):**
  - `src/components/__tests__/UploadForm.test.jsx`
  - `src/components/__tests__/DocumentList.test.jsx`
  - Usando Vitest ou Jest

- [ ] **Testes Manuais (Integration):**
  - Subir ambos os servidores (backend e frontend)
  - Fazer upload de arquivo > 10MB (deve rejeitar)
  - Fazer upload de arquivo válido (deve aceitar)
  - Listar documentos (deve mostrar o enviado)
  - Fazer download (deve retornar arquivo)
  - Acessar documento de outro usuário (deve negar acesso)
  - Acessar ID inexistente (deve retornar 404)

- [ ] **Validação de Requisitos:**
  - Checklist: todos os RF-01 a RF-09 implementados?
  - Checklist: todos os RNF-01 a RNF-10 atendidos?
  - Documentação atualizada (README, INSTALL)

- [ ] Deploy local documentado (passos para rodar em outra máquina)

**Verificação:**
- `npm test` (backend) passa com cobertura > 80%
- Todos os requisitos funcionais validados manualmente
- Aplicação roda sem erros em nova instalação

---

## 9. Critérios de Aceitação

- ✓ Usuário consegue fazer upload de documento com sucesso
- ✓ Documento é armazenado localmente no filesystem
- ✓ Metadados são mantidos em memória e retornados corretamente
- ✓ Usuário consegue listar seus documentos
- ✓ Usuário consegue baixar um documento pelo ID
- ✓ Sistema valida permissões (usuário não acessa documentos de outro)
- ✓ Código segue Clean Architecture com 4 camadas bem definidas
- ✓ Testes cobrem camadas service e repository (>80%)
- ✓ Interface funciona sem erros no navegador moderno
- ✓ Configuração via variáveis de ambiente funciona

---

## 10. Riscos e Mitigações

| Risco                          | Impacto | Probabilidade | Mitigação                             |
| ------------------------------ | ------- | ------------- | ------------------------------------- |
| Perda de arquivo ao reiniciar  | Alto    | Média         | Documentar que metadados são em memória (MVP) |
| Multer falha ao gravar arquivo | Alto    | Baixa         | Testes de escrita em disco, tratamento de erro |
| Frontend não conecta ao backend| Alto    | Baixa         | Configurar proxy Vite, testar CORS    |
| Segurança: acesso não autorizado| Alto    | Média         | Validar owner em cada endpoint        |
| Espaço em disco insuficiente   | Médio   | Baixa         | Documentar limite de storage          |

---

## 11. Glossário

| Termo         | Definição                                                |
| ------------- | -------------------------------------------------------- |
| Owner         | Identificador do usuário dono do documento               |
| UUID          | Identificador único universal (RFC 4122)                 |
| Multer        | Middleware Node.js para upload de arquivos               |
| DiskStorage   | Estratégia de multer que grava em disco                  |
| Metadados     | Informações sobre o documento (nome, tamanho, data, etc) |
| 12-Factor App | Metodologia de design para aplicações cloud-ready        |
| Clean Architecture | Padrão de organização de código em camadas            |

---

**Data:** 2025-01-15  
**Versão:** 1.0  
**Status:** Pronto para implementação
