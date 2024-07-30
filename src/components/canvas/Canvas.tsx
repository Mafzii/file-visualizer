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

interface Connection {
  item1: CanvasItem;
  item2: CanvasItem;
  color: string;
  side1: string;
  side2: string;
}

// use memoization on the items coming from the parent component
const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [scale, setScale] = useState(1.0);
  const [items, setItems] = useState<CanvasItem[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [isConnection, setIsConnection] = useState(false);
  const [startConnectionItem, setStartConnectionItem] =
    useState<CanvasItem | null>(null);

  // * Control variables for general items
  const boxWidth = 125;
  const boxHeight = 75;
  const boxRadius = 25;
  const boxColor = "#4f46e5";
  const circleColor = "#f43f5e";
  const outlineColor = "#d1d5db";
  const connectionColor = "#d1d5db";

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
      connections: Connection[],
      offsetX: number,
      offsetY: number,
      scale: number
    ) => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      ctx.save();
      ctx.translate(offsetX, offsetY);
      ctx.scale(scale, scale);

      // Render each item
      items?.forEach((item) => {
        ctx.fillStyle = item.color;
        ctx.strokeStyle = outlineColor;
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.roundRect(item.x, item.y, item.width, item.height, item.radius);
        ctx.stroke();
        ctx.fill();
      });

      // Render connections between items
      connections?.forEach(({ item1, item2, color, side1, side2 }) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 5;
        ctx.beginPath();
        // adjust the connection for the sides to connect to
        const { x: x1, y: y1 } = getCoordinatesBasedOnSide(item1, side1);
        const { x: x2, y: y2 } = getCoordinatesBasedOnSide(item2, side2);
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);


        ctx.stroke();
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
    renderCanvas(ctx, items, connections, offsetX, offsetY, scale);
  }, [items, connections, offsetX, offsetY, scale, renderCanvas]);

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
      setIsConnection(false);
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

  const startConnection = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const canvasCoords = canvas.getBoundingClientRect();

    // Calculate the mouse position relative to the scaled canvas
    const x = (event.clientX - canvasCoords.left - offsetX) / scale;
    const y = (event.clientY - canvasCoords.top - offsetY) / scale;

    // Check if the click is on an existing item
    const startConnectionItem = items.find((item) => {
      return (
        x >= item.x &&
        x <= item.x + item.width &&
        y >= item.y &&
        y <= item.y + item.height
      );
    });

    if (startConnectionItem) {
      setIsConnection(true);
      setStartConnectionItem(startConnectionItem);
      console.log("Clicked on item: ", startConnectionItem);
    }
  };

  const createConnection = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

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
      setIsConnection(true);
      console.log("Connected to item: ", endConnectionItem);

      // stop duplicate connections
      if (connectionsDupeCheck(startConnectionItem, endConnectionItem)) {
        console.log("Connection already exists");
        return;
      }

      const { side1, side2 } = getConnectionSides(
        startConnectionItem,
        endConnectionItem
      );

      setConnections((prevConnections) => [
        ...prevConnections,
        {
          item1: startConnectionItem,
          item2: endConnectionItem,
          color: connectionColor,
          side1,
          side2,
        },
      ]);
    }
  };

  const getConnectionSides = (start: CanvasItem, end: CanvasItem) => {
    // calculate the side of the item to connect to
    // based on the position of the items
    // return the side of each item to connect to
    const startCenterX = start.x + start.width / 2;
    const startCenterY = start.y + start.height / 2;
    const endCenterX = end.x + end.width / 2;
    const endCenterY = end.y + end.height / 2;

    if (startCenterX < endCenterX) return { side1: "right", side2: "left" };
    if (startCenterX > endCenterX) return { side1: "left", side2: "right" };
    if (startCenterY < endCenterY) return { side1: "bottom", side2: "top" };
    if (startCenterY > endCenterY) return { side1: "top", side2: "bottom" };
  };

  const connectionsDupeCheck = (item1: CanvasItem, item2: CanvasItem) => {
    return connections.some((connection) => {
      // check x and y coordinates of both items
      // check reverse connection too
      return (
        (connection.item1.x === item1.x &&
          connection.item1.y === item1.y &&
          connection.item2.x === item2.x &&
          connection.item2.y === item2.y) ||
        (connection.item1.x === item2.x &&
          connection.item1.y === item2.y &&
          connection.item2.x === item1.x &&
          connection.item2.y === item1.y)
      );
    });
  };

  const getCoordinatesBasedOnSide = (item: CanvasItem, side: string) => {
    // calculate the coordinates based on the side of the item
    // return the x and y coordinates based on the side
    switch (side) {
      case "top":
        return { x: item.x + item.width / 2, y: item.y };
      case "bottom":
        return { x: item.x + item.width / 2, y: item.y + item.height };
      case "left":
        return { x: item.x, y: item.y + item.height / 2 };
      case "right":
        return { x: item.x + item.width, y: item.y + item.height / 2 };
      default:
        return { x: item.x, y: item.y };
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
