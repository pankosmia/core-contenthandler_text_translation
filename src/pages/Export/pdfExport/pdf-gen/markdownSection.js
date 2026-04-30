import DOMPurify from "isomorphic-dompurify";
import { marked } from "marked";
import { Section } from "./section";
export class MarkdownSection extends Section {
  requiresWrapper() {
    return [];
  }

  signature() {
    return {
      sectionType: "markdown",
      requiresWrapper: this.requiresWrapper(),
      fields: [
        {
          id: "startOn",
          label: {
            en: "Start Page Side",
            fr: "Côté pour première page",
          },
          typeEnum: [
            {
              id: "recto",
              label: {
                en: "Recto",
                fr: "Recto",
              },
            },
            {
              id: "verso",
              label: {
                en: "Verso",
                fr: "Verso",
              },
            },
            {
              id: "either",
              label: {
                en: "Next Page",
                fr: "Page suivante",
              },
            },
          ],
          nValues: [1, 1],
          suggestedDefault: "recto",
        },
        {
          id: "showPageNumber",
          label: {
            en: "Show Page Number",
            fr: "Afficher numéro de page",
          },
          typeName: "boolean",
          nValues: [1, 1],
          suggestedDefault: true,
        },
        {
          id: "forceMono",
          label: {
            en: "Use monospace font",
            fr: "Utiliser police monospace",
          },
          typeName: "boolean",
          nValues: [0, 1],
          suggestedDefault: false,
        },
        {
          id: "md",
          label: {
            en: "Markdown Source",
            fr: "Source pour markdown",
          },
          typeName: "md",
          nValues: [1, 1],
        },
      ],
    };
  }

  async doSection({
    section,
    templates,
    bookCode,
    manifest,
    options,
    cssLookUp,
  }) {
    const mkdContent = `
# h1 Heading 
## h2 Heading
### h3 Heading
#### h4 Heading
##### h5 Heading
###### h6 Heading
## Horizontal Rules`;
    const server = window.location.origin;
    let srcPolyfill = `${server}/app-resources/pdf/paged.polyfill.js`;
    let htmlContent = templates[
      section.content.forceMono ? "markdown_mono_page" : "markdown_page"
    ]
      .replace(
        "%%TITLE%%",
        `${section.id.replace("%%bookCode%%", bookCode)} - ${section.type}`,
      )
      .replace("%%BODY%%", DOMPurify.sanitize(await marked.parse(mkdContent)))
      .replace(
        "%%CSS%%",
        await (
          await fetch(
            `http://127.0.0.1:19119/temp/bytes/${cssLookUp[section.content.forceMono ? "markdown_mono_page_styles" : "markdown_page_styles"]}`,
            {
              method: "GET",
            },
          )
        ).text(),
      )
      .replace("%%POLYFY%%", srcPolyfill);

    const blob = new Blob([htmlContent], { type: "text/html" });

    // 2. Create FormData
    const formData = new FormData();

    // IMPORTANT: field name must match backend (likely "file")
    formData.append("file", blob, "test.html");
    try {
      const response = await fetch("http://127.0.0.1:19119/temp/bytes", {
        method: "POST",
        body: formData,
      });

      const result = await response.text();
      const { uuid } = JSON.parse(result);
      const pdfPath = await window.api.generatePdf(uuid);
    } catch (err) {
      console.error("Upload failed:", err);
    }

    // section.doPdfCallback && section.doPdfCallback({
    //     type: "pdf",
    //     level: 3,
    //     msg: `Originating PDF ${path.join(options.pdfPath, `${section.id.replace('%%bookCode%%', bookCode)}.pdf`)} for Markdown'`,
    //     args: [path.join(options.pdfPath, `${section.id.replace('%%bookCode%%', bookCode)}.pdf`)]
    // });
    // await doPuppet({
    //     browser: options.browser,
    //     verbose: options.verbose,
    //     htmlPath: path.join(options.htmlPath, `${section.id.replace('%%bookCode%%', bookCode)}.html`),
    //     pdfPath: path.join(options.pdfPath, `${section.id.replace('%%bookCode%%', bookCode)}.pdf`)
    // });
    manifest.push({
      id: `${section.id}`,
      type: section.type,
      startOn: section.content.startOn,
      showPageNumber: section.content.showPageNumber,
      makeFromDouble: false,
    });
  }
}

module.exports = MarkdownSection;
