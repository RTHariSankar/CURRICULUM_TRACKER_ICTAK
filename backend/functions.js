const { google } = require("googleapis");
const path = require("path");
const { Readable } = require('node:stream');

const SERVICE_ACCOUNT_KEY_FILE = path.join(__dirname, "ictak-curriculum-tracker.json");

const uploadToGoogleDrive = async (file) => {
  const auth = await getAuth();
  const driveService = google.drive({ version: "v3", auth });

  const fileMetadata = {
    name: file.originalname,
    parents: ["1UveMe0PhoZWzj2BnPO9z8Jge2m80UH1z"], // Target folder
  };

  const media = {
    mimeType: file.mimetype,
    body: Readable.from(file.buffer),
  };

  // 1. Upload the file
  const response = await driveService.files.create({
    requestBody: fileMetadata,
    media,
    fields: "id",
  });

  const fileId = response.data.id;

  // 2. Make the file publicly accessible
  await driveService.permissions.create({
    fileId,
    requestBody: {
      role: "reader",
      type: "anyone",
    },
  });

  // 3. Get the file links
  const fileInfo = await driveService.files.get({
    fileId,
    fields: "id, name, webViewLink, webContentLink",
  });

  // 4. Return complete file data to frontend or database
  return fileId
};


const getAuth = async () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_KEY_FILE,
    scopes: "https://www.googleapis.com/auth/drive",
  });
  return auth;
};

const deleteFile = async (fileId) => {
  try {
    const auth = await getAuth();
    const driveService = google.drive({ version: "v3", auth });
    const response = await driveService.files.delete({
      fileId: fileId,
    });
    return response

  } catch (error) {
    console.log(error.message);
  }
};

const fetchFiles = async () => {
  const auth = await getAuth();
  const driveService = google.drive({ version: "v3", auth });

  try {
    const response = await driveService.files.list({
      fields: "files(id, name, mimeType, webViewLink, webContentLink)",
      // Add any other query parameters or filters as needed
    });

    return response.data.files;
  } catch (error) {
    console.error("Error fetching files list from Google Drive:", error);
    return [];
  }
};

module.exports = { uploadToGoogleDrive, deleteFile, fetchFiles };