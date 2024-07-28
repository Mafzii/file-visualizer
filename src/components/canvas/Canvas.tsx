import React, { useRef, useEffect, useState, useCallback } from "react";

// Define the type for items
interface CanvasItem {
  x: number;
  y: number;
  width: number;
  height: number;
  radius?: number;
  color: string;
}

// use memoization on the items coming from the parent component
const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [scale, setScale] = useState(1.0);
  const [items, setItems] = useState<CanvasItem[]>([]);

  // * Control variables for general items
  const boxWidth = 125;
  const boxHeight = 75;
  const boxRadius = 25;
  const boxColor = "#4f46e5";
  const circleColor = "#f43f5e";
  const outlineColor = "#d1d5db";

  // Initial setup of canvas dimensions and offsets
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const canvasCoords = canvas.getBoundingClientRect();

      canvas.width = window.innerWidth - canvasCoords.x;
      canvas.height = window.innerHeight - canvasCoords.y;

      console.log("Canvas initialized: ", canvas.width, canvas.height);
    }
  }, []);

  // Function to render the canvas content
  const renderCanvas = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      items: CanvasItem[],
      offsetX: number,
      offsetY: number,
      scale: number
    ) => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      ctx.save();
      ctx.translate(offsetX, offsetY);
      ctx.scale(scale, scale);

      // Render each item
      items.forEach((item) => {
        ctx.fillStyle = item.color;
        ctx.strokeStyle = outlineColor;
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.roundRect(item.x, item.y, item.width, item.height, item.radius);
        ctx.stroke();
        ctx.fill();
      });

      ctx.restore();
    },
    []
  );

  // Re-render the canvas when items, offset, or scale change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Render canvas content
    renderCanvas(ctx, items, offsetX, offsetY, scale);
  }, [items, offsetX, offsetY, scale, renderCanvas]);

  // Handle panning (dragging) based on wheel event without Ctrl key
  const handlePanning = useCallback((event: WheelEvent) => {
    const { deltaX, deltaY } = event;

    setOffsetX((prevOffsetX) => prevOffsetX + deltaX);
    setOffsetY((prevOffsetY) => prevOffsetY + deltaY);
  }, []);

  // Handle zooming (scaling) based on wheel event with Ctrl key
  const handleScaling = useCallback((event: WheelEvent) => {
    const { deltaY } = event;

    setScale((prevScale) => {
      const newScale = prevScale - deltaY * 0.01;
      return Math.max(0.1, Math.min(newScale, 2));
    });
  }, []);

  // General wheel event handler for both zooming and panning on touchpad
  const onWheel = useCallback(
    (event: React.WheelEvent<HTMLCanvasElement>) => {
      if (event.ctrlKey) {
        handleScaling(event.nativeEvent);
      } else {
        handlePanning(event.nativeEvent);
      }
    },
    [handlePanning, handleScaling]
  );

  // Function to add a new item on canvas click
  const addItem = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // early exit if mousedown on an existing element
    if (isConnection) {
      isConnection = false;
      return;
    }

    const canvasCoords = canvas.getBoundingClientRect();

    // Calculate the mouse position relative to the scaled canvas
    const x =
      (event.clientX - canvasCoords.left - offsetX) / scale - boxWidth / 2;
    const y =
      (event.clientY - canvasCoords.top - offsetY) / scale - boxHeight / 2;

    const newItem: CanvasItem = {
      x,
      y,
      width: boxWidth,
      height: boxHeight,
      color: boxColor,
      radius: boxRadius,
    };

    setItems((prevItems) => [...prevItems, newItem]);
  };

  let isConnection = false;
  let startConnectionItem: CanvasItem | null = null;
  const startConnection = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const canvasCoords = canvas.getBoundingClientRect();

    // Calculate the mouse position relative to the scaled canvas
    const x = (event.clientX - canvasCoords.left - offsetX) / scale;
    const y = (event.clientY - canvasCoords.top - offsetY) / scale;

    console.log(x, y);

    // Check if the click is on an existing item
    startConnectionItem = items.find((item) => {
      return (
        x >= item.x &&
        x <= item.x + item.width &&
        y >= item.y &&
        y <= item.y + item.height
      );
    });

    if (startConnectionItem) {
      isConnection = true;
      console.log("Clicked on item: ", startConnectionItem);
    }
  };

  const createConnection = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!isConnection) return;

    const canvasCoords = canvas.getBoundingClientRect();

    // Calculate the mouse position relative to the scaled canvas
    const x = (event.clientX - canvasCoords.left - offsetX) / scale;
    const y = (event.clientY - canvasCoords.top - offsetY) / scale;

    // If this event is on a new item then create a line from the initial item to the new item
    const endConnectionItem = items.find((item) => {
      return (
        x >= item.x &&
        x <= item.x + item.width &&
        y >= item.y &&
        y <= item.y + item.height
      );
    });

    if (endConnectionItem) {
      console.log("Connected to item: ", endConnectionItem);
      // Draw a line between the two items
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.save();
      ctx.translate(offsetX, offsetY);
      ctx.scale(scale, scale);

      ctx.strokeStyle = outlineColor;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(
        startConnectionItem.x + startConnectionItem.width / 2,
        startConnectionItem.y + startConnectionItem.height / 2
      );
      ctx.lineTo(
        endConnectionItem.x + endConnectionItem.width / 2,
        endConnectionItem.y + endConnectionItem.height / 2
      );
      ctx.stroke();

      ctx.restore();
    }
  };

  return (
    <canvas
      ref={canvasRef}
      onWheel={onWheel}
      onClick={addItem}
      onMouseDown={startConnection}
      onMouseUp={createConnection}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        display: "block",
        margin: 0,
        padding: 0,
        overflow: "hidden",
      }}
    />
  );
};

export default Canvas;
