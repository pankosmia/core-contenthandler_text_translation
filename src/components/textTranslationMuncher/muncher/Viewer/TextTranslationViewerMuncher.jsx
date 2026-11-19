import { useEffect, useState } from "react";
import usfm2draftJson from "../Helpers/usfmToDraft/usfm2draftJson";
import usfm2viewerJson from "../Helpers/usfmToDraft/usfm2viewerJson";
import filterByChapter from "../Helpers/usfmToDraft/filterByChapter";
import ViewableBible from "../Helpers/components/ViewableBible";

import { getText } from "pankosmia-lib/http";
import "./TextTranslationViewerMuncher.css";
import TextDir from "../Helpers/TextDir";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { doI18n } from "pankosmia-lib/i18n";

function TextTranslationViewerMuncher({
  metadata,
  debugRef,
  systemBcv,
  word,
  snippet,
  i18nRef,
}) {
  const [bookData, setBookData] = useState(null);
  const [viewerData, setViewerData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bookLoadError, setBookLoadError] = useState(null);
  const [textDir, setTextDir] = useState(
    metadata?.script_direction
      ? metadata.script_direction.toLowerCase()
      : undefined,
  );

  const sbScriptDir = metadata?.script_direction
    ? metadata.script_direction.toLowerCase()
    : undefined;
  const sbScriptDirSet = sbScriptDir === "ltr" || sbScriptDir === "rtl";

  useEffect(() => {
    const getUsfm = async () => {
      setIsLoading(true);
      setViewerData(null);
      setBookLoadError(null);
      let usfmResponse = await getText(
        `/api/burrito/ingredient/raw/${metadata.local_path}?ipath=${systemBcv.bookCode}.usfm`,
        debugRef.current,
      );
      if (usfmResponse.ok) {
        setBookData(await usfm2draftJson(usfmResponse.text));
        setViewerData(await usfm2viewerJson(usfmResponse.text));
        if (!sbScriptDirSet) {
          const dir = await TextDir(usfmResponse.text, "usfm");
          setTextDir(dir);
        }
      } else {
        setBookLoadError(usfmResponse.status);
        console.error("usfmResponse failed");
      }
      setIsLoading(false);
    };
    getUsfm();
  }, [debugRef, systemBcv.bookCode, metadata.local_path, sbScriptDirSet]);

  const chapterData = viewerData
    ? filterByChapter(viewerData, systemBcv.chapterNum)
    : { blocks: [] };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          minHeight: "150px",
          flexShrink: 0,
        }}
      >
        <CircularProgress size={40} />
      </Box>
    );
  }
  if (bookLoadError !== null) {
    return (
      <Typography>
        {doI18n(
          "pages:core-contenthandler_text_translation:book_not_found",
          i18nRef.current,
        )}
      </Typography>
    );
  }
  if (chapterData.blocks.length === 0) {
    return (
      <Typography>
        {doI18n(
          "pages:core-contenthandler_text_translation:book_not_found_verse",
          i18nRef.current,
        )}
      </Typography>
    );
  }

  // If SB does not specify direction then it is set here, otherwise it has already been set per SB in WorkspaceCard
  return (
    <ViewableBible
      chapterJson={chapterData}
      dir={!sbScriptDirSet ? textDir : undefined}
      systemBcv={systemBcv}
      word={word}
      snippet={snippet}
    />
  );
}
export default TextTranslationViewerMuncher;
