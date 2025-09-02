 import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";
import "./MermaidChart.css";

let mermaidId = 0;

export default function MermaidChart({ chart, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      mermaid.initialize({ startOnLoad: false });
      const uniqueKey = `mermaid-svg-${++mermaidId}`;
      mermaid.render(uniqueKey, chart).then(({ svg }) => {
        ref.current.innerHTML = svg;

        const svgElem = ref.current.querySelector("svg");
        if (!svgElem) return;

        const edgePaths = svgElem.querySelectorAll(".edgePath");

        edgePaths.forEach((edge) => {
          edge.addEventListener("mouseenter", () => {
            // Dim all edges and nodes
            edgePaths.forEach((e) => e.classList.add("dim"));
            svgElem.querySelectorAll(".node").forEach((n) => n.classList.add("dim"));

            // Highlight this specific edge
            edge.classList.remove("dim");
            edge.classList.add("highlight");

            // Get connected node IDs from the edge title
            const edgeTitle = edge.querySelector("title");
            if (edgeTitle) {
              const match = edgeTitle.textContent.match(/^([A-Za-z0-9_]+).*?([A-Za-z0-9_]+)$/);
              if (match) {
                const fromId = match[1].trim();
                const toId = match[2].trim();

                // Highlight only the connected nodes
                svgElem.querySelectorAll(".node").forEach((node) => {
                  if (node.id === fromId || node.id === toId) {
                    node.classList.remove("dim");
                    node.classList.add("highlight");
                  }
                });
              }
            }
          });

          edge.addEventListener("mouseleave", () => {
            // Remove all dimming & highlighting
            edgePaths.forEach((e) => e.classList.remove("dim", "highlight"));
            svgElem.querySelectorAll(".node").forEach((n) => n.classList.remove("dim", "highlight"));
          });
        });
      });
    }
  }, [chart]);

  return <div ref={ref} className={`mermaid-chart-container ${className}`} />;
}
