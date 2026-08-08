import { Rect, Circle, IText, Image } from "fabric";
import axios from "axios";

function Toolbar() {

  const addRectangle = () => {
    const canvas = window.fabricCanvas;

    if (!canvas) {
      alert("Canvas not found");
      return;
    }

    const rect = new Rect({
      left: 100,
      top: 100,
      width: 150,
      height: 100,
      fill: "red",
      stroke: "black",
      strokeWidth: 2,
    });

    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();
  };

  const addCircle = () => {
    const canvas = window.fabricCanvas;

    if (!canvas) {
      alert("Canvas not found");
      return;
    }

    const circle = new Circle({
      left: 300,
      top: 120,
      radius: 50,
      fill: "dodgerblue",
      stroke: "black",
      strokeWidth: 2,
    });

    canvas.add(circle);
    canvas.setActiveObject(circle);
    canvas.renderAll();
  };
  const addText = () => {
  const canvas = window.fabricCanvas;

  if (!canvas) {
    alert("Canvas not found");
    return;
  }

  const text = new IText("Double Click Me", {
    left: 150,
    top: 250,
    fontSize: 30,
    fill: "#222",
    fontFamily: "Arial",
  });

  canvas.add(text);
  canvas.setActiveObject(text);
  canvas.renderAll();
  };
  const deleteObject = () => {
  const canvas = window.fabricCanvas;

  if (!canvas) {
    alert("Canvas not found");
    return;
  }

  const activeObject = canvas.getActiveObject();

  if (!activeObject) {
    alert("Select an object first");
    return;
  }

  canvas.remove(activeObject);
  canvas.renderAll();
  };
  
  const changeColor = () => {
  const canvas = window.fabricCanvas;

  if (!canvas) {
    alert("Canvas not found");
    return;
  }

  const activeObject = canvas.getActiveObject();

  if (!activeObject) {
    alert("Select an object first");
    return;
  }

  const color = document.getElementById("colorPicker").value;

  activeObject.set({
    fill: color,
  });

  canvas.renderAll();
  };
  
  const changeFont = () => {
  const canvas = window.fabricCanvas;

  const active = canvas.getActiveObject();

  if (!active || active.type !== "i-text") {
    alert("Select a text object");
    return;
  }

  const font = document.getElementById("fontFamily").value;

  active.set({
    fontFamily: font,
  });

  canvas.renderAll();
  };

  const changeFontSize = () => {
  const canvas = window.fabricCanvas;

  const active = canvas.getActiveObject();

  if (!active || active.type !== "i-text") {
    alert("Select a text object");
    return;
  }

  const size = Number(
    document.getElementById("fontSize").value
  );

  active.set({
    fontSize: size,
  });

  canvas.renderAll();
  };

  const uploadImage = (e) => {
  const canvas = window.fabricCanvas;

  const file = e.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    Image.fromURL(reader.result)
      .then((img) => {
        img.set({
          left: 200,
          top: 150,
          scaleX: 0.5,
          scaleY: 0.5,
        });

        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
      })
      .catch((err) => console.error(err));
  };

  reader.readAsDataURL(file);
  };


  const saveDesign = async () => {
  try {
    const canvas = window.fabricCanvas;

    const canvasData = canvas.toJSON();

    const token = localStorage.getItem("token");

    const response = await axios.post(
      "http://localhost:5000/api/designs",
      {
        title: "Design " + Date.now(),
        canvasData,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Design Saved Successfully!");

    console.log(response.data);

  } catch (error) {
  console.log("FULL ERROR:", error);
  console.log("Response:", error.response);
  console.log("Data:", error.response?.data);
  console.log("Status:", error.response?.status);

  alert("Save Failed");
  }
  };



  return (
  <div className="toolbar">

    <button onClick={addText}>Text</button>

    <button onClick={addRectangle}>Rectangle</button>

    <button onClick={addCircle}>Circle</button>

    <input
      id="colorPicker"
      type="color"
      defaultValue="#ff0000"
    />

    <button onClick={changeColor}>
      Apply Color
    </button>

    <select id="fontFamily">
      <option>Arial</option>
      <option>Times New Roman</option>
      <option>Courier New</option>
      <option>Verdana</option>
      <option>Georgia</option>
    </select>

    <input
      id="fontSize"
      type="number"
      defaultValue={24}
      min={8}
      max={100}
    />

    <button onClick={changeFont}>
       Font
    </button>

    <button onClick={changeFontSize}>
     Font Size
    </button>

    

    <label className="upload-btn">
     Upload Image
     <input
          type="file"
         accept="image/*"
         onChange={uploadImage}
         hidden
       />
    </label>

    <button onClick={deleteObject}>
      Delete
    </button>

    <button onClick={saveDesign}>
       Save
    </button>

    <button>
      Download
    </button>

  </div>
  );
}

export default Toolbar;