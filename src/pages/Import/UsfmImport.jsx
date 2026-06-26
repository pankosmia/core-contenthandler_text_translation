import { useContext, useState, useEffect } from "react";
import { Button, DialogContent, Box, Typography, Stack } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { getJson, postJson } from "pankosmia-lib/http";
import { doI18n } from "pankosmia-lib/i18n";
import { i18nContext, debugContext, Header } from "pankosmia-rcl";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Proskomma } from "proskomma-core";
import { PanDialog, PanDialogActions } from "pankosmia-rcl";
import { useFilePicker } from "use-file-picker";

function UsfmImport() {
  const { i18nRef } = useContext(i18nContext);
  const { debugRef } = useContext(debugContext);
  const [loading, setLoading] = useState(false);
  const [usfmImportAnchorEl, setUsfmImportAnchorEl] = useState(true);
  const usfmImportOpen = Boolean(usfmImportAnchorEl);
  const [filePicked, setFilePicked] = useState({});
  const [localBookContent, setLocalBookContent] = useState();
  const [repoBooks, setRepoBooks] = useState([]);
  const [repoPath, setRepoPath] = useState([]);
  const [isUsfmValid, setIsUsfmValid] = useState(false);
  const [validationResult, setValidationResult] = useState({});
  const [bookIsDuplicate, setBookIsDuplicate] = useState(false);
  const [nameProject, setNameProject] = useState("");
  const hash = window.location.hash;
  const query = hash.includes("?") ? hash.split("?") : "";
  const repoPathQuery = new URLSearchParams(query[1]);
  const typePageQuery = new URLSearchParams(query[2]);
  const path = repoPathQuery.get("repoPath");
  const returnType = typePageQuery.get("returnTypePage");
  const pk = new Proskomma();

  const { openFilePicker: openUsfmPicker, filesContent: usfmFiles } =
    useFilePicker({
      accept: [".sfm", ".usfm"],
    });
  useEffect(() => {
    if (usfmFiles.length > 0) {
      const file = usfmFiles[0];
      setFilePicked(file.name);
      handleFilePicked(file);
    }
  }, [usfmFiles]);
  const initialQuery = `{
        documents {
          id
          headers {key value}
          cvIndexes {
            chapter
          }
        }
      }`;
  const bookCode =
    Object.keys(validationResult).length > 0
      ? validationResult.data.documents[0].headers?.find(
          (header) => header.key === "bookCode",
        )
      : {};
  const title =
    Object.keys(validationResult).length > 0
      ? validationResult.data.documents[0].headers?.find(
          (header) => header.key === "h",
        )
      : {};
  const cvIndexes =
    Object.keys(validationResult).length > 0
      ? validationResult.data.documents[0].cvIndexes
      : [];

  const getProjectSummaries = async () => {
    setRepoPath(path);
    const summariesResponse = await getJson(
      `/api/burrito/metadata/summary/${path}`,
      debugContext.current,
    );
    if (summariesResponse.ok) {
      const data = summariesResponse.json;
      const bookCode = data.book_codes;
      setNameProject(data.name);
      setRepoBooks(bookCode);
    } else {
      console.error(
        `${doI18n("pages:core-contenthandler_text_translation:error_data", i18nRef.current)}`,
      );
    }
  };

  const handleFilePicked = (fileFromPicker) => {
    const blob = new Blob([fileFromPicker.content], {
      type: "application/octet-stream",
    });
    setValidationResult({});
    const reader = new FileReader();
    reader.onloadstart = () => {
      setLoading(true);
    };
    reader.onload = (event) => {
      const fileContent = event.target.result;
      setLocalBookContent(fileContent);
      setLoading(false);
    };
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      setLoading(false);
    };
    reader.readAsText(blob);
  };

  const handleClose = () => {
    if (returnType === "dashboard") {
      window.location.href = "/clients/main";
    } else {
      window.location.href = "/clients/content";
    }
  };

  const handleCloseCreate = async () => {
    setUsfmImportAnchorEl(false);
    setTimeout(() => {
      window.location.href = "/clients/content";
    }, 500);
  };

  const handleCreateLocalBook = async (localBookContent, repoPath) => {
    const localBookCodeLine = localBookContent
      .split("\n")
      .filter((l) => l.startsWith("\\id"))[0];
    if (!localBookCodeLine) {
      enqueueSnackbar(
        doI18n(
          "pages:core-contenthandler_text_translation:no_usfm_id_found",
          i18nRef.current,
        ),
        { variant: "error" },
      );
      return;
    }
    const localBookCode = localBookCodeLine.split(" ")[1];
    if (!localBookCode || localBookCode.length !== 3) {
      enqueueSnackbar(
        doI18n(
          "pages:core-contenthandler_text_translation:bad_usfm_id_line",
          i18nRef.current,
        ),
        { variant: "error" },
      );
      return;
    }
    if (!repoBooks.includes(localBookCode)) {
      const response = await postJson(
        `/api/burrito/ingredient/raw/${repoPath}?ipath=${`${localBookCode}.usfm`}&update_ingredients`,
        JSON.stringify({ payload: localBookContent }),
        debugRef.current,
      );
      if (response.ok) {
        enqueueSnackbar(
          doI18n(
            "pages:core-contenthandler_text_translation:book_created",
            i18nRef.current,
          ),
          {
            variant: "success",
          },
        );
        handleCloseCreate();
      } else {
        enqueueSnackbar(
          `${doI18n("pages:core-contenthandler_text_translation:book_creation_error", i18nRef.current)}: ${response.status}`,
          { variant: "error" },
        );
      }
    }
  };

  useEffect(() => {
    getProjectSummaries();
  }, []);

  useEffect(() => {
    if (repoBooks.length > 0 && localBookContent && bookCode) {
      setBookIsDuplicate(repoBooks.includes(bookCode.value));
    }
  }, [repoBooks, localBookContent, bookCode]);

  const usfmValidation = (file) => {
    const regexForBookAbbr = /^\\id [A-Z0-9]{3}.*$/m;
    setIsUsfmValid(
      regexForBookAbbr.test(file) &&
        file.includes("\\mt") &&
        file.includes("\\c") &&
        file.includes("\\v"),
    );
  };

  useEffect(() => {
    if (localBookContent) {
      usfmValidation(localBookContent);
    }
  }, [localBookContent]);

  useEffect(() => {
    if (isUsfmValid && filePicked && localBookContent) {
      try {
        pk.importDocument(
          {
            lang: "eng",
            abbr: `${localBookContent.split("toc1")[0].split(" ")[1]}`,
          },
          `${filePicked.split(".")[1]}`,
          localBookContent,
        );
        try {
          const res = pk.gqlQuerySync(initialQuery);

          setValidationResult(res);
        } catch (error) {
          console.error(
            "An error occurred while a query on the instance:",
            error.message,
          );
        }
      } catch (error) {
        console.error(
          "An error occurred while validating the USFM:",
          error.message,
        );
      }
    }
  }, [localBookContent, isUsfmValid, filePicked]);

  return (
    <>
      <Button
        onClick={() => openUsfmPicker()}
        type="button"
        disabled={loading}
        variant="contained"
        color="primary"
        component="span"
        startIcon={<UploadFileIcon />}
      >
        {loading
          ? "Reading File..."
          : filePicked.name
            ? filePicked.name
            : doI18n(
                "pages:core-contenthandler_text_translation:import_click",
                i18nRef.current,
              )}
      </Button>
      {localBookContent && (bookIsDuplicate || !isUsfmValid) && (
        <Typography sx={{ color: "red", paddingTop: "8px" }}>
          {!isUsfmValid
            ? doI18n(
                "pages:core-contenthandler_text_translation:usfm_invalid",
                i18nRef.current,
              )
            : doI18n(
                "pages:core-contenthandler_text_translation:book_already_exists",
                i18nRef.current,
              )}
        </Typography>
      )}
      {Object.keys(validationResult).length > 0 && !bookIsDuplicate && (
        <Stack spacing={2} sx={{ mt: 0.5 }}>
          <Typography variant="body1">
            {`Book Code: ${JSON.stringify(bookCode?.value, null, 2)}`}
          </Typography>
          <Typography variant="body1">
            {`Title: ${JSON.stringify(title?.value, null, 2)}`}
          </Typography>
          <Typography variant="body1">
            {`Chapters from ${JSON.stringify(cvIndexes[0]?.chapter, null, 2)} to ${JSON.stringify(cvIndexes[cvIndexes.length - 1]?.chapter, null, 2)}`}
          </Typography>
        </Stack>
      )}
    </>
  );
}
export default UsfmImport;
