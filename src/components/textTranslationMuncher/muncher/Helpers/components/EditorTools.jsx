import {
  Alert,
  AlertTitle,
  Box,
  Dialog,
  Grid,
  IconButton,
  Tooltip,
} from "@mui/material";
import SaveButton from "./SaveButton";
import PreviewText from "./PreviewText";
import md5sum from "md5";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LayoutIcon from "../layouts/LayoutIcon";
import { doI18n } from "pankosmia-lib/i18n";
import { PrintOutlined } from "@mui/icons-material";
import TextTranslationNavigation from "../../Navigation/TextTranslationNavigation";
function EditorTools({
  metadata,
  modified,
  setModified,
  md5sumScriptureJson,
  setMd5sumScriptureJson,
  scriptureJson,
  currentBookCode,
  setCurrentBookCode,
  systemBcv,
  typographyRef,
  debugRef,
  i18nRef,
  product,
  currentProjectRef,
  bcvRef,
  showPrintAlert,
  setShowPrintAlert,
}) {
  const [openModalPreviewText, setOpenModalPreviewText] = useState(false);
  const navigate = useNavigate();

  const handlePrintClick = () => {
    if (md5sum(JSON.stringify(scriptureJson)) === md5sumScriptureJson) {
      setShowPrintAlert(false);
      setOpenModalPreviewText(true);
    } else {
      setShowPrintAlert(true);
    }
  };
  return (
    <Box
      sx={{
        position: "fixed",
        top: product && product.os === "android" ? "70px" : "40px",
        left: product && product.os === "android" ? "30px" : "0px",
        right: product && product.os === "android" ? "30px" : "0px",
        display: "flex",
        padding: 2,
      }}
    >
      <Grid
        container
        sx={{
          alignItems: "center",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <Grid sx={{ display: "flex" }} gap={1}>
          <SaveButton
            metadata={metadata}
            systemBcv={systemBcv}
            modified={modified}
            setModified={setModified}
            md5sumScriptureJson={md5sumScriptureJson}
            setMd5sumScriptureJson={setMd5sumScriptureJson}
            scriptureJson={scriptureJson}
            i18nRef={i18nRef}
          />
          {product && product.os !== "android" && (
            <>
              <Tooltip
                title={doI18n(
                  "pages:core-contenthandler_text_translation:button_preview_text",
                  i18nRef.current,
                  debugRef.current,
                )}
              >
                <IconButton onClick={handlePrintClick}>
                  <PrintOutlined />
                </IconButton>
              </Tooltip>
              <PreviewText
                metadata={metadata}
                systemBcv={systemBcv}
                open={openModalPreviewText}
                setOpenModalPreviewText={setOpenModalPreviewText}
                i18nRef={i18nRef}
                debugRef={debugRef}
                typographyRef={typographyRef}
              />
            </>
          )}
        </Grid>

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
        <Grid sx={{ display: "flex" }} gap={1}>
          <Tooltip
            title={doI18n(
              "pages:core-local-workspace:button_edit_layout",
              i18nRef.current,
              debugRef.current,
            )}
          >
            <IconButton
              disabled={
                md5sum(JSON.stringify(scriptureJson)) !== md5sumScriptureJson
              }
              /* enables redirection based on the page */
              onClick={() =>
                navigate({
                  pathname: "/",
                  search: "return-page=workspace",
                })
              }
            >
              <LayoutIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    </Box>
  );
}

export default EditorTools;
