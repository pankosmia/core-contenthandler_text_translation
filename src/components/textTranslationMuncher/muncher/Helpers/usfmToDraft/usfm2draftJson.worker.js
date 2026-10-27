import { parseUsfm2draftJson } from "pankosmia-usfm-editor-utils/parse";

self.onmessage = (e) => {
  try {
    const result = parseUsfm2draftJson(e.data.usfm);

    self.postMessage({
      ok: true,
      result,
    });
  } catch (err) {
    self.postMessage({
      ok: false,
      error: {
        name: err?.name,
        message: err?.message,
        stack: err?.stack,
      },
    });
  }
};
