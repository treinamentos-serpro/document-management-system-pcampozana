// Repository para gerenciar metadados de documentos em memória.
// Camada mais baixa da Clean Architecture (dados).

const documents = {};

/**
 * Repository responsável pela persistência de metadados de documentos.
 * Nesta fase, os metadados são armazenados em memória (objeto JavaScript).
 * Futuramente, pode ser substituído por um banco de dados.
 */
class DocumentRepository {
  /**
   * Cria um novo registro de documento em memória.
   * @param {Object} metadata - Metadados do documento
   * @returns {Object} - Metadados salvos
   */
  create(metadata) {
    documents[metadata.id] = metadata;
    return metadata;
  }

  /**
   * Busca um documento pelo ID.
   * @param {string} id - ID único do documento (UUID)
   * @returns {Object|null} - Documento encontrado ou null
   */
  findById(id) {
    return documents[id] || null;
  }

  /**
   * Lista todos os documentos de um proprietário específico.
   * @param {string} owner - Identificador do usuário proprietário
   * @returns {Array} - Lista de documentos do proprietário
   */
  findByOwner(owner) {
    return Object.values(documents).filter(doc => doc.owner === owner);
  }

  /**
   * Remove um documento pelo ID.
   * @param {string} id - ID único do documento
   * @returns {boolean} - true se removido, false se não encontrado
   */
  delete(id) {
    if (documents[id]) {
      delete documents[id];
      return true;
    }
    return false;
  }

  /**
   * Retorna todos os documentos (apenas para testes/debug).
   * @returns {Array} - Lista de todos os documentos
   */
  findAll() {
    return Object.values(documents);
  }
}

module.exports = DocumentRepository;
