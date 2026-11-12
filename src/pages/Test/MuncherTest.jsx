import { useEffect, useContext, useState } from "react";
import { getJson } from "pankosmia-lib/http";
import {
  currentProjectContext,
  bcvContext,
  debugContext,
  i18nContext,
  typographyContext,
  wordContext,
  snippetContext,
  productContext,
  Header,
  AdvancedAppBar,
} from "pankosmia-rcl";
import { Box, Button, Typography } from "@mui/material";
import WrapperNav from "../../components/textTranslationMuncher/wrapperMuncher/WrapperNav";
import TextTranslationNavigation from "../../components/textTranslationMuncher/muncher/Navigation/TextTranslationNavigation";
import TextTranslationEditorMuncher from "../../components/textTranslationMuncher/muncher/Editor/TextTranslationEditorMuncher";
import TextTranslationViewerMuncher from "../../components/textTranslationMuncher/muncher/Viewer/TextTranslationViewerMuncher";

export default function MuncherTest() {
  const { word } = useContext(wordContext);
  const { snippet } = useContext(snippetContext);
  const { bcvRef } = useContext(bcvContext);
  const { systemBcv } = useContext(bcvContext);
  const { debugRef } = useContext(debugContext);
  const { i18nRef } = useContext(i18nContext);
  const { typographyRef } = useContext(typographyContext);
  const { currentProjectRef } = useContext(currentProjectContext);
  const { product } = useContext(productContext);
  const [currentBurrito, setCurrentBurrito] = useState(null);
  const [flavor, setFlavor] = useState(null);
  const [currentBookCode, setCurrentBookCode] = useState("zzz");

  useEffect(() => {
    async function getSummary() {
      if (currentProjectRef.current) {
        const projectPath = `${currentProjectRef.current.source}/${currentProjectRef.current.organization}/${currentProjectRef.current.project}`;
        const fullMetadataResponse = await getJson(
          `/api/burrito/metadata/summary/${projectPath}`,
        );
        if (fullMetadataResponse.ok) {
          const entry = fullMetadataResponse.json;
          setCurrentBurrito([projectPath, entry]);
          setFlavor(entry.flavor);
        } else {
          enqueueSnackbar(
            `${doI18n("pages:core-translation_plan:error", i18nRef.current)}: ${fullMetadataResponse.status}`,
            { variant: "error" },
          );
        }
      }
    }

    getSummary();
  }, [currentProjectRef.current]);

  const metadata = currentBurrito && {
    local_path: currentBurrito[0],
    ...currentBurrito[1],
  };
  console.log(metadata);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <Box>
        <Header
          titleKey={
            "pages:core-contenthandler_text_translation:titleMuncherTest"
          }
          currentId="content"
          requireNet={false}
        />
        {/* <AdvancedAppBar
          navigation={
            metadata && (
              <TextTranslationNavigation
                metadata={metadata}
                systemBcv={systemBcv}
                currentBookCode={currentBookCode}
                setCurrentBookCode={setCurrentBookCode}
                debugRef={debugRef}
                i18nRef={i18nRef}
                currentProjectRef={currentProjectRef}
                bcvRef={bcvRef}
              />
            )
          }
        /> */}
      </Box>
      <Box sx={{ paddingLeft: 2, paddingTop: 10, flexShrink: 0 }}>
        <WrapperNav flavor={["textTranslation"]} />
      </Box>

      <Box sx={{ display: "flex", width: "100%", overflowY: "scroll" }}>
        {metadata && flavor === "textTranslation" && (
          <Box sx={{ flex: 1, margin: 2 }}>
            <TextTranslationViewerMuncher
              metadata={metadata}
              debugRef={debugRef}
              systemBcv={systemBcv}
              i18nRef={i18nRef}
              snippet={snippet}
              word={word}
            />
          </Box>
        )}

        {metadata && (
          <Box sx={{ flex: 1, margin: 2 }}>
            <TextTranslationEditorMuncher
              metadata={metadata}
              systemBcv={systemBcv}
              debugRef={debugRef}
              i18nRef={i18nRef}
              product={product}
              typographyRef={typographyRef}
              currentProjectRef={currentProjectRef}
              bcvRef={bcvRef}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}
