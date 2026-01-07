import fs from "fs/promises";
import path from "path";

const CACHE_ROOT = path.join(process.cwd(), "data", "cache");

export async function getCache(type, key) {
    try {
        const filePath = path.join(CACHE_ROOT, type, `${key}.json`);
        const data = await fs.readFile(filePath, "utf-8");
        return JSON.parse(data);
    } catch (err) {
        return null;
    }
}

export async function setCache(type, key, data) {
    try {
        const dir = path.join(CACHE_ROOT, type);
        await fs.mkdir(dir, { recursive: true });
        const filePath = path.join(dir, `${key}.json`);
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (err) {
        console.error(`[Cache] Error saving ${type}/${key}:`, err.message);
        return false;
    }
}
