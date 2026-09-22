import "./TextTranslationEditorMuncher.css";
import { Box } from "@mui/material";
import { useState, useEffect } from "react";
import DraftingEditor from "../Helpers/DraftingEditor";
function TextTranslationEditorMuncher({
  metadata,
  systemBcv,
  debugRef,
  i18nRef,
  product,
  typographyRef,
  currentProjectRef,
  bcvRef,
}) {
  const [modified, setModified] = useState(false);

  return (
    <Box sx={{ p: 2 }}>
      <DraftingEditor
        metadata={metadata}
        modified={modified}
        setModified={setModified}
        systemBcv={systemBcv}
        debugRef={debugRef}
        i18nRef={i18nRef}
        product={product}
        typographyRef={typographyRef}
        currentProjectRef={currentProjectRef}
        bcvRef={bcvRef}
      />
    </Box>
  );
}

export default TextTranslationEditorMuncher;
