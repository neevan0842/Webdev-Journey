import React, { useState } from "react";

const App = () => {
  const colorArray = ["red", "green", "blue", "yellow", "white"];
  const [color, setColor] = useState("olive");

  return (
    <div
      className="w-full h-screen bg-gray-500"
      style={{ backgroundColor: color }}
    >
      <div className=" fixed bottom-12 inset-x-0 px-2 flex flex-wrap justify-center">
        <div className="bg-white w-full px-4 py-2 flex flex-wrap justify-center shadow-lg rounded-3xl">
          {colorArray.map((color, idx) => (
            <button
              key={idx}
              className={`px-4 py-2 text-black mx-2 shadow-lg rounded-full w-24`}
              onClick={() => setColor(color)}
              style={{ backgroundColor: color }}
            >
              {color}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
