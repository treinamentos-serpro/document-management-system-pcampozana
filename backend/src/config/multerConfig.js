// Configuração do multer com diskStorage para upload de arquivos.
// Os arquivos são gravados em backend/storage com nomes hasheados (UUID).

const multer = require('multer');
const { v4: uuidv4 } = require('crypto');
const path = require('path');
const fs = require('fs');

// Diretório de armazenamento
const storageDir = path.join(__dirname, '../../storage');

// Garantir que o diretório de armazenamento existe
if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir, { recursive: true });
}

// Configuração do diskStorage: arquivo é gravado com UUID + extensão original
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, storageDir);
  },
  filename: (req, file, cb) => {
    // Gerar ID único e preservar extensão original
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    cb(null, filename);
  }
});

// Validação de arquivo
const fileFilter = (req, file, cb) => {
  // Aceitar qualquer tipo de arquivo (MIME type já é capturado)
  cb(null, true);
};

// Configurar multer: máximo 10MB por arquivo
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

module.exports = upload;
