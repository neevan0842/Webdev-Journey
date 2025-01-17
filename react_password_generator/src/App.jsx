import React, { useState, useEffect, useRef } from "react";

const App = () => {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(12);
  const [isNumbers, setIsNumbers] = useState(false);
  const [isSymbols, setIsSymbols] = useState(false);

  const generatePassword = () => {
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    if (isNumbers) chars += "0123456789";
    if (isSymbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let password = "";
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(password);
  };

  const passwordRef = useRef(null);

  const copyToClipboard = () => {
    window.navigator.clipboard.writeText(password);
    passwordRef.current.select();
  };

  useEffect(() => {
    generatePassword();
  }, [length, isNumbers, isSymbols]);

  return (
    <div className="w-full h-screen bg-gray-400 flex justify-center items-center">
      <div className="bg-slate-400 p-6 rounded-lg shadow-lg w-full max-w-md fixed top-10">
        <h1 className="text-black text-3xl text-center font-semibold mb-6">
          Password Generator
        </h1>

        <div className="flex items-center justify-between rounded-lg overflow-hidden border border-gray-300 mb-4">
          <input
            className="outline-none px-3 py-2 flex-grow"
            type="text"
            value={password}
            readOnly
            placeholder="Your password"
            ref={passwordRef}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 hover:bg-blue-700"
            onClick={copyToClipboard}
          >
            Copy
          </button>
        </div>

        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <label htmlFor="length" className="text-black">
              Length
            </label>
            <input
              type="range"
              id="length"
              className="flex-grow mx-4"
              min="4"
              max="24"
              defaultValue={length}
              onChange={(e) => setLength(e.target.value)}
            />
            <span className="text-black">{length}</span>
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="numbers" className="text-black">
              Include Numbers
            </label>
            <input
              type="checkbox"
              id="numbers"
              onChange={(e) => setIsNumbers(e.target.checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="symbols" className="text-black">
              Include Symbols
            </label>
            <input
              type="checkbox"
              id="symbols"
              onChange={(e) => setIsSymbols(e.target.checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
