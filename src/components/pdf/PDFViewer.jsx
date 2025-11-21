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

  // Actual display zoom (smooth zoom)
  const [scale, setScale] = useState(1.2);

  // Debounced zoom used for rendering PDF (improves performance)
  const [renderScale, setRenderScale] = useState(1.2);

  const MIN_SCALE = 0.6;
  const MAX_SCALE = 3.0;

  // Smooth debouncing (avoid rerendering every frame)
  useEffect(() => {
    const id = setTimeout(() => {
      setRenderScale(scale);
    }, 120);
    return () => clearTimeout(id);
  }, [scale]);

  // -----------------------------------------------------
  // Expose scrollToPage API
  // -----------------------------------------------------
  useImperativeHandle(ref, () => ({
    scrollToPage: (pageNumber) => {
      const pageDiv = pageRefs.current[pageNumber - 1];
      if (pageDiv && containerRef.current) {
        pageDiv.scrollIntoView({ behavior: "smooth" });
      }
    },
  }));

  // =====================================================
  // Pinch-to-zoom (Mobile) — Smooth and no browser zoom
  // =====================================================
  let initialDistance = null;
  let initialScale = null;

  const getDistance = (touches) => {
    const [a, b] = touches;
    return Math.hypot(a.pageX - b.pageX, a.pageY - b.pageY);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      initialDistance = getDistance(e.touches);
      initialScale = scale;
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length !== 2 || !initialDistance) return;

    // Prevent browser-native pinch zoom
    e.preventDefault();

    const newDistance = getDistance(e.touches);
    const factor = newDistance / initialDistance;

    let nextScale = initialScale * factor;
    nextScale = Math.min(Math.max(nextScale, MIN_SCALE), MAX_SCALE);

    setScale(nextScale);
  };

  // =====================================================
  // Desktop Zoom Buttons
  // =====================================================
  const zoomIn = () => setScale((prev) => Math.min(prev + 0.15, MAX_SCALE));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.15, MIN_SCALE));

  // =====================================================
  // Fit Buttons
  // =====================================================
  const fitToWidth = () => {
    const w = containerRef.current?.clientWidth || 1;
    setScale(w / 900);
  };

  const fitToPage = () => {
    const h = containerRef.current?.clientHeight || 1;
    setScale(h / 1200);
  };

  // =====================================================
  // Highlight logic (re-run after zoom settles)
  // =====================================================
  useEffect(() => {
    if (!highlight) return;

    const idx = highlight.page - 1;
    const pageDiv = pageRefs.current[idx];
    if (!pageDiv) return;

    const clear = () =>
      document.querySelectorAll(".pdf-highlight").forEach((el) => el.remove());
    clear();

    const interval = setInterval(() => {
      const textLayer = pageDiv.querySelector(".react-pdf__Page__textContent");
      if (textLayer && textLayer.querySelector("span")) {
        HighlightLayer.searchAndHighlight(textLayer, highlight.text);
        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [highlight, renderScale]);

  // =====================================================
  // Render Component
  // =====================================================
  return (
    <div className="h-full w-full flex flex-col bg-gray-100">

      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 bg-white shadow-sm border-b sticky top-0 z-20">

        <button
          onClick={zoomOut}
          className="p-1 rounded bg-gray-200 hover:bg-gray-300"
        >
          <ZoomOut size={18} />
        </button>

        <button
          onClick={zoomIn}
          className="p-1 rounded bg-gray-200 hover:bg-gray-300"
        >
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

      {/* PDF Container */}
      <div
        ref={containerRef}
        className="overflow-auto flex-1 touch-pan-y touch-pan-x"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
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
                scale={renderScale}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                loading="Loading page…"
              />
            </div>
          ))}
        </Document>
      </div>
    </div>
  );
});

export default PDFViewer;
