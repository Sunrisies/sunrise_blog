// src/storage/storage.interface.ts
export interface CloudStorage {
    upload(file: Express.Multer.File): Promise<FileResponse>;
    list(prefix?: string): Promise<FileListResponse>;
    delete(filename: string): Promise<void>;
}

export type FileResponse = {
    url: string;
    filename: string;
    size: number;
    mimeType: string;
};

export type FileListResponse = Array<{
    filename: string;
    size: number;
    lastModified: Date;
}>;