import { Button, Typography, Box } from "@mui/material";
import { originatePdfs } from "../pdfExport/pdf-gen/originatePdfs";
import { assemblePdfs } from "../pdfExport/pdf-gen/assemblePdf";
import FirefoxInstaller from "./FirefoxInstaller";
import pages from "../pdfExport/pdf-gen/Css/Ressources/pages.json";
import fonts from "../pdfExport/pdf-gen/Css/Ressources/fonts.json";
import sizes from "../pdfExport/pdf-gen/Css/Ressources/sizes.json";
import { setupCSS } from "../pdfExport/pdf-gen/doCss";

let testThing = {
  global: {
    fonts: "allGentium",
    pages: "A4P",
    sizes: "9on10",
    outputPath: "/home/mark/Downloads/juxtas.pdf",
    workingDir: "/home/mark/.jxlpdf/working",
    verbose: false,
    referencePunctuation: {
      bookChapter: " ",
      chapterVerse: ".",
      verseRange: "-",
    },
  },
  sections: [
    {
      type: "bcvWrapper",
      ranges: ["MRK"],
      sections: [
        {
          id: "juxtaSimple",
          type: "jxlSimple",
          bcvRange: "MRK",
          content: {
            startOn: "recto",
            showPageNumber: true,
            jxl: "git.door43.org/burritotruck/en_juxta",
            bcvNotes: "git.door43.org/unfoldingWord/en_tn",
          },
        },
        {
          id: "markdown",
          type: "markdown",
          content: {
            startOn: "verso",
            showPageNumber: true,
            forceMono: false,
            md: "this is the path of md",
          },
        },
      ],
    },
  ],
};
const options = {
  verbose: false,
  workingDir: "/home/mark/.jxlpdf/working",
  steps: ["originate", "assemble"],
  pageFormat: pages[testThing.global.pages],
  fonts: fonts[testThing.global.fonts],
  fontSizes: sizes[testThing.global.sizes],
  referencePunctuation: testThing.global.referencePunctuation || {
    bookChapter: " ",
    chapterVerse: ":",
    verseRange: "-",
  },
  configContent: testThing,
  output: "/home/mark/Downloads/juxtas.pdf",
  cssLookUp: null,
};
export function TestPptrFirefox() {
  async function testPdfGen() {
    let cssLookUp = await setupCSS({
      pageFormat: options.pageFormat,
      fonts: options.fonts,
      fontSizes: options.fontSizes,
    });
    options.cssLookUp = cssLookUp;
    let manifest = await originatePdfs(options, null);
    console.log(manifest);
    await assemblePdfs(options, null, manifest);
  }
  return (
    <Box sx={{ p: 2 }}>
      <FirefoxInstaller />
      <Button onClick={() => testPdfGen()}>test generate pdf</Button>
    </Box>
  );
}
