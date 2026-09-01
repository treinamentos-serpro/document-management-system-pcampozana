// Testes da camada Repository (DocumentRepository).
// Teste unitário: armazenamento e recuperação de metadados em memória.

const { test } = require('node:test');
const assert = require('node:assert');
const path = require('path');
const DocumentRepository = require(path.join(__dirname, '../../src/repositories/DocumentRepository'));

test('DocumentRepository - criar e recuperar documento', () => {
  const repo = new DocumentRepository();
  
  const metadata = {
    id: 'doc-123',
    originalName: 'teste.pdf',
    filename: 'doc-123.pdf',
    size: 1024,
    mimetype: 'application/pdf',
    uploadedAt: new Date().toISOString(),
    owner: 'user@example.com',
    storagePath: '/storage/doc-123.pdf'
  };

  // Criar documento
  const created = repo.create(metadata);
  assert.strictEqual(created.id, 'doc-123');
  assert.strictEqual(created.owner, 'user@example.com');

  // Recuperar por ID
  const found = repo.findById('doc-123');
  assert.strictEqual(found.originalName, 'teste.pdf');
});

test('DocumentRepository - listar por proprietário', () => {
  const repo = new DocumentRepository();

  repo.create({
    id: 'doc-1',
    originalName: 'file1.pdf',
    filename: 'doc-1.pdf',
    size: 1024,
    mimetype: 'application/pdf',
    uploadedAt: new Date().toISOString(),
    owner: 'user1@example.com',
    storagePath: '/storage/doc-1.pdf'
  });

  repo.create({
    id: 'doc-2',
    originalName: 'file2.pdf',
    filename: 'doc-2.pdf',
    size: 2048,
    mimetype: 'application/pdf',
    uploadedAt: new Date().toISOString(),
    owner: 'user1@example.com',
    storagePath: '/storage/doc-2.pdf'
  });

  repo.create({
    id: 'doc-3',
    originalName: 'file3.pdf',
    filename: 'doc-3.pdf',
    size: 512,
    mimetype: 'application/pdf',
    uploadedAt: new Date().toISOString(),
    owner: 'user2@example.com',
    storagePath: '/storage/doc-3.pdf'
  });

  // Listar do user1
  const user1Docs = repo.findByOwner('user1@example.com');
  assert.strictEqual(user1Docs.length, 2);

  // Listar do user2
  const user2Docs = repo.findByOwner('user2@example.com');
  assert.strictEqual(user2Docs.length, 1);

  // Listar de usuário sem documentos
  const user3Docs = repo.findByOwner('user3@example.com');
  assert.strictEqual(user3Docs.length, 0);
});

test('DocumentRepository - deletar documento', () => {
  const repo = new DocumentRepository();

  repo.create({
    id: 'doc-delete',
    originalName: 'file.pdf',
    filename: 'doc-delete.pdf',
    size: 1024,
    mimetype: 'application/pdf',
    uploadedAt: new Date().toISOString(),
    owner: 'user@example.com',
    storagePath: '/storage/doc-delete.pdf'
  });

  // Deletar
  const deleted = repo.delete('doc-delete');
  assert.strictEqual(deleted, true);

  // Verificar que não existe mais
  const found = repo.findById('doc-delete');
  assert.strictEqual(found, null);

  // Tentar deletar novamente (não existe)
  const deletedAgain = repo.delete('doc-delete');
  assert.strictEqual(deletedAgain, false);
});
