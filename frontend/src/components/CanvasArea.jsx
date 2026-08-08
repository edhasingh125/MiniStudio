import { useEffect, useRef } from "react";
import { Canvas } from "fabric";

function CanvasArea() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = new Canvas(canvasRef.current, {
      width: 900,
      height: 550,
      backgroundColor: "#ffffff",
    });

    // Expose the canvas globally for now
    window.fabricCanvas = canvas;

    return () => {
      canvas.dispose();
      window.fabricCanvas = null;
    };
  }, []);

  return (
    <canvas ref={canvasRef} />
  );
}

export default CanvasArea;