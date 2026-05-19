require('dotenv').config();
const { google } = require('googleapis');

const auth = new google.auth.GoogleAuth({
  keyFile: './google-credentials.json',
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});

async function run() {
  try {
    const client = await auth.getClient();
    console.log("Auth success!", client.credentials);
  } catch(e) {
    console.error("Auth failed:", e.message);
  }
}
run();
