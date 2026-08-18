import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const serviceAccount = JSON.parse(
  readFileSync(path.join(__dirname, "..", "serviceAccountKey.json"), "utf-8")
);

if (!getApps().length) {
  initializeApp({ credential: cert(serviceAccount) });
}

export const auth = getAuth();