require('dotenv').config();
const mega = require('megajs');

const MEGA_EMAIL = process.env.MEGA_EMAIL || '';
const MEGA_PASSWORD = process.env.MEGA_PASSWORD || '';

if (!MEGA_EMAIL || !MEGA_PASSWORD) {
  console.error('Missing MEGA_EMAIL or MEGA_PASSWORD.');
  process.exit(1);
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

async function uploadToFolder(folder, name, buffer) {
  const upload = folder.upload({ name, size: buffer.length }, buffer);
  return new Promise((resolve, reject) => {
    upload.on('complete', resolve);
    upload.on('error', reject);
  });
}

async function testUpload() {
  const buffer = Buffer.from('Hello world, this is a test file!');
  const storage = await getStorage();

  console.log('Starting upload to MEGA...');
  try {
    const uploadedFile = await uploadToFolder(storage.root, 'test.txt', buffer);
    uploadedFile.link((error, link) => {
      if (error) {
        console.error('Link error:', error.message);
        return;
      }
      console.log('Uploaded successfully:', link);
    });
  } catch (err) {
    console.error('Upload failed:', err.message);
  }
}
testUpload();
