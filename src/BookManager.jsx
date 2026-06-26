import {
  Box,
  Button,
  DialogContent,
  Grid2,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import { getJson } from "pankosmia-lib/http";
import { doI18n } from "pankosmia-lib/i18n";
import {
  PanDialog,
  PanDialogActions,
  i18nContext,
  Header,
  debugContext,
} from "pankosmia-rcl";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useContext, useEffect, useState } from "react";
import NewBook from "./pages/NewBook";
import UsfmImport from "./pages/Import/UsfmImport";
import DeleteTextTranslationBook from "./pages/DeleteTextTranslationBook";
import { useLocation } from "react-router-dom";

export default function ManageBook() {
  const { i18nRef } = useContext(i18nContext);
  const { state } = useLocation();
  const [bookCodes, setBookCodes] = useState(state?.bookCodes || []);
  const [listBookCodes, setListBookCodes] = useState(
    state?.listBookCodes || [],
  );
  console.log("listbookcodes", listBookCodes);
  const [open, setOpen] = useState(true);
  const hash = window.location.hash;
  const query = hash.includes("?") ? hash.split("?") : "";
  const repoPathQuery = new URLSearchParams(query[1]);
  const typePageQuery = new URLSearchParams(query[2]);
  const returnType = typePageQuery.get("returnTypePage");
  const path = repoPathQuery.get("repoPath");
  const [repoData, setRepodata] = useState({});
  const [repoInfo, setRepoInfo] = useState();
  const { debugRef } = useContext(debugContext);
  const [bookCode, setBookCode] = useState("");
  const [repoPath, setRepoPath] = useState([]);
  //const [bookCodes, setBookCodes] = useState(["TIT", "MRK"]);
  const [showVersification, setShowVersification] = useState(true);
  const [bookTitle, setBookTitle] = useState("");
  const [bookAbbr, setBookAbbr] = useState("");
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [nameProject, setNameProject] = useState("");
  const [openPanel, setOpenPanel] = useState(null);
  const toggle = (panel) =>
    setOpenPanel((prev) => (prev === panel ? null : panel));

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
      setBookCodes(bookCode);
    } else {
      console.error(
        `${doI18n("pages:core-contenthandler_text_translation:error_data", i18nRef.current)}`,
      );
    }
  };

  useEffect(() => {
    getProjectSummaries();
  }, []);

  useEffect(() => {
    const doFetch = async () => {
      setBookCode("");
    };
    if (open) {
      doFetch().then();
    }
  }, [open]);
  const handleClose = () => {
    setOpen(false);
    if (returnType === "dashboard") {
      setTimeout(() => {
        window.location.href = "/clients/main";
      });
    } else {
      setTimeout(() => {
        window.location.href = "/clients/content";
      });
    }
  };

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
        titleKey={
          returnType === "dashboard"
            ? "pages:core-dashboard:title"
            : "pages:content:title"
        }
        currentId="content"
        requireNet={false}
      />
      <PanDialog
        titleLabel={`${doI18n("pages:core-contenthandler-generic:manage_book", i18nRef.current)}`}
        isOpen={open}
        closeFn={() => handleClose()}
      >
        <DialogContent sx={{ overflowY: "auto" }}>
          <List>
            {listBookCodes?.map((item, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <DeleteTextTranslationBook
                    bookCodes={bookCodes}
                    bookCode={item}
                  />
                }
              >
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <Grid2
          container
          spacing={1}
          direction="row"
          size={12}
          sx={{ m: 2, justifyContent: "flex-start", alignItems: "center" }}
        >
          <Grid2 item size={12}>
            {openPanel === "newBook" && (
              <NewBook
                bookCode={List}
                setBookCode={setListBookCodes}
                bookAbbr={bookAbbr}
                setBookAbbr={setBookAbbr}
                bookCodes={bookCodes}
                bookTitle={bookTitle}
                setBookTitle={setBookTitle}
                showVersification={showVersification}
                setShowVersification={setShowVersification}
              />
            )}
            {openPanel === "import" && <UsfmImport />}
          </Grid2>
          <Grid2 item size="auto">
            <Button onClick={() => toggle("newBook")} variant="contained">
              {" "}
              New Book{" "}
            </Button>
          </Grid2>
          <Grid2 item size="auto">
            <Button onClick={() => toggle("import")} variant="contained">
              {" "}
              Import{" "}
            </Button>
          </Grid2>
        </Grid2>
        <PanDialogActions
          closeFn={() => handleClose()}
          actionLabel={doI18n(
            "pages:core-contenthandler_bcv:create",
            i18nRef.current,
          )}
          closeLabel={doI18n("pages:content:close", i18nRef.current)}
          onlyCloseButton={true}
        />
      </PanDialog>
    </Box>
  );
}
