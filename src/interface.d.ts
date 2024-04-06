export interface IFileIO {
  readdir: (string, callback) => void;
}

declare global {
  interface Window {
    fs: IFileIO;
  }
}
