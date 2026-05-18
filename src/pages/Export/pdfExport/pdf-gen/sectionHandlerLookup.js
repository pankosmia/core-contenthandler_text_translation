import {
  fourColumnSpreadSection,
  bookNoteSection,
  jxlSimpleSection,
  bcvBibleSection,
  biblePlusNotesSection,
  markdownSection,
} from "./Section";

export const sectionHandlerLookup = {
  markdown: new markdownSection(),
  jxlSimple: new jxlSimpleSection(),
  fourColumnSpread: new fourColumnSpreadSection(),
  bcvBible: new bcvBibleSection(),
  bookNote: new bookNoteSection(),
  biblePlusNotes: new biblePlusNotesSection(),
};
