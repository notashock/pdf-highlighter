const HighlightLayer = {
  searchAndHighlight(textLayerDiv, searchText) {
    if (!textLayerDiv || !searchText) return;

    const spans = Array.from(textLayerDiv.querySelectorAll("span"));
    if (spans.length === 0) return;

    // Build continuous text with EXACT PDF content
    let fullText = "";
    const map = [];

    spans.forEach((span) => {
      const raw = span.textContent || "";

      map.push({
        start: fullText.length,
        end: fullText.length + raw.length,
        span,
      });

      fullText += raw;
    });

    const normalizedFull = fullText.toLowerCase();
    const normalizedSearch = searchText.toLowerCase();

    const startIndex = normalizedFull.indexOf(normalizedSearch);
    if (startIndex === -1) return;

    const endIndex = startIndex + normalizedSearch.length;

    // Clear old highlights
    textLayerDiv.querySelectorAll(".pdf-highlight").forEach((h) => h.remove());

    // Highlight all spans intersecting with the match range
    map.forEach(({ start, end, span }) => {
      const overlaps = end > startIndex && start < endIndex;
      if (!overlaps) return;

      const rect = span.getBoundingClientRect();
      const parentRect = textLayerDiv.getBoundingClientRect();

      const overlay = document.createElement("div");
      overlay.className = "pdf-highlight";

      // Tailwind CSS computed values
      overlay.style.position = "absolute";        // absolute
      overlay.style.backgroundColor = "#fde047";  // bg-yellow-300
      overlay.style.opacity = "0.4";              // opacity-40
      overlay.style.pointerEvents = "none";       // pointer-events-none

      // Dynamic placement
      overlay.style.top = rect.top - parentRect.top + "px";
      overlay.style.left = rect.left - parentRect.left + "px";
      overlay.style.width = rect.width + "px";
      overlay.style.height = rect.height + "px";

      textLayerDiv.appendChild(overlay);
    });
  },
};

export default HighlightLayer;
