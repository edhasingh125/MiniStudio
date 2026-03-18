import { useEffect, useRef, useState } from "react";
import { Canvas, Text } from "fabric";
import axios from "axios";

function Editor() {
  const canvasRef = useRef(null);
  const fabricCanvas = useRef(null);
  const [designs, setDesigns] = useState([]);

  // =========================
  // FETCH DESIGNS
  // =========================
  const fetchDesigns = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/designs", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      setDesigns(res.data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  // =========================
  // INITIALIZE CANVAS
  // =========================
  useEffect(() => {
    if (!canvasRef.current) return;
    if (fabricCanvas.current) return;

    fabricCanvas.current = new Canvas(canvasRef.current, {
      width: 800,
      height: 500,
      backgroundColor: "#ebe1e1"
    });

    fetchDesigns();

    return () => {
      fabricCanvas.current?.dispose();
      fabricCanvas.current = null;
    };
  }, []);

  // =========================
  // ADD TEXT
  // =========================
  const addText = () => {
    const text = new Text("New Text", {
      left: 100,
      top: 100,
      fill: "black"
    });

    fabricCanvas.current.add(text);
  };

  // =========================
  // DELETE OBJECT
  // =========================
  const deleteObject = () => {
    const activeObject = fabricCanvas.current.getActiveObject();

    if (activeObject) {
      fabricCanvas.current.remove(activeObject);
    }
  };

  // =========================
  // CHANGE COLOR
  // =========================
  const changeColor = () => {
    const activeObject = fabricCanvas.current.getActiveObject();

    if (activeObject) {
      activeObject.set("fill", "red");
      fabricCanvas.current.renderAll();
    }
  };

  // =========================
  // SAVE DESIGN
  // =========================
  const handleSave = async () => {
    try {
      const canvasData = fabricCanvas.current.toJSON();

      await axios.post(
        "http://localhost:5000/api/designs",
        {
          title: `Design ${Date.now()}`,
          canvasData
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      alert("Design saved!");
      fetchDesigns();

    } catch (error) {
      console.error("Save error:", error);
    }
  };

  // =========================
  // LOAD DESIGN
  // =========================
  const loadDesign = (design) => {
    fabricCanvas.current.loadFromJSON(design.canvasData, () => {
      fabricCanvas.current.renderAll();
    });
  };

  // =========================
  // RENAME DESIGN
  // =========================
  const renameDesign = async (design) => {
    const newTitle = prompt("Enter new name:", design.title);

    if (!newTitle) return;

    try {
      await axios.put(
        `http://localhost:5000/api/designs/${design._id}`,
        { title: newTitle },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      fetchDesigns();
      console.log("Updated designs:", res.data);

    } catch (error) {
      console.error("Rename error:", error);
    }
    console.log("Renamed to:", newTitle);
  };

  // =========================
  // UI
  // =========================
  return (
    <div style={{ display: "flex", height: "100vh" }}>

      {/* SIDEBAR */}
      <div
        style={{
          width: "260px",
          padding: "15px",
          borderRight: "1px solid #ccc",
          background: "#1e1e1e",
          color: "#fff"
        }}
      >
        <h3>My Designs</h3>

        {designs.length === 0 ? (
          <p>No designs</p>
        ) : (
          designs.map((design) => (
            <div
              key={design._id}
              style={{
                display: "flex",
                gap: "5px",
                marginBottom: "8px"
              }}
            >
              <button
                onClick={() => loadDesign(design)}
                style={{
                  flex: 1,
                  padding: "6px",
                  borderRadius: "5px",
                  border: "none",
                  background: "#333",
                  color: "#fff",
                  cursor: "pointer"
                }}
              >
                {design.title}
              </button>

              <button
                onClick={() => renameDesign(design)}
                style={{
                  padding: "6px",
                  borderRadius: "5px",
                  border: "none",
                  background: "#555",
                  color: "#fff",
                  cursor: "pointer"
                }}
              >
                ✏️
              </button>
            </div>
          ))
        )}
      </div>

      {/* EDITOR */}
      <div style={{ flex: 1, padding: "20px" }}>
        <h2>MiniStudio Editor</h2>

        <div style={{ marginBottom: "10px" }}>
          <button onClick={addText}>Add Text</button>
          <button onClick={deleteObject}>Delete</button>
          <button onClick={changeColor}>Change Color</button>
          <button onClick={handleSave}>Save Design</button>
        </div>

        <canvas
          ref={canvasRef}
          style={{ border: "1px solid #ccc" }}
        ></canvas>
      </div>

    </div>
  );
}

export default Editor;