// Rotas da API do Document Management System.
// Define os endpoints e conecta aos controllers.

const express = require('express');
const upload = require('../config/multerConfig');
const UploadController = require('../controllers/UploadController');
const DocumentController = require('../controllers/DocumentController');

const router = express.Router();

// Instanciar controllers
const uploadController = new UploadController();
const documentController = new DocumentController();

/**
 * POST /api/upload
 * Faz upload de um documento.
 * Multipart form-data com campos: file (arquivo), owner (usuário)
 */
router.post('/upload', upload.single('file'), (req, res) => {
  uploadController.upload(req, res);
});

/**
 * GET /api/documents
 * Lista documentos do usuário.
 * Query param: owner (obrigatório)
 */
router.get('/documents', (req, res) => {
  documentController.list(req, res);
});

/**
 * GET /api/documents/:id/download
 * Faz download de um documento específico.
 * Path param: id (UUID do documento)
 * Query param: owner (obrigatório)
 */
router.get('/documents/:id/download', (req, res) => {
  documentController.download(req, res);
});

module.exports = router;
