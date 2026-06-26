import { useState, useContext, useEffect } from "react";
import {
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Box,
  DialogContent,
  IconButton,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { postJson, getJson } from "pankosmia-lib/http";
import { doI18n } from "pankosmia-lib/i18n";
import sx from "./Selection.styles";
import ListMenuItem from "./ListMenuItem";
import {
  PanDialog,
  PanDialogActions,
  i18nContext,
  debugContext,
  Header,
} from "pankosmia-rcl";
import ErrorDialog from "../TextTranslationContent/ErrorDialog";
import DeleteIcon from "@mui/icons-material/Delete";

export default function DeleteTextTranslationBook({
  bookCodes,
  setBookCodes,
  bookCode,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const { i18nRef } = useContext(i18nContext);
  const { debugRef } = useContext(debugContext);
  const [open, setOpen] = useState(true);
  const [repoPath, setRepoPath] = useState([]);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [nameProject, setNameProject] = useState("");
  const hash = window.location.hash;
  const query = hash.includes("?") ? hash.split("?") : "";
  const repoPathQuery = new URLSearchParams(query[1]);
  const path = repoPathQuery.get("repoPath");
  const typePageQuery = new URLSearchParams(query[2]);
  const returnType = typePageQuery.get("returnTypePage");

  const handleCloseCreate = async () => {
    await postJson(`/api/burrito/metadata/remake-ingredients/${repoPath}`);
    setOpen(false);
    setTimeout(() => {
      window.location.href = "/clients/content";
    }, 500);
  };

  const handleDelete = async () => {
    const deleteResponse = await postJson(
      `/api/burrito/ingredient/delete/${repoPath}?ipath=${bookCode}.usfm`,
      debugRef.current,
    );
    if (deleteResponse.ok) {
      enqueueSnackbar(
        `${doI18n("pages:core-contenthandler_text_translation:book_deleted", i18nRef.current)}`,
        {
          variant: "success",
        },
      );
      handleCloseCreate();
    } else {
      setErrorMessage(
        `${doI18n("pages:core-contenthandler_text_translation:book_delete_error", i18nRef.current)}: ${
          deleteResponse.status
        }`,
      );
      setErrorDialogOpen(true);
    }
  };

  return (
    <Box>
      <IconButton onClick={handleDelete} edge="end" aria-label="delete">
        <DeleteIcon />
      </IconButton>
      {/* Error Dialog */}
      <ErrorDialog
        setErrorDialogOpen={setErrorDialogOpen}
        errorDialogOpen={errorDialogOpen}
        errorMessage={errorMessage}
      />
    </Box>
  );
}
