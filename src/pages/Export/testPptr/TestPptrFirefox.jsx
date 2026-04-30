import { Button, Typography, Box } from "@mui/material";
import { MarkdownSection } from "../pdfExport/pdf-gen/markdownSection";
import { markdown_page } from "../pdfExport/pdf-gen/markdown_page";
import { markdown_mono_page } from "../pdfExport/pdf-gen/markdown_mono_page";
import { setupCSS } from "../pdfExport/pdf-gen/doCss";
import pagesJson from "../pdfExport/pdf-gen/Css/Ressources/pages.json";
import fontsJson from "../pdfExport/pdf-gen/Css/Ressources/fonts.json";
import sizesJson from "../pdfExport/pdf-gen/Css/Ressources/sizes.json";
let mdrSections = {
  id: "markdown",
  type: "markdown",
  content: {
    startOn: "verso",
    showPageNumber: true,
    forceMono: false,
    md: "this is the path of md",
  },
};
let templates = {
  markdown_page: markdown_page,
  markdown_mono_page: markdown_mono_page,
};
export function TestPptrFirefox() {
  let manifest = [];
  async function saveHtml() {
    let css = await setupCSS({
      pageFormat: pagesJson["A4P"],
      fonts: fontsJson["allGentium"],
      fontSizes: sizesJson["9on10"],
    });
    let mkdrS = new MarkdownSection();
    mkdrS.doSection({
      section: mdrSections,
      templates: templates,
      manifest: manifest,
      bookCode: "TIT",
      options: null,
      cssLookUp: css,
    });
  }
  return (
    <Box sx={{ p: 2 }}>
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
