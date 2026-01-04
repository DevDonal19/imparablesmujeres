import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.resolve(__dirname, '../data');

const ensureDir = async () => {
  await fs.mkdir(dataDir, { recursive: true });
};

const getDataPath = (fileName) => path.join(dataDir, fileName);

export const readJson = async (fileName, defaultValue = []) => {
  await ensureDir();
  const filePath = getDataPath(fileName);
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await writeJson(fileName, defaultValue);
      return defaultValue;
    }
    throw error;
  }
};

export const writeJson = async (fileName, data) => {
  await ensureDir();
  const filePath = getDataPath(fileName);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  return data;
};

export const appendJson = async (fileName, callback, defaultValue = []) => {
  const collection = await readJson(fileName, defaultValue);
  const updated = await callback(collection);
  await writeJson(fileName, updated);
  return updated;
};
