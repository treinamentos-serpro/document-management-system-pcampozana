// Componente para upload de documentos.
// Formulário com input de arquivo e campo de usuário.

import { useState } from 'react';
import { uploadDocument } from '../services/api';

export default function UploadForm({ owner, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Limpar mensagens após 5 segundos
  const clearMessages = () => {
    setTimeout(() => {
      setError(null);
      setSuccess(false);
    }, 5000);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    setFile(selectedFile);
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setError('Por favor, selecione um arquivo');
      clearMessages();
      return;
    }

    if (!owner) {
      setError('Por favor, informe seu email ou usuário');
      clearMessages();
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await uploadDocument(file, owner);
      setSuccess(true);
      setFile(null);
      
      // Limpar input
      const fileInput = event.target.querySelector('input[type="file"]');
      if (fileInput) {
        fileInput.value = '';
      }

      // Notificar componente pai para recarregar lista
      if (onUploadSuccess) {
        onUploadSuccess();
      }

      clearMessages();
    } catch (err) {
      setError(err.message || 'Erro ao fazer upload. Tente novamente.');
      clearMessages();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.container}>
        <h2 style={styles.title}>Enviar documento</h2>

        {error && <div style={styles.errorMessage}>{error}</div>}
        {success && <div style={styles.successMessage}>Upload realizado com sucesso!</div>}

        <div style={styles.formGroup}>
          <label htmlFor="owner" style={styles.label}>
            Seu email ou usuário:
          </label>
          <input
            type="text"
            id="owner"
            value={owner}
            disabled
            style={styles.disabledInput}
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="file" style={styles.label}>
            Selecionar arquivo:
          </label>
          <input
            type="file"
            id="file"
            onChange={handleFileChange}
            disabled={loading}
            style={styles.fileInput}
          />
          {file && <p style={styles.fileInfo}>Arquivo: {file.name}</p>}
        </div>

        <button
          type="submit"
          disabled={loading || !file || !owner}
          style={{
            ...styles.button,
            ...(loading || !file || !owner ? styles.buttonDisabled : {}),
          }}
        >
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
      </div>
    </form>
  );
}

const styles = {
  form: {
    marginBottom: '2rem',
  },
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
  formGroup: {
    marginBottom: '1rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500',
    color: '#333',
  },
  disabledInput: {
    width: '100%',
    padding: '0.5rem',
    backgroundColor: '#e8e8e8',
    border: '1px solid #ccc',
    borderRadius: '4px',
    cursor: 'not-allowed',
  },
  fileInput: {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  fileInfo: {
    marginTop: '0.5rem',
    fontSize: '0.9rem',
    color: '#666',
  },
  button: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#0070f3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
  },
  errorMessage: {
    marginBottom: '1rem',
    padding: '0.75rem',
    backgroundColor: '#fee',
    border: '1px solid #fcc',
    borderRadius: '4px',
    color: '#c33',
  },
  successMessage: {
    marginBottom: '1rem',
    padding: '0.75rem',
    backgroundColor: '#efe',
    border: '1px solid #cfc',
    borderRadius: '4px',
    color: '#3c3',
  },
};
