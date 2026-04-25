import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const loadJSON = (relativePath) => {
  const resolvedPath = path.resolve(__dirname, relativePath);

  if (!fs.existsSync(resolvedPath)) {
    throw new Error(
      `Service account JSON not found at ${resolvedPath}. ` +
        'Set the FIREBASE_SERVICE_ACCOUNT environment variable with the JSON payload, ' +
        'or place the credential file at that path.'
    );
  }

  try {
    const raw = fs.readFileSync(resolvedPath, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(`Unable to read or parse service account JSON at ${resolvedPath}: ${error.message}`);
  }
};
