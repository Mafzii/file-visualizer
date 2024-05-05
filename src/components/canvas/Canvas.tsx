import React, { useEffect, useRef, useState } from "react";
import { Folder, File } from "./canvas-objects";

function Canvas() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);

  // * all control variables for general items
  let offsetX: number;
  let offsetY: number;
  const scale = 1;
  const boxWidth = 125;
  const boxHeight = 75;
  const boxRadius = 25;
  const boxColor = "#4f46e5";
  const outlineColor = "#d1d5db";

  const [folders, setFolders] = useState<Folder[]>([]);

  // when the canvas is rendered or re-rendered
  useEffect(() => {
    const canvasElement = canvas.current;
    context.current = canvasElement.getContext("2d");

    canvasElement.addEventListener("click", (event) => create(event));
    canvasElement.addEventListener("mousemove", (event) => hover(event));
    canvasElement.addEventListener("wheel", (event) => panning(event));
    window.addEventListener("resize", () => resize());

    const canvasCoords = canvasElement.getBoundingClientRect();
    offsetX = canvasCoords.x;
    offsetY = canvasCoords.y;

    canvasElement.width = window.innerWidth - offsetX;
    canvasElement.height = window.innerHeight - offsetY;

    console.log(canvasCoords);
  }, [canvas]);

  function create(event: MouseEvent) {
    const ctx = context.current;
    const x = (event.clientX - offsetX - Math.floor(boxWidth / 2)) * scale;
    const y = (event.clientY - offsetY - Math.floor(boxHeight / 2)) * scale;
    console.log(offsetX, offsetY);
    console.log(x, y);

    const folder = new Folder("New Folder", "path/to/folder", []);

    ctx.fillStyle = boxColor;
    ctx.strokeStyle = outlineColor;
    ctx.lineWidth = 10;
    ctx.roundRect(x, y, boxWidth, boxHeight, boxRadius);
    ctx.stroke();
    ctx.fill();

    setFolders([...folders, folder]);
  }

  function hover(event: MouseEvent) {
    const x = event.clientX - offsetX;
    const y = event.clientY - offsetY;

    // console.log(x, y);
  }

  function resize() {
    const canvasCoords = canvas.current.getBoundingClientRect();
    offsetX = canvasCoords.x;
    offsetY = canvasCoords.y;
    const canvasElement = canvas.current;
    canvasElement.width = window.innerWidth - offsetX;
    canvasElement.height = window.innerHeight - offsetY;
    // todo: redraw existing objects on new canvas
    console.log(canvasCoords, "resize");
  }

  function panning(event: MouseEvent) {
    console.log("zoom fired!", event);
    // scale = scale * event.x;
  }

  return <canvas className="h-full w-full" ref={canvas}></canvas>;
}

export default Canvas;
