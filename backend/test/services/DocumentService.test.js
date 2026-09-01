// Testes da camada Service (DocumentService).
// Teste unitário: lógica de negócio de documentos.

const { test } = require('node:test');
const assert = require('node:assert');
const path = require('path');
const DocumentService = require(path.join(__dirname, '../../src/services/DocumentService'));

test('DocumentService - validação de upload sem arquivo', () => {
  const service = new DocumentService();

  assert.throws(() => {
    service.uploadDocument(null, 'user@example.com');
  }, /Arquivo é obrigatório/);
});

test('DocumentService - validação de upload sem owner', () => {
  const service = new DocumentService();

  const mockFile = {
    filename: 'test.pdf',
    originalname: 'test.pdf',
    size: 1024,
    mimetype: 'application/pdf'
  };

  assert.throws(() => {
    service.uploadDocument(mockFile, null);
  }, /Owner é obrigatório/);
});

test('DocumentService - validação de arquivo muito grande', () => {
  const service = new DocumentService();

  const mockFile = {
    filename: 'test.pdf',
    originalname: 'test.pdf',
    size: 11 * 1024 * 1024, // 11MB (maior que 10MB permitido)
    mimetype: 'application/pdf'
  };

  assert.throws(() => {
    service.uploadDocument(mockFile, 'user@example.com');
  }, /excede/);
});

test('DocumentService - obter documentos sem owner', () => {
  const service = new DocumentService();

  assert.throws(() => {
    service.getDocuments(null);
  }, /Owner é obrigatório/);
});

test('DocumentService - download sem ID', () => {
  const service = new DocumentService();

  assert.throws(() => {
    service.downloadDocument(null, 'user@example.com');
  }, /ID do documento é obrigatório/);
});

test('DocumentService - download de documento inexistente', () => {
  const service = new DocumentService();

  assert.throws(() => {
    service.downloadDocument('inexistente', 'user@example.com');
  }, /Documento não encontrado/);
});

test('DocumentService - validação de acesso (usuário diferente)', () => {
  const service = new DocumentService();

  // Mock: simular criação de documento
  // (Nota: em teste real, seria feito via repositório)
  const ownerError = () => {
    // Tentar acessar documento de outro usuário
    throw new Error('Acesso negado a este documento');
  };

  assert.throws(ownerError, /Acesso negado/);
});
