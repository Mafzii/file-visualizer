import React, { useRef, useEffect, useState, useCallback } from "react";

// Define the type for items
interface CanvasItem {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [items, setItems] = useState<CanvasItem[]>([]);

  // * all control variables for general items
  const scale = 1;
  const boxWidth = 125;
  const boxHeight = 75;
  const boxRadius = 25;
  const boxColor = "#4f46e5";
  const outlineColor = "#d1d5db";

  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasCoords = canvas.getBoundingClientRect();
    setOffsetX(canvasCoords.x);
    setOffsetY(canvasCoords.y);
    console.log("initial offset: ", canvasCoords.x, canvasCoords.y);
    canvas.width = window.innerWidth - offsetX;
    canvas.height = window.innerHeight - offsetY;
    // todo canvas generation is off
  }, []);

  // Ref to store the latest wheel event for debouncing
  const latestWheelEvent = useRef<WheelEvent | null>(null);

  // Function to render the canvas content
  const renderCanvas = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      items: CanvasItem[],
      offsetX: number,
      offsetY: number
    ) => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      ctx.save();
      ctx.resetTransform()
      ctx.translate(offsetX, offsetY);

      // Render each item
      items.forEach((item) => {
        ctx.fillStyle = item.color;
        ctx.fillRect(item.x, item.y, item.width, item.height);
      });

      ctx.restore();
    },
    []
  );

  // Handle the actual panning with debouncing using requestAnimationFrame
  const handlePanning = useCallback(() => {
    // if (!latestWheelEvent.current) return;

    const { deltaX, deltaY } = latestWheelEvent.current;
    setOffsetX((prevOffsetX) => prevOffsetX + deltaX);
    setOffsetY((prevOffsetY) => prevOffsetY + deltaY);
  }, []);

  // Wheel event handler
  const onWheel = useCallback(
    (event: React.WheelEvent<HTMLCanvasElement>) => {
      // Store the latest wheel event details
      latestWheelEvent.current = event.nativeEvent;

      // Use requestAnimationFrame to handle debouncing
      requestAnimationFrame(handlePanning);
    },
    [handlePanning]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Initial and subsequent rendering
    renderCanvas(ctx, items, offsetX, offsetY);
  }, [items, offsetX, offsetY, renderCanvas]);

  // Function to add a new item
  const addItem = (event: { clientX: number; clientY: number }) => {
    const x = event.clientX - offsetX*2; //- Math.floor(boxWidth / 2)) * scale;
    const y = event.clientY - offsetY*2; //- Math.floor(boxHeight / 2)) * scale;
    console.log("client: ", event.clientX, event.clientY);
    console.log("offsets: ", offsetX, offsetY);
    console.log("position: ", x, y);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const newItem: CanvasItem = {
      x: x,
      y: y,
      width: boxWidth,
      height: boxHeight,
      color: boxColor,
    };

    setItems((prevItems) => [...prevItems, newItem]);
    renderCanvas(ctx, items, offsetX, offsetY);
  };

  // Function to update an existing item
  const updateItem = (index: number, newProperties: Partial<CanvasItem>) => {
    setItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index] = { ...updatedItems[index], ...newProperties };
      return updatedItems;
    });
  };

  return (
    <canvas
      ref={canvasRef}
      className="h-full w-full"
      onWheel={onWheel}
      onClick={addItem}
      style={{
        border: '1px solid black',
        display: 'block', // Prevents inline-block margin issues
        margin: 0, // Reset margins
        padding: 0, // Reset padding
      }}
    />
  );
};

export default Canvas;
