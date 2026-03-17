import { useEffect, useRef } from "react";
import { Canvas, Text } from "fabric";
import axios from "axios";

function Editor() {

  const canvasRef = useRef(null);
  const fabricCanvas = useRef(null);

  // Initialize canvas
  useEffect(() => {
  if (!canvasRef.current) return;

  // Prevent re-initialization
  if (fabricCanvas.current) return;

  fabricCanvas.current = new Canvas(canvasRef.current, {
    width: 800,
    height: 500,
    backgroundColor: "#ebe1e1"
  });

  return () => {
    fabricCanvas.current?.dispose();
    fabricCanvas.current = null;
  };
}, []);

  // Add Text
  const addText = () => {
    const text = new Text("New Text", {
      left: 100,
      top: 100,
      fill: "black"
    });

    fabricCanvas.current.add(text);
  };

  // Delete Object
  const deleteObject = () => {
    const activeObject = fabricCanvas.current.getActiveObject();

    if (activeObject) {
      fabricCanvas.current.remove(activeObject);
    }
  };

  // Change Color
  const changeColor = () => {
    const activeObject = fabricCanvas.current.getActiveObject();

    if (activeObject) {
      activeObject.set("fill", "red");
      fabricCanvas.current.renderAll();
    }
  };

  // Save Design
  const handleSave = async () => {
    const canvasData = fabricCanvas.current.toJSON();

    await axios.post(
      "http://localhost:5000/api/designs",
      {
        title: "My Design",
        canvasData
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    alert("Design saved!");
  };

  // Load Design
  const handleLoad = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/designs", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      const designs = res.data;

      if (designs.length === 0) {
        alert("No designs found");
        return;
      }

      const firstDesign = designs[0];

      fabricCanvas.current.loadFromJSON(firstDesign.canvasData, () => {
        fabricCanvas.current.renderAll();
      });

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>

      <h2>MiniStudio Editor</h2>

      <div style={{ marginBottom: "10px" }}>
        <button onClick={addText}>Add Text</button>
        <button onClick={deleteObject}>Delete</button>
        <button onClick={changeColor}>Change Color</button>
        <button onClick={handleSave}>Save Design</button>
        <button onClick={handleLoad}>Load Designs</button>
      </div>

      <canvas
        ref={canvasRef}
        style={{ border: "1px solid #ccc" }}
      ></canvas>

    </div>
  );
}

export default Editor;