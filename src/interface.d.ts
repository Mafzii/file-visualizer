export interface IFileIO {
  resolve: (source: string) => string;
  readdir: (string, callback) => void;
}

declare global {
  interface Window {
    fileUtils: IFileIO;
  }
}
