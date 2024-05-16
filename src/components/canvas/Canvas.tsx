import React, { useEffect, useRef, useState } from "react";
import { CanvasItem } from "./canvas-objects";
// todo use jsonCanvas for items instead

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

  let items: CanvasItem[] = [];

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

    const item = new CanvasItem(x, y, []);

    ctx.fillStyle = boxColor;
    ctx.strokeStyle = outlineColor;
    ctx.lineWidth = 10;
    ctx.roundRect(x, y, boxWidth, boxHeight, boxRadius);
    ctx.stroke();
    ctx.fill();

    items = [...items, item];
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

  let isPanning = true;
  let wheelEventEndTimeout: string | number | NodeJS.Timeout = null;
  function panning(event: WheelEvent) {
    const canvasElement = canvas.current;
    const ctx = context.current;

    const dx = event.deltaX;
    const dy = event.deltaY;
    console.log("panning fired!", event);
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    ctx.translate(event.deltaX, event.deltaY);
    
    offsetX = offsetX + dx;
    offsetY = offsetY + dy;

    isPanning = true;

    clearTimeout(wheelEventEndTimeout);
    wheelEventEndTimeout = setTimeout(() => {
      console.log("wheel end");
    }, 100);

    render();
  }

  function render() {
    /*
    
    */
    const canvasElement = canvas.current;
    const ctx = context.current;
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    console.log(items);
    items.forEach((item) => {
      console.log(item.x, item.y);
      // todo handle different items separately
      ctx.fillStyle = boxColor;
      ctx.strokeStyle = outlineColor;
      ctx.lineWidth = 10;
      ctx.roundRect(item.x, item.y, boxWidth, boxHeight, boxRadius);
      ctx.stroke();
      ctx.fill();
    });
    return;
  }

  return <canvas className="h-full w-full" ref={canvas}></canvas>;
}

export default Canvas;
