import React, { useEffect, useRef, useState } from "react";
import { Folder, File } from "./canvas-objects";

function Canvas() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);

  // * all control variables for general items
  let offsetX: number;
  let offsetY: number;
  const boxWidth = 125;
  const boxHeight = 75;
  const boxRadius = 25;
  const boxColor = "#4f46e5";
  const outlineColor = "#d1d5db";

  const [folders, setFolders] = useState<Folder[]>([]);

  // all initial setup should be done here
  useEffect(() => {
    const element = canvas.current;
    // todo: calculate canvas width and height based on viewport
    element.width = 700;
    element.height = 700;

    context.current = element.getContext("2d");

    element.addEventListener("click", (event) => create(event));
    element.addEventListener("mousemove", (event) => hover(event));
  }, []);

  // when the canvas is rendered or re-rendered
  useEffect(() => {
    const canvasCoords = canvas.current.getBoundingClientRect();
    offsetX = canvasCoords.x;
    offsetY = canvasCoords.y;
    console.log(canvasCoords);
  }, [canvas]);

  function create(event: MouseEvent) {
    const x = event.clientX - offsetX - Math.floor(boxWidth / 2);
    const y = event.clientY - offsetY - Math.floor(boxHeight / 2);
    // console.log(x, y);

    const folder = new Folder("New Folder", "path/to/folder", []);

    context.current.fillStyle = boxColor;
    context.current.strokeStyle = outlineColor;
    context.current.roundRect(x, y, boxWidth, boxHeight, boxRadius);
    context.current.stroke();
    context.current.fill();

    setFolders([...folders, folder]);
  }

  function hover(event: MouseEvent) {
    const x = event.clientX - offsetX;
    const y = event.clientY - offsetY;

    // console.log(x, y);
  }

  return <canvas className="border border-black" ref={canvas}></canvas>;
}

export default Canvas;
