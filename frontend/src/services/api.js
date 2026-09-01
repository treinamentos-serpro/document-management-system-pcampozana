// Serviço de API para comunicação com o backend do DMS.
// Centraliza as chamadas HTTP para upload, listagem e download de documentos.

const API_BASE = '/api';

/**
 * Faz upload de um documento.
 * @param {File} file - Arquivo a fazer upload
 * @param {string} owner - Identificador do usuário proprietário
 * @returns {Promise<Object>} - Resposta com metadados do documento
 * @throws {Error} - Se o upload falhar
 */
export async function uploadDocument(file, owner) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('owner', owner);

  const response = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Erro ao fazer upload');
  }

  return data.data;
}

/**
 * Lista documentos do usuário.
 * @param {string} owner - Identificador do usuário proprietário
 * @returns {Promise<Array>} - Lista de documentos
 * @throws {Error} - Se a requisição falhar
 */
export async function listDocuments(owner) {
  const response = await fetch(`${API_BASE}/documents?owner=${encodeURIComponent(owner)}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Erro ao listar documentos');
  }

  return data.data || [];
}

/**
 * Faz download de um documento.
 * Abre o arquivo no navegador ou o salva.
 * @param {string} documentId - ID do documento
 * @param {string} originalName - Nome original do arquivo
 * @param {string} owner - Identificador do usuário proprietário
 * @returns {Promise<void>}
 * @throws {Error} - Se o download falhar
 */
export async function downloadDocument(documentId, originalName, owner) {
  const url = `${API_BASE}/documents/${encodeURIComponent(documentId)}/download?owner=${encodeURIComponent(owner)}`;

  const response = await fetch(url);

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Erro ao fazer download');
  }

  // Obter blob e disparar download
  const blob = await response.blob();
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = originalName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(downloadUrl);
}

/**
 * Formata tamanho de arquivo em bytes para formato legível.
 * @param {number} bytes - Tamanho em bytes
 * @returns {string} - Tamanho formatado (ex: "1.5 MB")
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Formata data ISO 8601 para formato legível local.
 * @param {string} isoDate - Data em formato ISO 8601
 * @returns {string} - Data formatada (ex: "15/01/2025 14:30")
 */
export function formatDate(isoDate) {
  const date = new Date(isoDate);
  return date.toLocaleString('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}
