import { useEffect, useState } from 'react';
import { storage } from './firebase2';
import { ref, listAll, getDownloadURL } from 'firebase/storage';

function DownloadShow() {
    const [pdfs, setPdfs] = useState([]);

    useEffect(() => {
        const fetchPdfs = async () => {
            const pdfsListRef = ref(storage, 'pdfs/');  // Changed to 'pdfs/' directory
            listAll(pdfsListRef)
                .then((response) => {
                    return Promise.all(response.items.map((item) => {
                        return getDownloadURL(item).then((url) => {
                            console.log(url)
                            return { url, name: item.name };
                        });
                    }));
                })
                .then((pdfObjects) => {
                    setPdfs(pdfObjects);
                })
                .catch((error) => {
                    console.error("Error fetching PDFs: ", error);
                });
        };

        fetchPdfs();
    }, []);

    const downloadPdf = async (url, name) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = name;
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (e) {
            console.error('Error in downloading the PDF:', e);
            alert('Failed to download PDF: ' + e.message);
        }
    };
    
    const pdfElement = (pdf) => {
        const { url, name } = pdf;
        return (
            <div key={name} className="file-display">
                <a href={url} target="_blank" rel="noopener noreferrer">{name}</a>
                <button onClick={() => downloadPdf(url, name)}>Download PDF</button>
            </div>
        );
    };

    return (
        <div className="file-gallery">
            {pdfs.map(pdf => pdfElement(pdf))}
        </div>
    );
}

export default DownloadShow;
