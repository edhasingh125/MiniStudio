import { useEffect, useRef } from "react";
import * as fabric from "fabric";
import axios from "axios";


function Editor() {

  const canvasRef = useRef(null);
  const fabricCanvas = useRef(null);

  useEffect(() => {

    fabricCanvas.current = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 500,
      backgroundColor: "#ffffff"
    });

    const text = new fabric.Text("Hello MiniStudio", {
      left: 200,
      top: 200
    });

    fabricCanvas.current.add(text);

    return () => {
      fabricCanvas.current.dispose();
    };

  }, []);

  const addText = () => {

  const text = new fabric.Text("New Text", {
    left: 100,
    top: 100,
    fill: "black"
  });

  fabricCanvas.current.add(text);
  };
  const deleteObject = () => {

  const activeObject = fabricCanvas.current.getActiveObject();

  if (activeObject) {
    fabricCanvas.current.remove(activeObject);
  }
  };

  const changeColor = () => {

  const activeObject = fabricCanvas.current.getActiveObject();

  if (activeObject) {
    activeObject.set("fill", "red");
    fabricCanvas.current.renderAll();
  }
  };
  const saveDesign = async () => {

  try {

    const canvasData = fabricCanvas.current.toJSON();

    const token = localStorage.getItem("token");

    const response = await axios.post(
      "http://localhost:5000/api/designs",
      {
        title: "My Design",
        canvasData: canvasData
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    alert("Design saved successfully!");

    console.log(response.data);

  } catch (error) {

    console.error(error);
    alert("Error saving design");

  }

  };
  const loadDesigns = async () => {

  try {

    const token = localStorage.getItem("token");

    const response = await axios.get(
      "http://localhost:5000/api/designs",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    console.log("My designs:", response.data);

    alert(`Found ${response.data.length} saved designs`);

  } catch (error) {

    console.error(error);

  }

  };

  return (
  <div>

    <div style={{ marginBottom: "10px" }}>
      <button onClick={addText}>Add Text</button>
      <button onClick={deleteObject}>Delete</button>
      <button onClick={changeColor}>Change Color</button>
      <button onClick={saveDesign}>Save Design</button>
      <button onClick={loadDesigns}>Load Designs</button>
    </div>

    <canvas
      ref={canvasRef}
      style={{ border: "1px solid #ccc" }}
    ></canvas>

  </div>
);

}

export default Editor;