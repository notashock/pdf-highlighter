import { useRef, useState } from "react";
import SplitPane from "./components/layout/SplitPane";
import PDFViewer from "./components/pdf/PDFViewer";
import AnalysisPanel from "./components/analysis/AnalysisPanel";
import { HIGHLIGHT_TARGETS } from "./constants/highlightTargets";

export default function App() {
  const pdfViewerRef = useRef(null);
  const [highlight, setHighlight] = useState(null);

  const handleRefClick = (refNumber) => {
    const target = HIGHLIGHT_TARGETS[refNumber];
    if (!target) return;

    // 1. Clear any previous highlight (optional but recommended)
    setHighlight(null);

    // 2. Scroll to the page
    pdfViewerRef.current?.scrollToPage(target.page);

    // 3. Wait for scroll + text layer to appear, then highlight
    setTimeout(() => {
      setHighlight(target);
    }, 400); // 350–500ms works well
  };

  return (
    <SplitPane
      left={<PDFViewer ref={pdfViewerRef} highlight={highlight} />}
      right={<AnalysisPanel onRefClick={handleRefClick} />}
    />
  );
}
