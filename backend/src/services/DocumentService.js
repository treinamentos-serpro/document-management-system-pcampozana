// Service que implementa a lógica de negócio de documentos.
// Camada intermediária da Clean Architecture (regras de negócio).

const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('crypto');
const DocumentRepository = require('../repositories/DocumentRepository');

// Instância do repositório
const repository = new DocumentRepository();

// Configurações
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '10485760', 10); // 10MB padrão
const STORAGE_PATH = process.env.STORAGE_PATH || path.join(__dirname, '../../storage');

/**
 * Service responsável pela lógica de negócio de documentos.
 * Valida, processa e orquestra operações com o repositório.
 */
class DocumentService {
  /**
   * Faz upload de um documento.
   * @param {Object} file - Objeto do arquivo do multer
   * @param {string} owner - Identificador do usuário proprietário
   * @returns {Object} - Metadados do documento criado
   * @throws {Error} - Se validação falhar
   */
  uploadDocument(file, owner) {
    // Validar entrada
    if (!file) {
      throw new Error('Arquivo é obrigatório');
    }
    if (!owner) {
      throw new Error('Owner é obrigatório');
    }

    // Validar tamanho (multer já faz isso, mas validamos novamente por segurança)
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('Arquivo excede o tamanho máximo de 10MB');
    }

    // Criar metadados do documento
    const documentId = uuidv4();
    const metadata = {
      id: documentId,
      originalName: file.originalname,
      filename: file.filename,
      size: file.size,
      mimetype: file.mimetype,
      uploadedAt: new Date().toISOString(),
      owner: owner,
      storagePath: path.join(STORAGE_PATH, file.filename)
    };

    // Salvar no repositório
    return repository.create(metadata);
  }

  /**
   * Lista todos os documentos de um usuário.
   * @param {string} owner - Identificador do usuário proprietário
   * @returns {Array} - Lista de documentos (sem storagePath)
   * @throws {Error} - Se owner não for fornecido
   */
  getDocuments(owner) {
    if (!owner) {
      throw new Error('Owner é obrigatório');
    }

    const docs = repository.findByOwner(owner);
    
    // Retornar documento sem informações sensíveis (storagePath)
    return docs.map(doc => ({
      id: doc.id,
      originalName: doc.originalName,
      size: doc.size,
      mimetype: doc.mimetype,
      uploadedAt: doc.uploadedAt,
      owner: doc.owner
    }));
  }

  /**
   * Baixa um documento específico.
   * Valida permissões e retorna metadados completos para leitura do arquivo.
   * @param {string} id - ID único do documento
   * @param {string} owner - Identificador do usuário (para validar acesso)
   * @returns {Object} - Metadados do documento incluindo storagePath
   * @throws {Error} - Se documento não existe ou acesso negado
   */
  downloadDocument(id, owner) {
    if (!id) {
      throw new Error('ID do documento é obrigatório');
    }
    if (!owner) {
      throw new Error('Owner é obrigatório');
    }

    const document = repository.findById(id);

    if (!document) {
      throw new Error('Documento não encontrado');
    }

    // Validar permissão: só o proprietário pode baixar
    if (document.owner !== owner) {
      throw new Error('Acesso negado a este documento');
    }

    return document;
  }

  /**
   * Deleta um documento.
   * @param {string} id - ID único do documento
   * @param {string} owner - Identificador do usuário (para validar proprietário)
   * @returns {boolean} - true se deletado
   * @throws {Error} - Se documento não existe ou acesso negado
   */
  deleteDocument(id, owner) {
    if (!id || !owner) {
      throw new Error('ID e owner são obrigatórios');
    }

    const document = repository.findById(id);

    if (!document) {
      throw new Error('Documento não encontrado');
    }

    if (document.owner !== owner) {
      throw new Error('Acesso negado a este documento');
    }

    // Deletar arquivo do filesystem
    try {
      if (fs.existsSync(document.storagePath)) {
        fs.unlinkSync(document.storagePath);
      }
    } catch (err) {
      console.error(`Erro ao deletar arquivo: ${err.message}`);
    }

    // Deletar metadados do repositório
    return repository.delete(id);
  }
}

module.exports = DocumentService;
