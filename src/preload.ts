// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge } from "electron";
import fs from "fs";
import path from "path";

contextBridge.exposeInMainWorld("fs", {
  readdir: (source: string, callback: any) => {
    console.log("source: " + path.resolve(source));
    fs.readdir(source, callback);
  },
});
