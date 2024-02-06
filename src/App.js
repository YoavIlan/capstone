import React, { useState, useCallback } from 'react';
import './App.css';
import { MUIButton } from './MUIButtons';
import { Potrace } from './potrace';

function App() {
  const [file, setFile] = useState(null);
  const [svg, setSVG] = useState('');
  const [isConverted, setIsConverted] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const onFileChange = (event) => {
    const newFile = event.target.files[0];
    if (newFile) {
      setFile(newFile);
      setIsConverted(false);
    }
  };

  const onDragOver = (event) => {
    event.preventDefault();
    setDragActive(true);
  };

  const onDragLeave = () => {
    setDragActive(false);
  };

  const onDrop = (event) => {
    event.preventDefault();
    const newFile = event.dataTransfer.files[0];
    if (newFile) {
      setFile(newFile);
      setIsConverted(false);
    }
    setDragActive(false);
  };

  const { loadImageFromFile, process, getSVG } = Potrace;

  const convertImage = () => {
    if (file) {
      loadImageFromFile(file);
      process(() => {
        const output = getSVG(1);
        setSVG(output);
        setIsConverted(true);
      });
    }
  };

  const downloadSVG = () => {
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = 'converted_image.svg';
    downloadLink.click();
  };

  return (
    <div className="App">
      <div className={`drag-image ${dragActive ? "active" : ""} ${file ? "file-uploaded" : ""}`}
           onDragOver={onDragOver}
           onDragLeave={onDragLeave}
           onDrop={onDrop}>
        {!isConverted && !file && (
          <>
            <h6>{dragActive ? "Release to Upload File" : "Drag & Drop to Upload File"}</h6>
            <input type="file" onChange={onFileChange} hidden />
            <button onClick={() => document.querySelector("input[type=file]").click()}>Choose a file</button>
          </>
        )}
        {file && !isConverted && <img src={URL.createObjectURL(file)} alt="Preview" className="uploaded-image"/>}
        {isConverted && <div dangerouslySetInnerHTML={{ __html: svg }} className="svg-container"/>}
      </div>
      <div className="button-container">
        {!isConverted && file && <MUIButton onClick={convertImage}>Convert</MUIButton>}
        {isConverted && <MUIButton onClick={downloadSVG}>Download SVG</MUIButton>}
      </div>
    </div>
  );
}

export default App;
