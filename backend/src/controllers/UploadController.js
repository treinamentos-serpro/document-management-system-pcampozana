// Controller para upload de documentos.
// Camada externa da Clean Architecture (entrada HTTP).

const DocumentService = require('../services/DocumentService');

const service = new DocumentService();

/**
 * Controller para o endpoint POST /upload.
 * Recebe arquivo + owner e delega para o service.
 */
class UploadController {
  /**
   * Handler para POST /upload
   * @param {Object} req - Requisição Express
   * @param {Object} res - Resposta Express
   */
  async upload(req, res) {
    try {
      // Validar entrada
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'Arquivo é obrigatório'
        });
      }

      const owner = req.body.owner || req.query.owner;
      if (!owner) {
        return res.status(400).json({
          success: false,
          error: 'Parâmetro owner é obrigatório'
        });
      }

      // Chamar service
      const metadata = service.uploadDocument(req.file, owner);

      // Retornar resposta com metadados (sem storagePath)
      return res.status(201).json({
        success: true,
        data: {
          id: metadata.id,
          originalName: metadata.originalName,
          size: metadata.size,
          mimetype: metadata.mimetype,
          uploadedAt: metadata.uploadedAt,
          owner: metadata.owner
        }
      });
    } catch (error) {
      console.error(`Erro ao fazer upload: ${error.message}`);

      // Tratamento de erro específico: arquivo muito grande
      if (error.message.includes('excede')) {
        return res.status(413).json({
          success: false,
          error: error.message
        });
      }

      return res.status(500).json({
        success: false,
        error: error.message || 'Erro ao processar upload'
      });
    }
  }
}

module.exports = UploadController;
