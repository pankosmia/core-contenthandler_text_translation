import { Button, Typography, Box } from "@mui/material";
import { originatePdfs } from "../pdfExport/pdf-gen/originatePdfs";
import { assemblePdfs } from "../pdfExport/pdf-gen/assemblePdf";
import FirefoxInstaller from "./FirefoxInstaller";

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
      ranges: ["TIT"],
      sections: [
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
        {
          id: "juxtaSimple",
          type: "jxlSimple",
          bcvRange: "TIT",
          content: {
            startOn: "recto",
            showPageNumber: true,
            jxl: "git.door43.org/BurritoTruck/en_juxta",
            bcvNotes: "git.door43.org/unfoldingWord/en_tn",
          },
        },
      ],
    },
  ],
};

export function TestPptrFirefox() {
  async function saveHtml() {
    let manifest = await originatePdfs(testThing);
    console.log(manifest);
    await assemblePdfs(testThing, null, manifest);
  }
  return (
    <Box sx={{ p: 2 }}>
      <FirefoxInstaller />
      <Button
        variant="contained"
        onClick={async () => {
          const filePath = await window.api.generatePdf();
          console.log("PDF created at:", filePath);
        }}
      >
        pdfGen
      </Button>

      <Typography variant="h6" sx={{ mt: 2 }}>
        Regular
      </Typography>

      <Typography dir="rtl">
        اقوام متحدہ نے ہر ک
        <Typography component="span" color="error">
          ہ
        </Typography>
        یں دے حقوق دی حفاظت تے ود
        <Typography component="span" color="error">
          ھ
        </Typography>
        ارے دا جھنڈا اچار ک
        <Typography component="span" color="error">
          ک
        </Typography>
        ھ
        <Typography component="span" color="error">
          ں
        </Typography>
        دا ارادہ کیتا ہوئے اے
        <Typography component="span" color="error">
          ہ
        </Typography>
        ؤے و حشیانہ کماں دی صورت وچ ظاہر تھی
        <Typography component="span" color="error">
          ئ
        </Typography>
        ی ہں
      </Typography>

      <Button onClick={() => saveHtml()}>test save html file</Button>
    </Box>
  );
}
