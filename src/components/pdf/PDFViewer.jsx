import {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from "react";
import { Document, Page } from "react-pdf";
import { ZoomIn, ZoomOut } from "lucide-react";   // ⬅️ NEW
import HighlightLayer from "./HighlightLayer";
import pdfFile from "/Maersk_Q2_2025_Interim_Report.pdf";

const PDFViewer = forwardRef(({ highlight }, ref) => {
  const containerRef = useRef(null);
  const pageRefs = useRef([]);
  const [numPages, setNumPages] = useState(null);

  const [scale, setScale] = useState(1.2);
  const MIN_SCALE = 0.6;
  const MAX_SCALE = 3.0;

  // Scroll-to-page exposed to parent
  useImperativeHandle(ref, () => ({
    scrollToPage: (pageNumber) => {
      const pageDiv = pageRefs.current[pageNumber - 1];
      if (pageDiv && containerRef.current) {
        pageDiv.scrollIntoView({ behavior: "smooth" });
      }
    },
  }));

  // Pinch zoom (mobile)
  let initialDistance = null;

  const getDistance = (touches) => {
    const [a, b] = touches;
    const dx = a.pageX - b.pageX;
    const dy = a.pageY - b.pageY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      initialDistance = getDistance(e.touches);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length !== 2) return;

    const newDistance = getDistance(e.touches);
    if (!initialDistance) return;

    const delta = newDistance - initialDistance;

    setScale((prev) => {
      let next = prev + delta * 0.002;
      next = Math.min(Math.max(next, MIN_SCALE), MAX_SCALE);
      return next;
    });

    initialDistance = newDistance;
  };

  // Fit controls
  const fitToWidth = () => {
    const containerWidth = containerRef.current.clientWidth;
    setScale(containerWidth / 900);
  };

  const fitToPage = () => {
    const containerHeight = containerRef.current.clientHeight;
    setScale(containerHeight / 1200);
  };

  // Zoom controls (Lucide icons)
  const zoomIn = () => setScale((prev) => Math.min(prev + 0.15, MAX_SCALE));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.15, MIN_SCALE));

  // Reapply highlight when zoom changes
  useEffect(() => {
    if (!highlight || !highlight.page) return;

    const pageIndex = highlight.page - 1;
    const pageDiv = pageRefs.current[pageIndex];
    if (!pageDiv) return;

    const clearAll = () => {
      const all = document.querySelectorAll(".pdf-highlight");
      all.forEach((box) => box.remove());
    };

    clearAll();

    const interval = setInterval(() => {
      const textLayer = pageDiv.querySelector(".react-pdf__Page__textContent");
      if (textLayer && textLayer.querySelector("span")) {
        HighlightLayer.searchAndHighlight(textLayer, highlight.text);
        clearInterval(interval);
      }
    }, 180);

    return () => clearInterval(interval);
  }, [highlight, scale]);

  return (
    <div className="h-full w-full flex flex-col bg-gray-100">

      {/* Control Bar */}
      <div className="flex items-center gap-2 p-2 bg-white shadow-sm border-b sticky top-0 z-20">

        {/* Zoom Out */}
        <button
          onClick={zoomOut}
          className="p-1 rounded bg-gray-200 hover:bg-gray-300"
        >
          <ZoomOut size={18} />
        </button>

        {/* Zoom In */}
        <button
          onClick={zoomIn}
          className="p-1 rounded bg-gray-200 hover:bg-gray-300"
        >
          <ZoomIn size={18} />
        </button>

        {/* Fit Buttons */}
        <button
          onClick={fitToWidth}
          className="ml-3 px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-xs"
        >
          Fit-Width
        </button>

        <button
          onClick={fitToPage}
          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-xs"
        >
          Fit-Page
        </button>

        <span className="ml-auto text-xs text-gray-600">
          {Math.round(scale * 100)}%
        </span>
      </div>

      {/* PDF AREA */}
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        className="overflow-auto flex-1 p-4"
      >
        <Document
          file={pdfFile}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          className="flex flex-col items-center"
        >
          {Array.from({ length: numPages }, (_, i) => (
            <div
              key={i}
              ref={(el) => (pageRefs.current[i] = el)}
              className="relative mb-6 shadow bg-white rounded-md p-2"
            >
              <Page
                pageNumber={i + 1}
                scale={scale}
                renderTextLayer
                renderAnnotationLayer
              />
            </div>
          ))}
        </Document>
      </div>
    </div>
  );
});

export default PDFViewer;
