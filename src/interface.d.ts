export interface IFileIO {
  resolve: (source: string) => string;
  readdir: (string, callback) => void;
  dialog: {
    showOpenDialog: () => Promise<Electron.OpenDialogReturnValue>;
  };
}

declare global {
  interface Window {
    fileUtils: IFileIO;
  }
}
