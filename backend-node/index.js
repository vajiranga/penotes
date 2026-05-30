require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const mega = require('megajs');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory setup for Multer (we pass streams to Google Drive)
const upload = multer({ storage: multer.memoryStorage() });

const MEGA_EMAIL = process.env.MEGA_EMAIL || '';
const MEGA_PASSWORD = process.env.MEGA_PASSWORD || '';

function assertEnv() {
  if (!MEGA_EMAIL || !MEGA_PASSWORD) {
    throw new Error('Missing MEGA_EMAIL or MEGA_PASSWORD.');
  }
}

async function getStorage() {
  const storage = new mega.Storage({
    email: MEGA_EMAIL,
    password: MEGA_PASSWORD,
    userAgent: 'CampusNotes/1.0'
  });

  await storage.ready;
  return storage;
}

async function ensureFolderLoaded(folder) {
  if (typeof folder.loadAttributes === 'function') {
    await new Promise((resolve, reject) => {
      folder.loadAttributes(error => (error ? reject(error) : resolve()));
    });
    return;
  }

  if (typeof folder.load === 'function') {
    await new Promise((resolve, reject) => {
      folder.load(error => (error ? reject(error) : resolve()));
    });
  }
}

async function ensureFolder(parent, name) {
  await ensureFolderLoaded(parent);
  const existing = (parent.children || []).find(
    (child) => child.name === name && child.directory
  );

  if (existing) return existing;

  if (typeof parent.mkdir === 'function') {
    return new Promise((resolve, reject) => {
      parent.mkdir(name, (error, folder) => (error ? reject(error) : resolve(folder)));
    });
  }

  throw new Error('MEGA folder creation is not supported by this client.');
}

async function ensureFolderPath(root, parts) {
  let current = root;
  for (const part of parts) {
    if (!part) continue;
    current = await ensureFolder(current, part);
  }
  return current;
}

async function uploadToFolder(folder, file) {
  const upload = folder.upload(
    { name: file.originalname, size: file.buffer.length },
    file.buffer
  );

  return new Promise((resolve, reject) => {
    upload.on('complete', resolve);
    upload.on('error', reject);
  });
}

async function createMegaLink(file) {
  if (typeof file.link !== 'function') return null;

  return new Promise((resolve, reject) => {
    file.link((error, url) => (error ? reject(error) : resolve(url)));
  });
}

function escapeDriveQuery(value) {
  return String(value).replace(/'/g, "\\'");
}

async function ensureFolder(drive, name, parentId) {
  const escapedName = escapeDriveQuery(name);
  const q = [
    "mimeType='application/vnd.google-apps.folder'",
    `name='${escapedName}'`,
    "trashed=false",
    `'${parentId}' in parents`
  ].join(' and ');

  const listRes = await drive.files.list({
    q,
    fields: 'files(id, name)',
    pageSize: 1,
    spaces: 'drive'
  });

  if (listRes.data.files && listRes.data.files.length > 0) {
    return listRes.data.files[0].id;
  }

  const createRes = await drive.files.create({
    resource: {
      name,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentId]
    },
    fields: 'id'
  });

  return createRes.data.id;
}

async function ensureFolderPath(drive, parentId, parts) {
  let currentParent = parentId;
  for (const part of parts) {
    if (!part) continue;
    currentParent = await ensureFolder(drive, part, currentParent);
  }
  return currentParent;
}

function normalizeFolderName(value, fallback) {
  if (!value || typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  return trimmed || fallback;
}


app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    assertEnv();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const subject = normalizeFolderName(req.body.subject, 'General');
  const moduleName = normalizeFolderName(req.body.module, 'General');
  const uploaderName = normalizeFolderName(req.body.uploaderName, 'Uploader');


  try {
    const storage = await getStorage();
    const targetFolder = await ensureFolderPath(
      storage.root,
      [subject, moduleName, uploaderName]
    );

    console.log('Attempting to upload to MEGA');
    const uploadedFile = await uploadToFolder(targetFolder, req.file);
    const shareLink = await createMegaLink(uploadedFile);

    return res.json({
      success: true,
      message: 'File uploaded successfully',
      megaLink: shareLink,
      driveLink: shareLink,
      folderPath: [subject, moduleName, uploaderName].join(' / ')
    });
  } catch (error) {
    console.error('Upload failed:', error.message);
    return res.status(500).json({ error: 'Failed to upload to MEGA: ' + error.message });
  }
});

app.get('/api/test-auth', async (req, res) => {
  try {
    assertEnv();
    const storage = await getStorage();
    await ensureFolderLoaded(storage.root);
    const sample = (storage.root.children || [])[0];
    res.json({
      success: true,
      rootFolderName: storage.root.name || 'root',
      sampleName: sample ? sample.name : null
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message, stack: error.stack });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
