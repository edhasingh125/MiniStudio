import { useEffect, useRef, useState } from "react";
import {
  Canvas,
  Text,
  Rect,
  Circle,
  Image as FabricImage,
} from "fabric";
import axios from "axios";

function Editor() {
  const canvasRef = useRef(null);
  const fabricCanvas = useRef(null);

  const history = useRef([]);
  const redoStack = useRef([]);
  const timeoutRef = useRef(null);

  // -------------------------
  // STATE
  // -------------------------

  const [designs, setDesigns] = useState([]);
  const [activeDesignId, setActiveDesignId] = useState(null);

  const [color, setColor] = useState("#000000");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontSize, setFontSize] = useState(20);

  // -------------------------
  // FETCH DESIGNS
  // -------------------------

  const fetchDesigns = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const res = await axios.get(
        "http://localhost:5000/api/designs",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDesigns(res.data);
    } catch (err) {
      console.error("Fetch Error:", err.response?.data || err.message);
    }
  };

  // -------------------------
  // INIT CANVAS
  // -------------------------

  useEffect(() => {
    if (!canvasRef.current) return;

    if (fabricCanvas.current) return;

    fabricCanvas.current = new Canvas(canvasRef.current, {
      width: 900,
      height: 550,
      backgroundColor: "#ffffff",
    });

    history.current = [];
    redoStack.current = [];
    saveHistory();

    fetchDesigns();

    return () => {
      fabricCanvas.current?.dispose();
      fabricCanvas.current = null;
    };
  }, []);

  // -------------------------
  // HISTORY
  // -------------------------

  const saveHistory = () => {
    if (!fabricCanvas.current) return;

    history.current.push(fabricCanvas.current.toJSON());

    if (history.current.length > 50) {
      history.current.shift();
    }

    redoStack.current = [];
  };

  const undo = () => {
    if (history.current.length <= 1) return;

    const current = history.current.pop();

    redoStack.current.push(current);

    const previous =
      history.current[history.current.length - 1];

    fabricCanvas.current.loadFromJSON(previous, () => {
      fabricCanvas.current.renderAll();
    });
  };

  const redo = () => {
    if (!redoStack.current.length) return;

    const next = redoStack.current.pop();

    history.current.push(next);

    fabricCanvas.current.loadFromJSON(next, () => {
      fabricCanvas.current.renderAll();
    });
  };

  // =========================
// CANVAS ACTIONS
// =========================

const addText = () => {
  if (!fabricCanvas.current) return;

  const text = new Text("New Text", {
    left: 100,
    top: 100,
    fill: color,
    fontFamily,
    fontSize,
  });

  fabricCanvas.current.add(text);
  fabricCanvas.current.setActiveObject(text);
  fabricCanvas.current.renderAll();

  saveHistory();
};

const addRectangle = () => {
  if (!fabricCanvas.current) return;

  // Prevent white shapes on white canvas
  const fillColor = color === "#ffffff" ? "#3498db" : color;

  const rect = new Rect({
  left: 150,
  top: 150,
  width: 120,
  height: 70,

  fill: color,

  stroke: "#222",
  strokeWidth: 2,

  selectable: true
 });

 fabricCanvas.current.add(rect);
 console.log(fabricCanvas.current.getObjects());
 console.log(fabricCanvas.current);
 console.log(fabricCanvas.current.contextContainer);

 fabricCanvas.current.setActiveObject(rect);

 fabricCanvas.current.renderAll();

 console.log(rect);

  saveHistory();
};

const addCircle = () => {
  if (!fabricCanvas.current) return;

  // Prevent white shapes on white canvas
  const fillColor = color === "#ffffff" ? "#2ecc71" : color;
  console.log(color);

  const circle = new Circle({
    left: 180,
    top: 180,
    radius: 50,
    fill: fillColor,
    stroke: "#222",
    strokeWidth: 2,
  });

  fabricCanvas.current.add(circle);
  fabricCanvas.current.setActiveObject(circle);
  fabricCanvas.current.renderAll();

  saveHistory();
};

const deleteObject = () => {
  if (!fabricCanvas.current) return;

  const activeObject = fabricCanvas.current.getActiveObject();

  if (!activeObject) return;

  fabricCanvas.current.remove(activeObject);
  fabricCanvas.current.discardActiveObject();
  fabricCanvas.current.renderAll();

  saveHistory();
};

const changeColor = () => {
  if (!fabricCanvas.current) return;

  const activeObject = fabricCanvas.current.getActiveObject();

  if (!activeObject) return;

  activeObject.set("fill", color);

  activeObject.setCoords();

  fabricCanvas.current.renderAll();

  saveHistory();
};

const changeFont = () => {
  if (!fabricCanvas.current) return;

  const activeObject = fabricCanvas.current.getActiveObject();

  if (!activeObject) return;

  if (activeObject.type !== "text") return;

  activeObject.set("fontFamily", fontFamily);

  fabricCanvas.current.renderAll();

  saveHistory();
};

const changeFontSize = () => {
  if (!fabricCanvas.current) return;

  const activeObject = fabricCanvas.current.getActiveObject();

  if (!activeObject) return;

  if (activeObject.type !== "text") return;

  activeObject.set("fontSize", fontSize);

  fabricCanvas.current.renderAll();

  saveHistory();
};

const alignCenter = () => {
  if (!fabricCanvas.current) return;

  const activeObject = fabricCanvas.current.getActiveObject();

  if (!activeObject) return;

  activeObject.set({
    left: fabricCanvas.current.width / 2,
    top: fabricCanvas.current.height / 2,
    originX: "center",
    originY: "center",
  });

  activeObject.setCoords();

  fabricCanvas.current.renderAll();

  saveHistory();
};

// =========================
// IMAGE UPLOAD
// =========================

