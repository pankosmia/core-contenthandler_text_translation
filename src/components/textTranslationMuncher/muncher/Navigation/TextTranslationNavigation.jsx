import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { getText } from "pankosmia-lib/http";
import BookPickerNavigation from "../Helpers/Navigation/BookPickerNavigation";
import ChapterPickerNavigation from "../Helpers/Navigation/ChapterPickerNavigation";
import { getFirstChapterTextTranslation } from "../Helpers/FindFirst/findFirstChapter";
import { getFirstverseTextTranslation } from "../Helpers/FindFirst/findFirstVerse";
import usfm2draftJson from "../Helpers/usfmToDraft/usfm2draftJson";

export default function TextTranslationNavigation({
  metadata,
  systemBcv,
  currentBookCode,
  setCurrentBookCode,
  debugRef,
  i18nRef,
  currentProjectRef,
  bcvRef,
}) {
  const [chapterNumbers, setChapterNumbers] = useState([]);

  useEffect(() => {
    if (systemBcv.bookCode !== currentBookCode) {
      const loadChapterNumbers = async () => {
        const usfmResponse = await getText(
          `/api/burrito/ingredient/raw/${metadata.local_path}?ipath=${systemBcv.bookCode}.usfm`,
          debugRef.current,
        );
        if (!usfmResponse.ok) return;

        const usfmDraftJson = await usfm2draftJson(usfmResponse.text);
        const newChapterNumbers = usfmDraftJson.blocks
          .filter((block) => block.type === "chapter")
          .map((block) => block.chapter);
        setCurrentBookCode(systemBcv.bookCode);
        setChapterNumbers(newChapterNumbers);
      };

      loadChapterNumbers().then();
    }
  }, [
    systemBcv.bookCode,
    metadata,
    currentBookCode,
    setCurrentBookCode,
    debugRef,
  ]);

  return (
    <Grid sx={{ display: "flex", backgroundColor: "white" }} gap={1}>
      <BookPickerNavigation
        setFirstChapter={getFirstChapterTextTranslation}
        bcvRef={bcvRef}
        debugRef={debugRef}
        i18nRef={i18nRef}
        currentProjectRef={currentProjectRef}
      />
      <ChapterPickerNavigation
        chapterNumbers={chapterNumbers}
        repoMetadata={metadata}
        findFirstVerse={getFirstverseTextTranslation}
        systemBcv={systemBcv}
        bcvRef={bcvRef}
        debugRef={debugRef}
        currentProjectRef={currentProjectRef}
      />
    </Grid>
  );
}
