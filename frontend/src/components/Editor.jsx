import { useEffect, useRef, useState } from "react";
import { Canvas, Text, Rect, Circle, Image as FabricImage } from "fabric";
import axios from "axios";

function Editor() {
  const canvasRef = useRef(null);
  const fabricCanvas = useRef(null);
  const [designs, setDesigns] = useState([]);

  const history = useRef([]);
  const redoStack = useRef([]);

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
      console.error(error);
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

    // History tracking
    fabricCanvas.current.on("object:added", saveHistory);
    fabricCanvas.current.on("object:modified", saveHistory);
    fabricCanvas.current.on("object:removed", saveHistory);

    saveHistory(); // initial state

    return () => {
      fabricCanvas.current.dispose();
      fabricCanvas.current = null;
    };
  }, []);

  // =========================
  // HISTORY
  // =========================
  const saveHistory = () => {
    const json = fabricCanvas.current.toJSON();
    history.current.push(json);
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
    const text = new Text("New Text", { left: 100, top: 100, fill: "black" });
    fabricCanvas.current.add(text);
  };

  const addRectangle = () => {
    const rect = new Rect({
      left: 150,
      top: 150,
      width: 100,
      height: 60,
      fill: "blue"
    });
    fabricCanvas.current.add(rect);
  };

  const addCircle = () => {
    const circle = new Circle({
      left: 200,
      top: 200,
      radius: 50,
      fill: "green"
    });
    fabricCanvas.current.add(circle);
  };

  const deleteObject = () => {
    const obj = fabricCanvas.current.getActiveObject();
    if (obj) fabricCanvas.current.remove(obj);
  };

  const changeColor = () => {
    const obj = fabricCanvas.current.getActiveObject();
    if (obj) {
      obj.set("fill", "red");
      fabricCanvas.current.renderAll();
    }
  };

  // =========================
  // IMAGE UPLOAD
  // =========================
  const uploadImage = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (event) => {
    const imgElement = new Image();
    imgElement.src = event.target.result;

    imgElement.onload = () => {
      const imgInstance = new FabricImage(imgElement, {
        left: 100,
        top: 100,
        scaleX: 0.5,
        scaleY: 0.5
      });

      fabricCanvas.current.add(imgInstance);
      fabricCanvas.current.renderAll();
    };
  };

  reader.readAsDataURL(file);
};

  // =========================
  // BACKEND ACTIONS
  // =========================
  const handleSave = async () => {
    const canvasData = fabricCanvas.current.toJSON();

    await axios.post(
      "http://localhost:5000/api/designs",
      { title: `Design ${Date.now()}`, canvasData },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );

    fetchDesigns();
  };

  const loadDesign = (design) => {
    fabricCanvas.current.loadFromJSON(design.canvasData, () => {
      fabricCanvas.current.renderAll();
    });
  };

  const renameDesign = async (design) => {
    const newTitle = prompt("Rename:", design.title);
    if (!newTitle) return;

    await axios.put(
      `http://localhost:5000/api/designs/${design._id}`,
      { title: newTitle },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );

    fetchDesigns();
  };

  const deleteDesign = async (id) => {
    if (!window.confirm("Delete design?")) return;

    await axios.delete(`http://localhost:5000/api/designs/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });

    fetchDesigns();
  };

  // =========================
  // DOWNLOAD
  // =========================
  const downloadImage = () => {
    const dataURL = fabricCanvas.current.toDataURL({
      format: "png",
      quality: 1
    });

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

        {designs.map((design) => (
          <div key={design._id} style={{ display: "flex", gap: "5px", marginBottom: "8px" }}>
            <button onClick={() => loadDesign(design)} style={{ flex: 1 }}>
              {design.title}
            </button>
            <button onClick={() => renameDesign(design)}>✏️</button>
            <button onClick={() => deleteDesign(design._id)}>🗑️</button>
          </div>
        ))}
      </div>

      {/* EDITOR */}
      <div style={{ flex: 1, padding: "20px" }}>
        <h2>MiniStudio Editor</h2>

        <div style={{ marginBottom: "10px" }}>
          <button onClick={addText}>Text</button>
          <button onClick={addRectangle}>Rectangle</button>
          <button onClick={addCircle}>Circle</button>
          <button onClick={deleteObject}>Delete</button>
          <button onClick={changeColor}>Color</button>
          <button onClick={undo}>Undo</button>
          <button onClick={redo}>Redo</button>
          <button onClick={handleSave}>Save</button>
          <button onClick={downloadImage}>Download</button>

          <input type="file" onChange={uploadImage} />
        </div>

        <canvas ref={canvasRef} style={{ border: "1px solid #ccc" }} />
      </div>
    </div>
  );
}

export default Editor;