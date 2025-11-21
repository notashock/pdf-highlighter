import { useState, useRef, useEffect } from "react";

export default function SplitPane({ left, right }) {
  const [leftWidth, setLeftWidth] = useState(50); 
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const dragging = useRef(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const startDrag = () => (dragging.current = true);
  const stopDrag = () => (dragging.current = false);

  const onDrag = (e) => {
    if (!dragging.current || !isDesktop) return;

    const newWidth = (e.clientX / window.innerWidth) * 100;
    if (newWidth > 20 && newWidth < 80) setLeftWidth(newWidth);
  };

  return (
    <div
      className="
        w-screen h-screen overflow-hidden
        flex flex-col md:flex-row
        touch-pan-y
      "
      onMouseMove={onDrag}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
    >
      {/* LEFT PANE */}
      <div
        className="
          h-1/2 md:h-full
          w-full md:overflow-hidden bg-white
        "
        style={{ width: isDesktop ? `${leftWidth}%` : "100%" }}
      >
        {left}
      </div>

      {isDesktop && (
        <div
          className="
            w-1 bg-gray-300 hover:bg-gray-400
            cursor-col-resize transition-colors
          "
          onMouseDown={startDrag}
        />
      )}

      {/* RIGHT PANE */}
      <div
        className="
          flex-1 h-1/2 md:h-full
          bg-white overflow-auto p-4
          touch-pan-y
        "
      >
        {right}
      </div>
    </div>
  );
}
