# 📄 Maersk PDF Analysis Web App

This web application displays the **Maersk Q2 2025 Interim Report** alongside an interactive analysis panel.  
It enables reference-based navigation between sections of the analysis and the PDF, highlighting specific text dynamically.

---

## 🚀 Features

### ✅ PDF Rendering
- Displays the Maersk Q2 2025 PDF using **react-pdf**.
- Supports multi-page rendering with smooth scrolling.

### ✅ Reference → PDF Linking
- The analysis panel includes references like **[1] [2] [3]**.
- Clicking a reference scrolls the PDF to the correct page.
- Highlights the exact corresponding text inside the PDF.
- Works even when the text spans across multiple PDF.js `<span>` layers.

### ✅ Smart Highlight System
- Custom overlay-based text highlighting.
- Accurate multi-span match detection.
- Re-positions highlights correctly after zooming.

### ✅ Zooming
- **Pinch-to-zoom** on mobile (two-finger gesture).
- **Zoom In / Zoom Out** using Lucide React icons.
- **Fit to Width** and **Fit to Page** utility buttons.

### ✅ Responsive Split Layout
- **Desktop:** Side-by-side PDF + Analysis panel with a **draggable resizer**.
- **Mobile:** Stacked layout (PDF on top, Analysis below).
- Smooth resizing with width constraints for better UX.

### ✅ TailwindCSS Styling
- Fully styled using Tailwind utility classes.
- Clean, modern UI with subtle shadows and spacing.
- Custom slim scrollbars (no arrow buttons).

---

## 🛠️ Tech Stack

- **React + Vite**  
- **react-pdf** (PDF viewer)
- **TailwindCSS** (styling)
- **Lucide React** (icons)
- **Custom text highlight engine** (built on top of PDF.js)

---

## 📦 Development

Install dependencies:

```bash
npm install
