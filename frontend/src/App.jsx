// Aplicação principal do Document Management System.
// Integra formulário de upload e listagem de documentos.

import { useState, useEffect } from 'react';
import UploadForm from './components/UploadForm';
import DocumentList from './components/DocumentList';
import { listDocuments } from './services/api';

export default function App() {
  const [owner, setOwner] = useState('');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Recuperar owner do localStorage ao montar
  useEffect(() => {
    const savedOwner = localStorage.getItem('dms-owner');
    if (savedOwner) {
      setOwner(savedOwner);
      loadDocuments(savedOwner);
    }
  }, []);

  // Carregar documentos quando owner mudar
  const loadDocuments = async (userOwner) => {
    if (!userOwner) {
      setDocuments([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const docs = await listDocuments(userOwner);
      setDocuments(docs);
    } catch (err) {
      setError(err.message || 'Erro ao carregar documentos');
      console.error('Erro ao carregar documentos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Lidar com mudança de owner
  const handleOwnerChange = (event) => {
    const newOwner = event.target.value;
    setOwner(newOwner);
    localStorage.setItem('dms-owner', newOwner);
    loadDocuments(newOwner);
  };

  // Callback após upload bem-sucedido
  const handleUploadSuccess = () => {
    loadDocuments(owner);
  };

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>📄 Document Management System</h1>
          <p style={styles.subtitle}>
            Faça upload, organize e baixe seus documentos com facilidade
          </p>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.container}>
          {/* Seção de entrada do proprietário */}
          <section style={styles.section}>
            <label htmlFor="owner" style={styles.ownerLabel}>
              Seu email ou usuário:
            </label>
            <input
              type="text"
              id="owner"
              value={owner}
              onChange={handleOwnerChange}
              placeholder="ex: usuario@example.com"
              style={styles.ownerInput}
            />
            <p style={styles.ownerHelp}>
              Use um identificador único (email, username, etc)
            </p>
          </section>

          {/* Mensagem de erro global */}
          {error && <div style={styles.globalError}>{error}</div>}

          {/* Formulário de upload */}
          {owner && <UploadForm owner={owner} onUploadSuccess={handleUploadSuccess} />}

          {/* Lista de documentos */}
          {owner && (
            <div>
              {loading ? (
                <div style={styles.loading}>Carregando documentos...</div>
              ) : (
                <DocumentList
                  documents={documents}
                  owner={owner}
                  onDownloadStart={() => setLoading(true)}
                  onDownloadEnd={() => setLoading(false)}
                />
              )}
            </div>
          )}

          {/* Mensagem quando nenhum owner foi definido */}
          {!owner && (
            <div style={styles.welcomeMessage}>
              <p>Bem-vindo ao DMS! 👋</p>
              <p>Para começar, informe seu email ou usuário acima.</p>
            </div>
          )}
        </div>
      </main>

      <footer style={styles.footer}>
        <p>© 2025 Document Management System | Workshop GitHub Copilot</p>
      </footer>
    </div>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    backgroundColor: '#fafafa',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    backgroundColor: '#0070f3',
    color: 'white',
    padding: '2rem 0',
    boxShadow: '0 2px 8px rgba(0, 112, 243, 0.15)',
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    paddingLeft: '2rem',
    paddingRight: '2rem',
    textAlign: 'center',
  },
  title: {
    margin: '0 0 0.5rem 0',
    fontSize: '2rem',
    fontWeight: '700',
  },
  subtitle: {
    margin: '0',
    fontSize: '1rem',
    opacity: '0.9',
  },
  main: {
    flex: '1',
    padding: '2rem 0',
  },
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    paddingLeft: '2rem',
    paddingRight: '2rem',
  },
  section: {
    marginBottom: '2rem',
    padding: '1rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  ownerLabel: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '600',
    color: '#333',
  },
  ownerInput: {
    width: '100%',
    maxWidth: '400px',
    padding: '0.75rem',
    fontSize: '1rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box',
  },
  ownerHelp: {
    marginTop: '0.5rem',
    fontSize: '0.85rem',
    color: '#999',
    margin: '0.5rem 0 0 0',
  },
  globalError: {
    padding: '1rem',
    marginBottom: '1rem',
    backgroundColor: '#fee',
    border: '1px solid #fcc',
    borderRadius: '4px',
    color: '#c33',
    fontWeight: '500',
  },
  loading: {
    padding: '2rem',
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
  },
  welcomeMessage: {
    padding: '2rem',
    textAlign: 'center',
    color: '#999',
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #ddd',
  },
  footer: {
    padding: '2rem',
    textAlign: 'center',
    color: '#999',
    fontSize: '0.9rem',
    borderTop: '1px solid #ddd',
  },
};
