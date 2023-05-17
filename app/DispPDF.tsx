"use client"
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Document, Page, pdfjs } from 'react-pdf';
import '../styles/pdf.css';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

type Props = {
  url: string;
}

const DispPDF = ({url} : Props) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const pdfContRef = useRef(null);

  useEffect(() => {
    setIsLoading(true)
    const fetchPDF = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/pdf?url='+ url, {
          responseType: 'arraybuffer',
        });
        const pdfData = new Blob([response.data], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(pdfData);
        setPdfUrl(pdfUrl);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPDF();
  }, [url]);

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  }, []);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1); // Reset the page number when a new document is loaded
  };

  const handlePreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const handleNextPage = () => {
    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (pdfContRef.current && document.activeElement === pdfContRef.current) {
        if (e.key === 'ArrowRight') {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
          console.log('right');
        }
        if (e.key === 'ArrowLeft') {
          handlePreviousPage();
        }
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [pageNumber])

  return (
    <div id="pdfCont" ref={pdfContRef} className='h-[900px] w-[695px] bg-gray-100 dark:bg-gray-900 focus:bg-red-500'>
      {isLoading ? (
        <div className="h-[900px] w-[695px] bg-gray-100 dark:bg-gray-900 flex justify-center items-center"> <div className="text-gray-400 dark:text-gray-600 animate-spin repeat-infinite">
        <Loader2 size={30} />
      </div></div>
      ) : (
        <div className='pdfContainer rounded-lg'>
          <Document className="dark:invert" style={{textAlign: 'center'}}
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            <Page pageNumber={pageNumber} height={900} width={695}/>
          </Document>
          <div className='flex justify-center absolute dark:bg-gray-800 bg-white p-1.5 rounded-xl mt-1 shadow-md' >
            <button onClick={handlePreviousPage} disabled={pageNumber === 1}>
              <ChevronLeft/>
            </button>
            <span className='mx-2'>
              Page {pageNumber} / {numPages}
            </span>
            <button onClick={handleNextPage} disabled={pageNumber === numPages}>
              <ChevronRight/>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DispPDF;
