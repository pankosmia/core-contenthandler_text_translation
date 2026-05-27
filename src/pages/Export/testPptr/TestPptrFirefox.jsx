import { Button, Typography, Box } from "@mui/material";
import { originatePdfs } from "../pdfExport/pdf-gen/originatePdfs";
import { assemblePdfs } from "../pdfExport/pdf-gen/assemblePdf";
import FirefoxInstaller from "./FirefoxInstaller";
import pages from "../pdfExport/pdf-gen/Css/Ressources/pages.json";
import fonts from "../pdfExport/pdf-gen/Css/Ressources/fonts.json";
import sizes from "../pdfExport/pdf-gen/Css/Ressources/sizes.json";
import { setupCSS } from "../pdfExport/pdf-gen/doCss";
let configContentBibles = {
  global: {
    fonts: "gentiumOpen",
    pages: "A4P",
    sizes: "12on15",
    outputPath: "~/Downloads/test_one_bible.pdf",
    workingDir: "~/.jxlpdf/working",
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
        //         {
        //   "id": "4a663359-0726-4cb1-8b5a-ecf0f9978cac",
        //   "type": "biblePlusNotes",
        //   "content": {
        //     "notesPosition":"rows",
        //     "notesWidth":50,
        //     "notesUnit":"verse",
        //     "startOn": "recto",
        //     "showPageNumber": true,
        //     "notes": "git.door43.org/unfoldingWord/en_tn",
        //     "scriptureSrc": "git.door43.org/burritotruck/fr_psle",
        //     "scriptureType": "translation"
        //   }
        // }
        {
          id: "ba5c63b1-2377-42b8-b032-38ff9007b72f",
          type: "paraBible",
          content: {
            startOn: "recto",
            showPageNumber: true,
            scriptureSrc: "git.door43.org/burritotruck/fr_psle",
            scriptureType: "translation",
            showWordAtts: false,
            showTitles: true,
            showHeadings: true,
            showIntroductions: true,
            showFootnotes: true,
            showXrefs: true,
            showParaStyles: true,
            showCharacterMarkup: true,
            showChapterLabels: true,
            showVersesLabels: true,
            showFirstVerseLabel: true,
            nColumns: 2,
            showGlossaryStar: true,
            notes: "git.door43.org/unfoldingWord/en_tn",
          },
        },
      ],
    },
  ],
};

let configContentJxl = {
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
const optionsJxl = {
  verbose: false,
  workingDir: "/home/mark/.jxlpdf/working",
  steps: ["originate", "assemble"],
  pageFormat: pages[configContentJxl.global.pages],
  fonts: fonts[configContentJxl.global.fonts],
  fontSizes: sizes[configContentJxl.global.sizes],
  referencePunctuation: configContentJxl.global.referencePunctuation || {
    bookChapter: " ",
    chapterVerse: ":",
    verseRange: "-",
  },
  configContent: configContentJxl,
  output: "/home/mark/Downloads/juxtas.pdf",
  cssLookUp: null,
};

const optionsBibles = {
  verbose: false,
  workingDir: "/home/mark/.jxlpdf/working",
  steps: ["originate", "assemble"],
  pageFormat: pages[configContentBibles.global.pages],
  fonts: fonts[configContentBibles.global.fonts],
  fontSizes: sizes[configContentBibles.global.sizes],
  referencePunctuation: configContentBibles.global.referencePunctuation || {
    bookChapter: " ",
    chapterVerse: ":",
    verseRange: "-",
  },
  configContent: configContentBibles,
  output: "/home/mark/Downloads/juxtas.pdf",
  cssLookUp: null,
};

export function TestPptrFirefox() {
  async function testPdfGen(options) {
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
      <Button onClick={() => testPdfGen(optionsJxl)}>
        test generate pdf juxta + markdown
      </Button>
      <Button onClick={() => testPdfGen(optionsBibles)}>
        test generate bible
      </Button>
    </Box>
  );
}
