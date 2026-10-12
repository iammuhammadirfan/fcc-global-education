// Standalone script to import public/uploads into MySQL media_files
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function importLegacy() {
  const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    console.log('No public/uploads directory found.');
    return;
  }

  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'auraglobal_cms',
  });

  await conn.execute(`
    CREATE TABLE IF NOT EXISTS media_files (
      id VARCHAR(100) PRIMARY KEY,
      mime_type VARCHAR(100),
      size_bytes INT,
      data LONGBLOB,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  const files = fs.readdirSync(uploadDir);
  let count = 0;

  for (const fileName of files) {
    const filePath = path.join(uploadDir, fileName);
    const stat = fs.statSync(filePath);
    if (!stat.isFile()) continue;

    const ext = path.extname(fileName).toLowerCase();
    let mimeType = 'application/octet-stream';
    if (ext === '.svg') mimeType = 'image/svg+xml';
    else if (ext === '.ico') mimeType = 'image/x-icon';
    else if (ext === '.webp') mimeType = 'image/webp';
    else if (ext === '.png') mimeType = 'image/png';
    else if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';
    else if (ext === '.gif') mimeType = 'image/gif';

    const buf = fs.readFileSync(filePath);

    await conn.execute(
      `INSERT INTO media_files (id, mime_type, size_bytes, data)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE mime_type = VALUES(mime_type), size_bytes = VALUES(size_bytes), data = VALUES(data)`,
      [fileName, mimeType, buf.length, buf]
    );

    count++;
    console.log(`[Imported] ${fileName} (${buf.length} bytes)`);
  }

  console.log(`Successfully imported ${count} legacy images into media_files.`);
  await conn.end();
}

importLegacy().catch(console.error);
