import "./TextTranslationEditorMuncher.css";
import { Box } from "@mui/material";
import { useState, useEffect } from "react";
import { DraftingEditor } from "../Helpers/DraftingEditor";
function TextTranslationEditorMuncher({ metadata }) {
  const [modified, setModified] = useState(false);

  return (
    <Box sx={{ p: 2 }}>
      <DraftingEditor
        metadata={metadata}
        modified={modified}
        setModified={setModified}
      />
    </Box>
  );
}

export default TextTranslationEditorMuncher;
