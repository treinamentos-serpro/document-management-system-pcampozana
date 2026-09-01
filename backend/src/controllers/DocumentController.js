// Controller para listagem e download de documentos.
// Camada externa da Clean Architecture (entrada HTTP).

const fs = require('fs');
const DocumentService = require('../services/DocumentService');

const service = new DocumentService();

/**
 * Controller para endpoints GET /documents e GET /documents/:id/download
 */
class DocumentController {
  /**
   * Handler para GET /documents
   * Lista todos os documentos do usuário.
   * @param {Object} req - Requisição Express
   * @param {Object} res - Resposta Express
   */
  async list(req, res) {
    try {
      const owner = req.query.owner;

      if (!owner) {
        return res.status(400).json({
          success: false,
          error: 'Parâmetro owner é obrigatório'
        });
      }

      // Chamar service
      const documents = service.getDocuments(owner);

      return res.status(200).json({
        success: true,
        data: documents
      });
    } catch (error) {
      console.error(`Erro ao listar documentos: ${error.message}`);

      return res.status(500).json({
        success: false,
        error: error.message || 'Erro ao listar documentos'
      });
    }
  }

  /**
   * Handler para GET /documents/:id/download
   * Faz download de um documento específico.
   * @param {Object} req - Requisição Express
   * @param {Object} res - Resposta Express
   */
  async download(req, res) {
    try {
      const { id } = req.params;
      const owner = req.query.owner;

      if (!owner) {
        return res.status(400).json({
          success: false,
          error: 'Parâmetro owner é obrigatório'
        });
      }

      // Chamar service para validar acesso
      const document = service.downloadDocument(id, owner);

      // Validar se arquivo existe no filesystem
      if (!fs.existsSync(document.storagePath)) {
        return res.status(404).json({
          success: false,
          error: 'Arquivo não encontrado no servidor'
        });
      }

      // Configurar headers para download
      res.setHeader('Content-Type', document.mimetype || 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename="${document.originalName}"`);
      res.setHeader('Content-Length', document.size);

      // Stream do arquivo para download
      const fileStream = fs.createReadStream(document.storagePath);

      fileStream.on('error', (err) => {
        console.error(`Erro ao ler arquivo: ${err.message}`);
        res.status(500).json({
          success: false,
          error: 'Erro ao processar download'
        });
      });

      fileStream.pipe(res);
    } catch (error) {
      console.error(`Erro ao fazer download: ${error.message}`);

      // Tratamento específico de acesso negado
      if (error.message === 'Acesso negado a este documento') {
        return res.status(403).json({
          success: false,
          error: error.message
        });
      }

      // Tratamento específico de documento não encontrado
      if (error.message === 'Documento não encontrado') {
        return res.status(404).json({
          success: false,
          error: error.message
        });
      }

      return res.status(500).json({
        success: false,
        error: error.message || 'Erro ao processar download'
      });
    }
  }
}

module.exports = DocumentController;
