import React, { useRef, useEffect } from "react";
import ViewableBibleBlock from "./ViewableBibleBlock";

export default function ViewableBible({
  chapterJson,
  dir,
  systemBcv,
  word,
  snippet,
}) {
  const lastPrintedVerseRef = useRef(null);

  useEffect(() => {
    async function loadCSS() {
      const url = "/api/app-resources/usfm/bible_page_styles.css";
      const response = await fetch(url);
      if (!response.ok) {
        console.error("Erreur de chargement du CSS :", response.status);
        return;
      }
      const cssText = await response.text();
      const style = document.createElement("style");
      style.textContent = cssText;
      document.head.appendChild(style);
    }
    loadCSS();
  }, []);

  return (
    <div style={{ padding: "2px 12px" }} dir={dir}>
      {chapterJson.blocks.map((b, n) => {
        if (b.tag === "b") {
          return <div key={n} style={{ height: "1em" }} />;
        }
        switch (b.type) {
          case "chapter":
            return "";
          case "remark":
          case "main":
          default:
            return (
              <ViewableBibleBlock
                key={n}
                blockJson={b}
                systemBcv={systemBcv}
                systemWord={word}
                systemSnippet={snippet}
                lastPrintedVerseRef={lastPrintedVerseRef}
              />
            );
        }
      })}
    </div>
  );
}
