import {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from "react";
import { Document, Page } from "react-pdf";
import { ZoomIn, ZoomOut } from "lucide-react";
import HighlightLayer from "./HighlightLayer";

const pdfFile = "/Maersk_Q2_2025_Interim_Report.pdf";

const PDFViewer = forwardRef(({ highlight }, ref) => {
  const containerRef = useRef(null);
  const pageRefs = useRef([]);
  const [numPages, setNumPages] = useState(null);

  const [scale, setScale] = useState(1.2);
  const MIN_SCALE = 0.6;
  const MAX_SCALE = 3.0;

  // Expose scrollToPage
  useImperativeHandle(ref, () => ({
    scrollToPage: (pageNumber) => {
      const pageDiv = pageRefs.current[pageNumber - 1];
      if (pageDiv) pageDiv.scrollIntoView({ behavior: "smooth" });
    },
  }));

  // ============================================
  // 🚀 Advanced Smooth Pinch-to-Zoom (Mobile)
  // ============================================
  let initialDistance = null;
  let lastScale = null;

  const getDistance = (touches) => {
    const [a, b] = touches;
    return Math.hypot(a.pageX - b.pageX, a.pageY - b.pageY);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      initialDistance = getDistance(e.touches);
      lastScale = scale;
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length !== 2 || !initialDistance) return;

    e.preventDefault(); // prevent browser zoom

    const newDistance = getDistance(e.touches);
    const factor = newDistance / initialDistance;

    let next = lastScale * factor;
    next = Math.min(Math.max(next, MIN_SCALE), MAX_SCALE);

    setScale(next);
  };

  // ============================================
  // Zoom Button Controls
  // ============================================
  const zoomIn = () => setScale((prev) => Math.min(prev + 0.15, MAX_SCALE));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.15, MIN_SCALE));

  const fitToWidth = () => {
    if (!containerRef.current) return;
    const cw = containerRef.current.clientWidth;
    setScale(cw / 900);
  };

  const fitToPage = () => {
    if (!containerRef.current) return;
    const ch = containerRef.current.clientHeight;
    setScale(ch / 1200);
  };

  // ============================================
  // Reapply Highlight When Zoom Changes
  // ============================================
  useEffect(() => {
    if (!highlight) return;

    const pageDiv = pageRefs.current[highlight.page - 1];
    if (!pageDiv) return;

    document.querySelectorAll(".pdf-highlight").forEach((h) => h.remove());

    const interval = setInterval(() => {
      const layer = pageDiv.querySelector(".react-pdf__Page__textContent");
      if (layer && layer.querySelector("span")) {
        HighlightLayer.searchAndHighlight(layer, highlight.text);
        clearInterval(interval);
      }
    }, 180);

    return () => clearInterval(interval);
  }, [highlight, scale]);

  // ============================================
  // Render
  // ============================================
  return (
    <div className="h-full w-full flex flex-col bg-gray-100">

      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 bg-white shadow-sm border-b sticky top-0 z-20">

        <button onClick={zoomOut} className="p-1 rounded bg-gray-200 hover:bg-gray-300">
          <ZoomOut size={18} />
        </button>

        <button onClick={zoomIn} className="p-1 rounded bg-gray-200 hover:bg-gray-300">
          <ZoomIn size={18} />
        </button>

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

      {/* PDF Area */}
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        className="overflow-auto flex-1 touch-none"  // Ensures browser pinch doesn't interfere
      >
        <Document
          file={pdfFile}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          className="flex flex-col"
        >
          {Array.from({ length: numPages }, (_, i) => (
            <div
              key={i}
              ref={(el) => (pageRefs.current[i] = el)}
              className="relative mb-6 shadow bg-white rounded-md"
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
