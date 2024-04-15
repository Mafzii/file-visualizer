// ! NOT IN USE
import React, { useEffect, useRef, useState } from "react";
import { Folder, File } from "./canvas-objects";

function Canvas() {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);

  const [folders, setFolders] = useState<Folder[]>([]);

  // all initial setup should be done here
  useEffect(() => {
    const element = canvas.current;
    element.width = 800;
    element.height = 800;
    context.current = element.getContext("2d");
    canvas.current.addEventListener("click", (event) => create(event));
    canvas.current.addEventListener("mousemove", (event) => hover(event));
  }, []);

  function create(event: MouseEvent) {
    const x = event.clientX;
    const y = event.clientY;

    console.log(x,y);

    const folder = new Folder("New Folder", "path/to/folder", []);
    
    context.current.fillStyle = "blue";
    context.current.fillRect(x, y, 100, 100);

    setFolders([...folders, folder]);
  }

  function hover(event: MouseEvent) {
    const x = event.clientX;
    const y = event.clientY;

    console.log(x,y);

    context.current.fillStyle = "red";
    context.current.fillRect(x, y, 1, 1);
  }

  return <canvas className="border border-black" ref={canvas}></canvas>;
}

export default Canvas;
