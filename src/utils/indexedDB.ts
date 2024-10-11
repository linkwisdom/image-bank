import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface ImageGalleryDB extends DBSchema {
  images: {
    key: string;
    value: Image;
    indexes: { 'by-folder': string };
  };
  folders: {
    key: string;
    value: Folder;
  };
}

export interface Image {
  id: string;
  name: string;
  url: string;
  tags: string[];
  folder: string;
  attributes: {
    size: string;
    resolution: string;
    createdAt: string;
  };
}

export interface Folder {
  id: string;
  name: string;
  isPublic: boolean;
}

let db: IDBPDatabase<ImageGalleryDB>;

export async function initDB() {
  if (!db) {
    db = await openDB<ImageGalleryDB>('ImageGalleryDB', 1, {
      upgrade(db) {
        const imageStore = db.createObjectStore('images', { keyPath: 'id' });
        imageStore.createIndex('by-folder', 'folder');
        db.createObjectStore('folders', { keyPath: 'id' });
      },
    });
  }
}

export async function getAllImages(): Promise<Image[]> {
  await initDB();
  return db.getAll('images');
}

export async function getImagesByFolder(folderId: string): Promise<Image[]> {
  await initDB();
  return db.getAllFromIndex('images', 'by-folder', folderId);
}

export async function addImage(image: Image): Promise<void> {
  await initDB();
  await db.add('images', image);
}

export async function updateImage(image: Image): Promise<void> {
  await initDB();
  await db.put('images', image);
}

export async function deleteImage(id: string): Promise<void> {
  await initDB();
  await db.delete('images', id);
}

export async function getAllFolders(): Promise<Folder[]> {
  await initDB();
  return db.getAll('folders');
}

export async function addFolder(folder: Folder): Promise<void> {
  await initDB();
  await db.add('folders', folder);
}

export async function updateFolder(folder: Folder): Promise<void> {
  await initDB();
  await db.put('folders', folder);
}

export async function deleteFolder(id: string): Promise<void> {
  await initDB();
  await db.delete('folders', id);
}