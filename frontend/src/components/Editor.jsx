import "./Editor.css";
import CanvasArea from "./CanvasArea";
import Toolbar from "./Toolbar";
import { useEffect, useState } from "react";
import axios from "axios";

function Editor() {
  const [designs, setDesigns] = useState([]);

  useEffect(() => {
    fetchDesigns();
  }, []);

  // Fetch all saved designs
  const fetchDesigns = async () => {
    try {
      const token = localStorage.getItem("token");

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
      console.log(err);
    }
  };

  // Load selected design
  const loadDesign = async (design) => {
    const canvas = window.fabricCanvas;

    if (!canvas) {
      alert("Canvas not found");
      return;
    }

    try {
      canvas.clear();

      await canvas.loadFromJSON(design.canvasData);

      canvas.backgroundColor = "#ffffff";

      canvas.renderAll();

      console.log("Design Loaded");
    } catch (err) {
      console.log(err);
      alert("Unable to load design");
    }
  };

  return (
    <div className="editor-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">MiniStudio</div>

        <div className="nav-links">
          <button>🏠 Home</button>
          <button>👤 Profile</button>
          <button>🚪 Logout</button>
        </div>
      </nav>

      {/* Layout */}
      <div className="editor-layout">

        {/* Sidebar */}
        <aside className="sidebar">
          <h2>My Designs</h2>

          {designs.length === 0 ? (
            <div className="design-card">
              No Designs Yet
            </div>
          ) : (
            designs.map((design) => (
              <div
                key={design._id}
                className="design-card"
                onClick={() => loadDesign(design)}
              >
                {design.title}
              </div>
            ))
          )}
        </aside>

        {/* Workspace */}
        <main className="workspace">

          {/* Toolbar */}
          <div className="toolbar">
            <Toolbar fetchDesigns={fetchDesigns} />
          </div>

          {/* Canvas */}
          <div className="editor-canvas">
            <CanvasArea />
          </div>

        </main>

      </div>
    </div>
  );
}

export default Editor;