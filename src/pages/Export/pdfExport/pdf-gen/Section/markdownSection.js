import DOMPurify from "isomorphic-dompurify";
import { marked } from "marked";
import { Section } from "./section";
import { getCssFromLookUp, toTemp } from "../helpers/PankosmiaUtils";
export class markdownSection extends Section {
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

  async doSection({ section, templates, bookCode, manifest, options }) {
    let pdfPath;
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
        await getCssFromLookUp(
          options.cssLookUp,
          section.content.forceMono
            ? "markdown_mono_page_styles"
            : "markdown_page_styles",
        ),
      )
      .replace("%%POLYFY%%", srcPolyfill);

    let uuid = await toTemp(htmlContent);
    pdfPath = await window.api.generatePdf(uuid);
    manifest.push({
      id: pdfPath,
      type: section.type,
      startOn: section.content.startOn,
      showPageNumber: section.content.showPageNumber,
      makeFromDouble: false,
    });
  }
}
