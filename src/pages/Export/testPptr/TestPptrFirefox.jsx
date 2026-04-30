import { Button, Typography, Box } from "@mui/material";
import { MarkdownSection } from "../pdfExport/pdf-gen/Section/markdownSection";
import { jxlSimpleSection } from "../pdfExport/pdf-gen/Section/jxlSimpleSection";
import { markdown_page } from "../pdfExport/pdf-gen/HTML/markdown_page";
import { markdown_mono_page } from "../pdfExport/pdf-gen/HTML/markdown_mono_page";
import { simple_juxta_sentence } from "../pdfExport/pdf-gen/HTML/simple_juxta_sentence";
import { jxl } from "../pdfExport/pdf-gen/HTML/jxl";
import { jxlRow } from "../pdfExport/pdf-gen/HTML/jxlRow";
import { jxlRow3Col } from "../pdfExport/pdf-gen/HTML/jxlRow3Col";
import { setupCSS } from "../pdfExport/pdf-gen/Css/doCss";
import pagesJson from "../pdfExport/pdf-gen/Css/Ressources/pages.json";
import fontsJson from "../pdfExport/pdf-gen/Css/Ressources/fonts.json";
import sizesJson from "../pdfExport/pdf-gen/Css/Ressources/sizes.json";
import { getJson, getText } from "pithekos-lib";
import { simple_juxta_page } from "../pdfExport/pdf-gen/HTML/simple_juxta_page";
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
let jxlSections = {
  id: "juxtaSimple",
  type: "jxlSimple",
  bcvRange: "TIT",
  content: {
    startOn: "recto",
    showPageNumber: true,
    jxl: "git.door43.org/BurritoTruck/fr_juxta",
    bcvNotes: "git.door43.org/shower/eng_tn",
  },
};
let templates = {
  markdown_page: markdown_page,
  markdown_mono_page: markdown_mono_page,
  jxl: jxl,
  jxlRow: jxlRow,
  jxlRow3Col: jxlRow3Col,
  simple_juxta_sentence: simple_juxta_sentence,
  simple_juxta_page: simple_juxta_page,
};
export function TestPptrFirefox() {
  let manifest = [];

  async function saveHtml() {
    let css = await setupCSS({
      pageFormat: pagesJson["A4P"],
      fonts: fontsJson["allGentium"],
      fontSizes: sizesJson["9on10"],
    });
    // let mkdrS = new MarkdownSection();
    // mkdrS.doSection({
    //   section: mdrSections,
    //   templates: templates,
    //   manifest: manifest,
    //   bookCode: "TIT",
    //   options: null,
    //   cssLookUp: css,
    // });
    let jxlS = new jxlSimpleSection();
    jxlS.doSection({
      section: jxlSections,
      templates: templates,
      manifest: manifest,
      bookCode: "TIT",
      options: {},
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
