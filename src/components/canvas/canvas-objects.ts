class CanvasObject {
  connections: string[];

  constructor() {
    this.connections = [];
  }
}

class Folder extends CanvasObject {
  name: string;
  path: string;
  files: string[];

  constructor(name: string, path: string, files: string[]) {
    super();
    this.name = name;
    this.path = path;
    this.files = files;
  }
}

class File extends CanvasObject {
  name: string;
  path: string;

  constructor(name: string, path: string) {
    super();
    this.name = name;
    this.path = path;
  }
}

export { Folder, File };
