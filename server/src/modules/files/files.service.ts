import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import { query, queryOne } from "../../config/database";
import { AppError } from "../../middleware/errorHandler";
import { encrypt, decryptFields } from "../../utils/crypto";

const FOLDER_MIME = "application/x-directory";
const FILE_FIELDS = ["name", "storage_path", "folder"];

interface FileRow {
  id: string;
  name: string;
  size: number;
  mime_type: string;
  storage_path: string;
  uploaded_by: string | null;
  uploader_name: string | null;
  context_type: string;
  context_id: string;
  folder: string | null;
  created_at: string;
}

async function assertFolderExists(userId: string, folder: string): Promise<void> {
  const encFolder = encrypt(folder);
  const row = await queryOne(
    "SELECT id FROM files WHERE context_type = 'user' AND context_id = $1 AND mime_type = $2 AND name = $3",
    [userId, FOLDER_MIME, encFolder]
  );
  if (!row) throw new AppError(404, "Folder not found");
}

async function getOwnedItem(itemId: string, userId: string): Promise<FileRow> {
  const item = await queryOne<FileRow>(
    "SELECT * FROM files WHERE id = $1 AND context_type = 'user' AND context_id = $2",
    [itemId, userId]
  );
  if (!item) throw new AppError(404, "File not found");
  return decryptFields(item, FILE_FIELDS);
}

export async function listMyFiles(userId: string) {
  const rows = await query<FileRow>(`
    SELECT f.*, u.name AS uploader_name
    FROM files f
    LEFT JOIN users u ON u.id = f.uploaded_by
    WHERE f.context_type = 'user' AND f.context_id = $1
    ORDER BY f.created_at DESC
  `, [userId]);
  const decrypted = rows.map(r => decryptFields(r, [...FILE_FIELDS, "uploader_name"]));
  return {
    folders: decrypted.filter(r => r.mime_type === FOLDER_MIME),
    files: decrypted.filter(r => r.mime_type !== FOLDER_MIME),
  };
}

export async function createFolder(userId: string, name: string) {
  const encName = encrypt(name);
  const existing = await queryOne(
    "SELECT id FROM files WHERE context_type = 'user' AND context_id = $1 AND mime_type = $2 AND name = $3",
    [userId, FOLDER_MIME, encName]
  );
  if (existing) throw new AppError(409, "Folder already exists");
  const [folder] = await query<FileRow>(
    "INSERT INTO files (id, name, size, mime_type, storage_path, uploaded_by, context_type, context_id) VALUES ($1,$2,0,$3,'',$4,'user',$4) RETURNING *",
    [uuidv4(), encName, FOLDER_MIME, userId]
  );
  return decryptFields(folder, FILE_FIELDS);
}

export async function saveFile(userId: string, folder: string | null, fileData: {
  name: string; size: number; mime_type: string; storage_path: string;
}) {
  if (folder) await assertFolderExists(userId, folder);
  const encName = encrypt(fileData.name);
  const encPath = encrypt(fileData.storage_path);
  const encFolder = folder ? encrypt(folder) : null;
  const [f] = await query<FileRow>(
    "INSERT INTO files (id, name, size, mime_type, storage_path, uploaded_by, context_type, context_id, folder) VALUES ($1,$2,$3,$4,$5,$6,'user',$6,$7) RETURNING *",
    [uuidv4(), encName, fileData.size, fileData.mime_type, encPath, userId, encFolder]
  );
  return decryptFields(f, FILE_FIELDS);
}

export async function moveFile(fileId: string, userId: string, folder: string | null) {
  const item = await getOwnedItem(fileId, userId);
  if (item.mime_type === FOLDER_MIME) throw new AppError(400, "Cannot move a folder");
  if (folder) await assertFolderExists(userId, folder);
  const encFolder = folder ? encrypt(folder) : null;
  const [updated] = await query<FileRow>("UPDATE files SET folder = $1 WHERE id = $2 RETURNING *", [encFolder, fileId]);
  return decryptFields(updated, FILE_FIELDS);
}

export async function deleteItem(itemId: string, userId: string) {
  const item = await getOwnedItem(itemId, userId);
  if (item.mime_type === FOLDER_MIME) {
    const encName = encrypt(item.name);
    await query("UPDATE files SET folder = NULL WHERE context_type = 'user' AND context_id = $1 AND folder = $2", [userId, encName]);
    await query("DELETE FROM files WHERE id = $1", [itemId]);
  } else {
    await query("DELETE FROM files WHERE id = $1", [itemId]);
    if (item.storage_path) fs.unlink(item.storage_path, () => {});
  }
}
