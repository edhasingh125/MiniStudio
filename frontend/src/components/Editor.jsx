import { useEffect, useRef, useState } from "react";
import { Canvas, Text, Rect, Circle, Image as FabricImage } from "fabric";
import axios from "axios";

function Editor() {
  const canvasRef = useRef(null);
  const fabricCanvas = useRef(null);

  const [designs, setDesigns] = useState([]);
  const [color, setColor] = useState("#000000");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontSize, setFontSize] = useState(20);

  const history = useRef([]);
  const redoStack = useRef([]);

  // =========================
  // FETCH DESIGNS
  // =========================
  const fetchDesigns = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.warn("No token found");
        return;
      }

      const response = await axios.get("http://localhost:5000/api/designs", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("Designs:", response.data);
      setDesigns(response.data);

    } catch (error) {
      console.error("Fetch error:", error.response?.data || error.message);
    }
  };

  // =========================
  // INIT CANVAS
  // =========================
  useEffect(() => {
    if (!canvasRef.current || fabricCanvas.current) return;

    fabricCanvas.current = new Canvas(canvasRef.current, {
      width: 800,
      height: 500,
      backgroundColor: "#ebe1e1"
    });

    fetchDesigns();
    saveHistory();

    return () => {
      fabricCanvas.current.dispose();
      fabricCanvas.current = null;
    };
  }, []);

  // =========================
  // HISTORY
  // =========================
  const saveHistory = () => {
    if (!fabricCanvas.current) return;

    const json = fabricCanvas.current.toJSON();
    history.current.push(json);

    if (history.current.length > 50) {
      history.current.shift();
    }

    redoStack.current = [];
  };

  const undo = () => {
    if (history.current.length < 2) return;

    const last = history.current.pop();
    redoStack.current.push(last);

    const prev = history.current[history.current.length - 1];

    fabricCanvas.current.loadFromJSON(prev, () => {
      fabricCanvas.current.renderAll();
    });
  };

  const redo = () => {
    if (!redoStack.current.length) return;

    const state = redoStack.current.pop();
    history.current.push(state);

    fabricCanvas.current.loadFromJSON(state, () => {
      fabricCanvas.current.renderAll();
    });
  };

  // =========================
  // CANVAS ACTIONS
  // =========================
  const addText = () => {
    const text = new Text("New Text", {
      left: 100,
      top: 100,
      fill: color,
      fontFamily,
      fontSize
    });

    fabricCanvas.current.add(text);
    saveHistory();
  };

  const addRectangle = () => {
    const rect = new Rect({
      left: 150,
      top: 150,
      width: 100,
      height: 60,
      fill: color
    });

    fabricCanvas.current.add(rect);
    saveHistory();
  };

  const addCircle = () => {
    const circle = new Circle({
      left: 200,
      top: 200,
      radius: 50,
      fill: color
    });

    fabricCanvas.current.add(circle);
    saveHistory();
  };

  const deleteObject = () => {
    const obj = fabricCanvas.current.getActiveObject();
    if (obj) {
      fabricCanvas.current.remove(obj);
      saveHistory();
    }
  };

  const changeColor = () => {
    const obj = fabricCanvas.current.getActiveObject();
    if (obj) {
      obj.set("fill", color);
      fabricCanvas.current.renderAll();
      saveHistory();
    }
  };

  const changeFont = () => {
    const obj = fabricCanvas.current.getActiveObject();
    if (obj && obj.type === "text") {
      obj.set("fontFamily", fontFamily);
      fabricCanvas.current.renderAll();
      saveHistory();
    }
  };

  const changeFontSize = () => {
    const obj = fabricCanvas.current.getActiveObject();
    if (obj && obj.type === "text") {
      obj.set("fontSize", fontSize);
      fabricCanvas.current.renderAll();
      saveHistory();
    }
  };

  const alignCenter = () => {
    const obj = fabricCanvas.current.getActiveObject();

    if (obj) {
      obj.set({
        left: fabricCanvas.current.width / 2,
        top: fabricCanvas.current.height / 2,
        originX: "center",
        originY: "center"
      });

      obj.setCoords(); // 🔥 important fix
      fabricCanvas.current.renderAll();
      saveHistory();
    }
  };

  // =========================
  // IMAGE UPLOAD (FIXED)
  // =========================
  const uploadImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (event) => {
      const img = await FabricImage.fromURL(event.target.result);

      img.set({
        left: 100,
        top: 100,
        scaleX: 0.5,
        scaleY: 0.5
      });

      fabricCanvas.current.add(img);
      fabricCanvas.current.renderAll();
      saveHistory();
    };

    reader.readAsDataURL(file);
  };

  // =========================
  // BACKEND
  // =========================
  const handleSave = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Login required");
      return;
    }

    await axios.post(
      "http://localhost:5000/api/designs",
      {
        title: `Design ${Date.now()}`,
        canvasData: fabricCanvas.current.toJSON()
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    fetchDesigns();
  };

  const loadDesign = (design) => {
    if (!design?.canvasData) return;

    fabricCanvas.current.clear();

    fabricCanvas.current.loadFromJSON(design.canvasData, () => {
      fabricCanvas.current.renderAll();
      saveHistory(); // 🔥 important fix
    });
  };

  const renameDesign = async (design) => {
    const newTitle = prompt("Rename:", design.title);
    if (!newTitle) return;

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
  };

  const deleteDesign = async (id) => {
    if (!window.confirm("Delete design?")) return;

    await axios.delete(`http://localhost:5000/api/designs/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    fetchDesigns();
  };

  // =========================
  // DOWNLOAD
  // =========================
  const downloadImage = () => {
    const dataURL = fabricCanvas.current.toDataURL({ format: "png" });

    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "design.png";
    link.click();
  };

  // =========================
  // UI
  // =========================
  return (
    <div style={{ display: "flex", height: "100vh" }}>

      {/* SIDEBAR */}
      <div style={{ width: "260px", padding: "15px", background: "#1e1e1e", color: "#fff" }}>
        <h3>My Designs</h3>

        {designs.length === 0 ? (
          <p>No designs found</p>
        ) : (
          designs.map((design) => (
            <div key={design._id} style={{ display: "flex", gap: "5px", marginBottom: "8px" }}>
              <button onClick={() => loadDesign(design)} style={{ flex: 1 }}>
                {design.title}
              </button>
              <button onClick={() => renameDesign(design)}>✏️</button>
              <button onClick={() => deleteDesign(design._id)}>🗑️</button>
            </div>
          ))
        )}
      </div>

      {/* EDITOR */}
      <div style={{ flex: 1, padding: "20px" }}>
        <h2>MiniStudio Editor</h2>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button onClick={addText}>Text</button>
          <button onClick={addRectangle}>Rectangle</button>
          <button onClick={addCircle}>Circle</button>

          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
          <button onClick={changeColor}>Color</button>

          <select onChange={(e) => setFontFamily(e.target.value)}>
            <option>Arial</option>
            <option>Courier New</option>
            <option>Times New Roman</option>
            <option>Verdana</option>
          </select>
          <button onClick={changeFont}>Font</button>

          <input
            type="number"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            style={{ width: "60px" }}
          />
          <button onClick={changeFontSize}>Size</button>

          <button onClick={alignCenter}>Center</button>

          <button onClick={deleteObject}>Delete</button>
          <button onClick={undo}>Undo</button>
          <button onClick={redo}>Redo</button>

          <button onClick={handleSave}>Save</button>
          <button onClick={downloadImage}>Download</button>

          <input type="file" onChange={uploadImage} />
        </div>

        <canvas ref={canvasRef} style={{ border: "1px solid #ccc", marginTop: "10px" }} />
      </div>
    </div>
  );
}

export default Editor;