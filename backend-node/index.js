require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { google } = require('googleapis');
const stream = require('stream');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory setup for Multer (we pass streams to Google Drive)
const upload = multer({ storage: multer.memoryStorage() });

// The fallback list of Google Drive Folders
const DRIVE_FOLDERS = [
  '1j29oZyFBrx_R2S4GleEuTqHEj92Am_57', // Drive 1
  '1nRAVPWenNtcMah0irxKnZsdXaGbRmeK0'  // Drive 2 (Failover)
];

// Initialize Google Drive API Client
const auth = new google.auth.GoogleAuth({
  keyFile: './google-credentials.json',
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});

const drive = google.drive({ version: 'v3', auth });

app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const fileMetadata = {
    name: req.file.originalname,
    // Add parents dynamically during the upload attempt
  };

  const bufferStream = new stream.PassThrough();
  bufferStream.end(req.file.buffer);

  const media = {
    mimeType: req.file.mimetype,
    body: bufferStream,
  };

  // Auto-failover logic
  for (let i = 0; i < DRIVE_FOLDERS.length; i++) {
    const folderId = DRIVE_FOLDERS[i];
    fileMetadata.parents = [folderId];

    try {
      console.log(`Attempting to upload to folder: ${folderId}`);
      const uploadedFile = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id, webViewLink, webContentLink',
      });

      // If successful, grant public read permission so anyone can download
      await drive.permissions.create({
        fileId: uploadedFile.data.id,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });

      return res.json({
        success: true,
        message: 'File uploaded successfully',
        driveLink: uploadedFile.data.webViewLink,
        downloadLink: uploadedFile.data.webContentLink,
        folderUsed: i + 1
      });

    } catch (error) {
      console.error(`Upload failed for folder ${folderId}:`, error.message);
      
      // If it's a quota exceeded error or permission error, continue to the next folder
      if (
        error.message.includes('quota') || 
        error.message.includes('storage') || 
        error.message.includes('exceeded') ||
        error.code === 403 || 
        error.code === 404
      ) {
        if (i === DRIVE_FOLDERS.length - 1) {
          // It was the last folder!
          return res.status(507).json({ error: 'All linked Google Drives are full! Please add more storage.' });
        }
        console.log(`Switching to backup folder: ${DRIVE_FOLDERS[i + 1]}`);
        
        // Re-create stream for the next attempt
        const newBufferStream = new stream.PassThrough();
        newBufferStream.end(req.file.buffer);
        media.body = newBufferStream;
        
        continue;
      }
      
      // If it's some other random error (e.g. network), fail early
      return res.status(500).json({ error: 'Failed to upload to Google Drive: ' + error.message });
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