const uploadImage = (e) => {
  const file = e.target.files?.[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = async (event) => {
    try {
      const img = await FabricImage.fromURL(event.target.result);

      img.set({
        left: 120,
        top: 120,
        scaleX: 0.5,
        scaleY: 0.5,
      });

      fabricCanvas.current.add(img);
      fabricCanvas.current.setActiveObject(img);
      fabricCanvas.current.renderAll();

      saveHistory();
    } catch (err) {
      console.error(err);
    }
  };

  reader.readAsDataURL(file);
};

  // =========================
// BACKEND
// =========================

const handleSave = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    const canvasData = fabricCanvas.current.toJSON();

    await axios.post(
      "http://localhost:5000/api/designs",
      {
        title: `Design ${Date.now()}`,
        canvasData,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    await fetchDesigns();

    alert("Design Saved Successfully");
  } catch (err) {
    console.error(err);
    alert("Unable to save design.");
  }
};

const loadDesign = (design) => {
  if (!fabricCanvas.current) return;
  if (!design?.canvasData) return;

  fabricCanvas.current.clear();
  fabricCanvas.current.backgroundColor = "#ffffff";

  fabricCanvas.current.loadFromJSON(design.canvasData, () => {
    fabricCanvas.current.renderAll();
    saveHistory();
  });

  setActiveDesignId(design._id);
};

const renameDesign = async (design) => {
  const newTitle = prompt("Enter new design name", design.title);

  if (!newTitle) return;

  try {
    await axios.put(
      `http://localhost:5000/api/designs/${design._id}`,
      {
        title: newTitle,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    fetchDesigns();
  } catch (err) {
    console.error(err);
  }
};

const deleteDesign = async (id) => {
  const confirmDelete = window.confirm(
    "Delete this design?"
  );

  if (!confirmDelete) return;

  try {
    await axios.delete(
      `http://localhost:5000/api/designs/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (activeDesignId === id) {
      setActiveDesignId(null);
      fabricCanvas.current.clear();
      fabricCanvas.current.backgroundColor = "#fff";
      fabricCanvas.current.renderAll();
    }

    fetchDesigns();
  } catch (err) {
    console.error(err);
  }
};

// =========================
// DOWNLOAD
// =========================

const downloadImage = () => {
  if (!fabricCanvas.current) return;

  const dataURL = fabricCanvas.current.toDataURL({
    format: "png",
    quality: 1,
  });

  const link = document.createElement("a");

  link.href = dataURL;
  link.download = "MiniStudio-Design.png";

  link.click();
};

  // =========================
  // UI
  // =========================
  return (
  <div
    style={{
      display: "flex",
      height: "100vh",
      background: "#f4f4f4",
    }}
  >
    {/* ================= SIDEBAR ================= */}
    <div
      style={{
        width: "260px",
        background: "#1f2937",
        color: "white",
        padding: "15px",
        overflowY: "auto",
      }}
    >
      <h2>MiniStudio</h2>

      <h3>My Designs</h3>

      {designs.length === 0 ? (
        <p>No Designs Found</p>
      ) : (
        designs.map((design) => (
          <div
            key={design._id}
            style={{
              display: "flex",
              gap: "5px",
              marginBottom: "10px",
            }}
          >
            <button
              onClick={() => loadDesign(design)}
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData(
                  "design",
                  JSON.stringify(design)
                )
              }
              style={{
                flex: 1,
                padding: "6px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                background:
                  activeDesignId === design._id
                    ? "#22c55e"
                    : "#374151",
                color: "white",
              }}
            >
              {design.title}
            </button>

            <button onClick={() => renameDesign(design)}>
              ✏️
            </button>

            <button
              onClick={() => deleteDesign(design._id)}
            >
              🗑️
            </button>
          </div>
        ))
      )}
    </div>

    {/* ================= RIGHT SIDE ================= */}

    <div
      style={{
        flex: 1,
        padding: "20px",
      }}
    >
      <h2>MiniStudio Editor</h2>

      {/* Toolbar */}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          background: "#ffffff",
          padding: "12px",
          borderRadius: "10px",
          marginBottom: "20px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        }}
      >
        <button onClick={addText}>Text</button>

        <button onClick={addRectangle}>
          Rectangle
        </button>

        <button onClick={addCircle}>Circle</button>

        <input
          type="color"
          value={color}
          onChange={(e) =>
            setColor(e.target.value)
          }
        />

        <button onClick={changeColor}>
          Apply Color
        </button>

        <select
          value={fontFamily}
          onChange={(e) =>
            setFontFamily(e.target.value)
          }
        >
          <option>Arial</option>
          <option>Verdana</option>
          <option>Courier New</option>
          <option>Times New Roman</option>
        </select>

        <button onClick={changeFont}>
          Font
        </button>

        <input
          type="number"
          value={fontSize}
          onChange={(e) =>
            setFontSize(Number(e.target.value))
          }
          style={{ width: "70px" }}
        />

        <button onClick={changeFontSize}>
          Font Size
        </button>

        <button onClick={alignCenter}>
          Center
        </button>

        <button onClick={deleteObject}>
          Delete
        </button>

        <button onClick={undo}>Undo</button>

        <button onClick={redo}>Redo</button>

        <button onClick={handleSave}>
          Save
        </button>

        <button onClick={downloadImage}>
          Download
        </button>

        <input
          type="file"
          accept="image/*"
          onChange={uploadImage}
        />
      </div>

      {/* Canvas */}

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          const data =
            e.dataTransfer.getData("design");

          if (!data) return;

          loadDesign(JSON.parse(data));
        }}
        style={{
          background: "#ddd",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            border: "2px solid #444",
            background: "white",
          }}
        />
      </div>
    </div>
  </div>
  );
  }

export default Editor;