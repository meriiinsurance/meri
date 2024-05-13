import './App.css';
import { useEffect, useState } from 'react';
import { storage } from './firebase2';
import { ref, uploadBytes } from 'firebase/storage';
import { v4 } from 'uuid';

function App() {
  const [pdfUpload, setPdfUpload] = useState(null);
  const [isUploading, setIsUploading] = useState(false); // State to track uploading status

  const uploadPdf = () => {
    if (pdfUpload == null) return;
    setIsUploading(true); // Start uploading

    const fileExtension = pdfUpload.name.split('.').pop();
    const newFileName = `${pdfUpload.name.replace(/\.[^/.]+$/, "")}${v4()}.${fileExtension}`;
    const pdfRef = ref(storage, `pdfs/${newFileName}`);

    uploadBytes(pdfRef, pdfUpload).then(() => {
      alert("PDF uploaded successfully");
      setIsUploading(false); // Finish uploading
    }).catch(error => {
      alert("Error uploading PDF: " + error.message);
      setIsUploading(false); // Finish uploading on error
    });
  };

  return (
    <div>
      <input 
        type="file"
        accept="application/pdf"
        onChange={(event) => setPdfUpload(event.target.files[0])}
      />
      <button onClick={uploadPdf} disabled={isUploading}>
        {isUploading ? 'Uploading...' : 'Upload PDF'} {/* Change button text based on state */}
      </button>
    </div>
  );
}

export default App;
