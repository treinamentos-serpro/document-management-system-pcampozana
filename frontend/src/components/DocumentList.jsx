// Componente para listar e fazer download de documentos.
// Exibe tabela com documentos do usuário.

import { downloadDocument, formatFileSize, formatDate } from '../services/api';

export default function DocumentList({ documents, owner, onDownloadStart, onDownloadEnd }) {
  const handleDownload = async (documentId, originalName) => {
    onDownloadStart?.();

    try {
      await downloadDocument(documentId, originalName, owner);
    } catch (error) {
      alert(`Erro ao fazer download: ${error.message}`);
    } finally {
      onDownloadEnd?.();
    }
  };

  if (!documents || documents.length === 0) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>Seus documentos</h2>
        <p style={styles.emptyMessage}>Nenhum documento enviado ainda.</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Seus documentos ({documents.length})</h2>

      <table style={styles.table}>
        <thead>
          <tr style={styles.headerRow}>
            <th style={styles.headerCell}>Nome</th>
            <th style={styles.headerCell}>Tamanho</th>
            <th style={styles.headerCell}>Data do Upload</th>
            <th style={styles.headerCell}>Ação</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id} style={styles.tableRow}>
              <td style={styles.tableCell}>
                <span title={doc.originalName}>{truncateFileName(doc.originalName)}</span>
              </td>
              <td style={styles.tableCell}>{formatFileSize(doc.size)}</td>
              <td style={styles.tableCell}>{formatDate(doc.uploadedAt)}</td>
              <td style={styles.tableCell}>
                <button
                  onClick={() => handleDownload(doc.id, doc.originalName)}
                  style={styles.downloadButton}
                  title="Fazer download deste documento"
                >
                  Baixar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Trunca nome de arquivo muito longo.
 * @param {string} name - Nome do arquivo
 * @param {number} maxLength - Comprimento máximo
 * @returns {string} - Nome truncado
 */
function truncateFileName(name, maxLength = 40) {
  if (name.length <= maxLength) return name;

  const ext = name.substring(name.lastIndexOf('.'));
  const nameWithoutExt = name.substring(0, name.lastIndexOf('.'));
  const truncated = nameWithoutExt.substring(0, maxLength - ext.length - 3);

  return `${truncated}...${ext}`;
}

const styles = {
  container: {
    padding: '1.5rem',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    border: '1px solid #ddd',
  },
  title: {
    marginTop: 0,
    marginBottom: '1rem',
    fontSize: '1.25rem',
    color: '#333',
  },
  emptyMessage: {
    color: '#999',
    fontStyle: 'italic',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'white',
  },
  headerRow: {
    backgroundColor: '#0070f3',
  },
  headerCell: {
    padding: '0.75rem',
    textAlign: 'left',
    color: 'white',
    fontWeight: '600',
    borderBottom: '2px solid #0070f3',
  },
  tableRow: {
    borderBottom: '1px solid #ddd',
    transition: 'background-color 0.2s',
  },
  tableRowHover: {
    backgroundColor: '#f9f9f9',
  },
  tableCell: {
    padding: '0.75rem',
    color: '#333',
  },
  downloadButton: {
    padding: '0.4rem 0.8rem',
    backgroundColor: '#0070f3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
};
