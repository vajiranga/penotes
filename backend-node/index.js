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

// Initialize Google Drive API Client using Base64 to bypass any file/git formatting issues
const b64 = "eyJ0eXBlIjoic2VydmljZV9hY2NvdW50IiwicHJvamVjdF9pZCI6ImdyYW5kLXByaW5jaXBsZS00OTY4MTAtZDgiLCJwcml2YXRlX2tleV9pZCI6IjkyNDk3OTQxYTM5YzE2MDFmZjY3OTNlMzhlMTg2MjZhM2FkMWJlN2IiLCJwcml2YXRlX2tleSI6Ii0tLS0tQkVHSU4gUFJJVkFURSBLRVktLS0tLVxuTUlJRXZRSUJBREFOQmdrcWhraUc5dzBCQVFFRkFBU0NCS2N3Z2dTakFnRUFBb0lCQVFEUTY2WFBSQVJMUVhqMVxuNmVLVGtyRWhEUys0cUxLYndzMXhvbnFWdlFuRGl6amZUQXYrV2ZqNGFSVkhwWkVFdWZqbDRJb20xenJEZC9nZlxuMnhjTEhMVVY5cm1PblRreFM5ZENzUmNlUFJzWk1PaTJsbEZXVTkrTE1MTXJzZnppQzhCSk5ybXVSMEhVLys0NVxuRWpHbk0xMjFMenp6em9SZnNyYmNxNUdBTjFLMlRpQjJPZXgvekZwcSthWDNDNE4wcU8rMFlyUVQ4SFppVWg3Y1xuaVhyRzBPRFZ2ZnhXRXkxcmxpRGdRMGlId3R3RGlrRTVpS3ZZaGdPQUtFbVFnak1IVS96ZS82anlBYktkZnZUSVxuYlJJN2IrNXlCZUpKczBBRWFzYVAvbThUWVFETERtM2UvUldmWWdtSTdha00xN0pUMy9DZDJVZUVTM0dhSFVST1xuZ3lBckJkQ0RBZ01CQUFFQ2dnRUFHd0hiZFdlOWhsejRYaEhXRUcydUtDK2tNNkxiTS9lQ3gyWFJvdm5GQVZwR1xuQjllMDFUU2NVc0NDMTdnM2Z2enJpQXYyei82U3dpSUlHVlloTEhhUmtqMUt6M3pUbitQRitBRWNrL1FpUktkbFxuN2ZTUW56QklmWjNXQzVmK3NOb0VDWExobmYzb0xMakkrdWUzTTM0WVp3dXNQWGc4OUlJTjBZajhUaTdZcW1oRFxuTHJHSFY4ZmhBVmp6MWVjeGxzc2djUGtYLzJrelQxL3h6NEkwQ1NsKzNlR1o0L095cTNkUkR6MllwYWhFN0tTcVxuZXBpNE56alJHeUEwN3lpMDhzT2hoc0NjalNzc2h6cFBBTEFiMDB1QStOKzl3NVV0UnZEVHhZbmxabktHVmFUK1xueUVpWUhTckhZS0RrOHNUaHVsd0ZiOFR1NVJCY1pQVnFoWXM4RU1IT0FRS0JnUUQyMHNsN2p6a0N0cTNYQ3pFRVxuNzA1eSt3Uk9lcHpUdXV3VjJBeDNwNk94U2pGSzBMV2JaZEtNOUxLMm1ETDF3bkV4Z1U4Y2ZZcSt3bDRWODFNV1xuVEF2azJPV3RvU3hMczVVMjZNZ3g0MGlpSWdDZHpBbkZ1NExMSG0wVFB1ejdzeDFnR09PTUtwbGV0aDlJTG5QNFxuQUx2T2RTVUhSelVWTnV2ZVBGN2wxQzRMb1FLQmdRRFlzQnZrYzJFSmxnVVFkM3g1UTNWWDJ5cGsyOFN2c0xwZFxucEdXeXcyUVBLODZ4MWkyL2ZwS2NMczd4RlFEMFhrelIyMnYvaGZyR2IyMWZZejBDUnYwR2kvV2ZDZ05INWhTVlxuSzlGMkhtWUZXZWtHZ1hEaWwwbFNDUGRJZXdNNXlZU2ZJK21wTVFLTUJSUlFVZUtCRGxCZ3A0dHdDdFFVckNTYVxuTWx4REtiUEpvd0tCZ1FEcHJ1ZlRjK1ltQzQ3SzZtMmVubk5IcVNDS3JNdU9Lb3NhbzFJcWR5MGp6WHFkdXJ3MlxuUkZEejR6alFaNGpYNVNBR0hzY24walJxSnR1dExKS2RxYUlaS01GTGdpek4vMWhtaEQ0Ri9Zbm05d3BlVzY5a1xuNWdNUEM5OTVPVHBsazA5Y2pEUGpvUEZVR2xuRG5UZHV0a01aVlErWnRIRXRoTElMMWx5Q2ZFQ2NBUUtCZ0FKdVxuSHpIMXRVM2xOOU5TYzd2c2JNRjZmTVE2enI3bHJZRmxXWnFpcEZtak5TTTdjckhtR29EVDZaQThteEVpaVp3RVxuNlBZcHE0RlVPSmJNUngvaWFlNEwzY3BWMDJtWUEvMFVTN29XWnpDQ0xLSGRDOFlPeWt5NE93VytFM0F2ZVdSTFxuZzlCWTgxMWNwVGl0WW12dUhDcXBWbUFBVHhhWVE2VFRFY1BURU9nZkFvR0FheWJDcnlEZWRDZzRGL0ZwZU90SlxuOW5zeWM1cWJCSkpwcGIxclA5SmhPYWd3TGNEMDRiM2JWNDVkVlpKWEZnU29BYy9ZdUU4STFpdXJUc3c2Yk5JSlxuU1BYSlZ3Sk9ULysvOCsyMU80Nk05NXpYc0NwRHkzdDhaeVhQNEtZMGc3ajMyTHhXcXI2UlVCUkdweGgyclBwU1xuTG9TeGpBTmRmWnJmYVJFSktCM1NIblk9XG4tLS0tLUVORCBQUklWQVRFIEtFWS0tLS0tXG4iLCJjbGllbnRfZW1haWwiOiJjYW1wdXMtbm90ZXMtYm90QGdyYW5kLXByaW5jaXBsZS00OTY4MTAtZDguaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJjbGllbnRfaWQiOiIxMTc3MjkxOTkyMDQzOTQ5NDkyOTUiLCJhdXRoX3VyaSI6Imh0dHBzOi8vYWNjb3VudHMuZ29vZ2xlLmNvbS9vL29hdXRoMi9hdXRoIiwidG9rZW5fdXJpIjoiaHR0cHM6Ly9vYXV0aDIuZ29vZ2xlYXBpcy5jb20vdG9rZW4iLCJhdXRoX3Byb3ZpZGVyX3g1MDlfY2VydF91cmwiOiJodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9vYXV0aDIvdjEvY2VydHMiLCJjbGllbnRfeDUwOV9jZXJ0X3VybCI6Imh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL3JvYm90L3YxL21ldGFkYXRhL3g1MDkvY2FtcHVzLW5vdGVzLWJvdCU0MGdyYW5kLXByaW5jaXBsZS00OTY4MTAtZDguaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJ1bml2ZXJzZV9kb21haW4iOiJnb29nbGVhcGlzLmNvbSJ9";
const credentials = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: credentials.client_email,
    private_key: credentials.private_key,
  },
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

app.get('/api/test-auth', async (req, res) => {
  try {
    const client = await auth.getClient();
    res.json({ success: true, email: credentials.client_email, project: credentials.project_id });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message, stack: error.stack });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
