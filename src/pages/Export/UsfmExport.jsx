import { useContext, useState, useEffect, useRef } from "react";
import {
  Box,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
} from "@mui/material";
import { getText, getJson } from "pankosmia-lib/http";
import { doI18n } from "pankosmia-lib/i18n";
import {
  debugContext,
  i18nContext,
  Header,
  PanBasicDialog,
  PanDialogActionsArray,
} from "pankosmia-rcl";
import { enqueueSnackbar } from "notistack";
import { saveAs } from "file-saver";

function UsfmExport() {
  const { i18nRef } = useContext(i18nContext);
  const { debugRef } = useContext(debugContext);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [noBooksSelected, setNoBooksSelected] = useState(false);
  const [bookCodes, setBookCodes] = useState([]);
  const [bookNames, setBookNames] = useState([]);
  const [repoPath, setRepoPath] = useState([]);
  const [documentName, setDocumentName] = useState("");
  const [open, setOpen] = useState(true);
  const hash = window.location.hash;
  const query = hash.includes("?") ? hash.split("?") : "";
  const repoPathQuery = new URLSearchParams(query[1]);
  const path = repoPathQuery.get("repoPath");
  const typePageQuery = new URLSearchParams(query[2]);
  const returnTypePage = typePageQuery.get("returnTypePage");
  const confirmationRef = useRef(null);

  const getProjectSummaries = async () => {
    setRepoPath(path);
    const summariesResponse = await getJson(
      `/api/burrito/metadata/summary/${path}`,
      debugContext.current,
    );
    if (summariesResponse.ok) {
      const data = summariesResponse.json;
      const bookCode = data.book_codes;
      setBookNames(bookCode);
      setDocumentName(data.name);
    } else {
      console.error(" Erreur lors de la récupération des données.");
    }
  };
  useEffect(() => {
    getProjectSummaries();
  }, []);

  const usfmExportOneBook = async (bookCode) => {
    const bookUrl = `/api/burrito/ingredient/raw/${repoPath}?ipath=${bookCode}.usfm`;
    const bookUsfmResponse = await getText(bookUrl, debugRef.current);
    if (!bookUsfmResponse.ok) {
      enqueueSnackbar(
        `${doI18n("pages:core-contenthandler_text_translation:could_not_fetch", i18nRef.current)} ${bookCode}`,
        { variant: "error" },
      );
      return false;
    }
    console.log(bookUsfmResponse.text);
    let blob = new Blob([bookUsfmResponse.text], {
      type: "text/plain;charset=utf-8",
    });
    saveAs(blob, `${bookCode}.usfm`);
    enqueueSnackbar(
      `${doI18n("pages:content:saved", i18nRef.current)} ${bookCode} ${doI18n("pages:content:to_download_folder", i18nRef.current)}`,
      { variant: "success" },
    );
    return true;
  };

  const handleToggle = (item) => {
    setNoBooksSelected(false);
    setSelectedBooks((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );
  };
  const handleExport = async () => {
    if (selectedBooks.length === 0) {
      setNoBooksSelected(true);
      confirmationRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }
    setNoBooksSelected(false);
    for (const bookCode of selectedBooks) {
      await usfmExportOneBook(bookCode);
    }
  };
  const handleClose = async () => {
    setOpen(false);
    setSelectedBooks([]);
    if (returnTypePage === "dashboard") {
      await new Promise((resolve) =>
        setTimeout(() => {
          window.location.href = "/clients/main";
          resolve();
        }, 500),
      );
    } else {
      await new Promise((resolve) =>
        setTimeout(() => {
          window.location.href = "/clients/content";
          resolve();
        }, 500),
      );
    }
  };

  useEffect(() => {
    const doFetch = async () => {
      const versificationResponse = await getJson(
        "/api/content-utils/versification/eng",
        debugRef.current,
      );
      if (versificationResponse.ok) {
        setBookCodes(Object.keys(versificationResponse.json.maxVerses));
      }
    };
    if (bookCodes.length === 0) {
      doFetch().then();
    }
  }, []);

  return (
    <Box>
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: -1,
          backgroundImage:
            'url("/api/app-resources/pages/content/background_blur.png")',
          backgroundRepeat: "no-repeat",
          backdropFilter: "blur(3px)",
        }}
      />
      <Header
        titleKey="pages:content:title"
        currentId="content"
        requireNet={false}
      />

      <PanBasicDialog
        titleLabel={doI18n(
          "pages:core-contenthandler_text_translation:export_as_usfm",
          i18nRef.current,
        )}
        closeFn={() => handleClose()}
        isOpen={open}
        actionsButtonArray={PanDialogActionsArray({
          actionLabel: doI18n(
            "pages:core-contenthandler_text_translation:export_usfm_button",
            i18nRef.current,
          ),
          closeFn: () => handleClose(),
          closeLabel: doI18n(
            "pages:core-contenthandler_text_translation:cancel",
            i18nRef.current,
          ),
          closeOnAction: false,
          actionFn: handleExport,
        })}
        dividers={true}
      >
        <Typography
          ref={confirmationRef}
          color={noBooksSelected && "error"}
          variant="body1"
          sx={{ p: 0 }}
        >
          {noBooksSelected
            ? doI18n(
                "pages:core-contenthandler_text_translation:export_as_usfm_books",
                i18nRef.current,
              ).replace("{document_name}", documentName)
            : doI18n(
                "pages:core-contenthandler_text_translation:export_as_usfm_books",
                i18nRef.current,
              ).replace("{document_name}", documentName)}
        </Typography>
        <FormGroup>
          {bookCodes
            .filter((item) => bookNames.includes(item))
            .map((bookName) => (
              <FormControlLabel
                key={bookName}
                control={
                  <Checkbox
                    checked={selectedBooks.includes(bookName)}
                    onChange={() => handleToggle(bookName)}
                  />
                }
                label={doI18n(`scripture:books:${bookName}`, i18nRef.current)}
              />
            ))}
        </FormGroup>
      </PanBasicDialog>
    </Box>
  );
}

export default UsfmExport;
