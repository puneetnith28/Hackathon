import React, { useState, useEffect } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism.css";
import "./CodeEditor.css";

const CodeEditor = () => {
  const [code, setCode] = useState("");

  useEffect(() => {
    Prism.highlightAll();
  }, [code]);

  const handleCodeChange = (event) => {
    setCode(event.target.value);
  };

  const executeCode = async () => {
    try {
      const result = await executeInSandbox(code);
      alert(`🚀 Output: ${result}`);
    } catch (error) {
      alert(`⚠️ Error: ${error.message}`);
    }
  };

  const executeInSandbox = (code) => {
    return new Promise((resolve, reject) => {
      const worker = new Worker("path/to/your/worker.js");
      worker.postMessage(code);

      worker.onmessage = (event) => {
        if (event.data.error) {
          reject(new Error(event.data.error));
        } else {
          resolve(event.data.result);
        }
      };

      worker.onerror = (error) => {
        reject(new Error(error.message));
      };
    });
  };

  return (
    <div className="coder-container">
      <h2>📝 Galactic Code Console</h2>
      <pre className="language-javascript">
        <code className="language-javascript">{code}</code>
      </pre>
      <textarea
        value={code}
        onChange={handleCodeChange}
        rows="15"
        placeholder="🚀 Type your code here... (supports multiple languages!)"
        className="code-input"
        onCopy={(e) => e.preventDefault()}
        onPaste={(e) => e.preventDefault()}
      />
      <button className="execute-button" onClick={executeCode}>
        🚀 Launch Code
      </button>
    </div>
  );
};

export default CodeEditor;