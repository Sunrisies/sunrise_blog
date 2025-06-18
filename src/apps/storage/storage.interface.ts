export interface CloudStorage {
  upload(file: Express.Multer.File, path: string): Promise<FileResponse> | any;
  list?(page: number, limit: number): Promise<FileListResponse> | any;
  delete?(filename: string): Promise<void>;
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
