import './App.css';
import { MUIButton } from './MUIButtons';
import { Potrace } from './potrace';
import React, { useState } from 'react';


function App() {
  const [previewSrc, setPreviewSrc] = useState('');
  const [f, setF] = useState('');
  const [svg, setSVG] = useState('');

  const handleFileSelect = (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];

    if (file) {
      setF(file);
      console.log('set f')
    }
  };
  
  const { loadImageFromFile, process, setParameter, getSVG } = Potrace;

  const downloadOutput = (output) => {
    const blob = new Blob([output], { type: 'image/svg+xml' });

    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = 'your_image.svg';

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  const getOutput = () => {
    console.log('finished process');
    const output = getSVG(1)
    setSVG(output);
    console.log(output);
    // downloadOutput(output);
  };

  const convertImage = () => {
    loadImageFromFile(f);
    console.log('hit load');
    process(getOutput);
  };

  const SVGRenderer = ({ svgString }) => {
    return (
      <div dangerouslySetInnerHTML={{ __html: svgString }} />
    );
  };

  return (
    <div>
      <input type="file" onChange={handleFileSelect} />
      {previewSrc && <img src={previewSrc} alt="Preview" />}
      <MUIButton onClick={() => {convertImage()}}>Load me</MUIButton>
      <SVGRenderer svgString={svg}></SVGRenderer>
    </div>
  );
}

export default App;
