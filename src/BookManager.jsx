import {
  Box,
  Button,
  DialogContent,
  DialogContentText,
  IconButton,
  ListItem,
  Typography,
} from "@mui/material";
import { doI18n, getJson } from "pithekos-lib";
import {
  PanDialog,
  PanDialogActions,
  i18nContext,
  debugContext,
  Header,
} from "pankosmia-rcl";

import { useContext, useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
export default function ManageBook() {
  const { i18nRef } = useContext(i18nContext);
  const [open, setOpen] = useState(true);
  const hash = window.location.hash;
  const query = hash.includes("?") ? hash.split("?") : "";
  const repoPathQuery = new URLSearchParams(query[1]);
  const typePageQuery = new URLSearchParams(query[2]);
  const returnType = typePageQuery.get("returnTypePage");
  const path = repoPathQuery.get("repoPath");
  const [repoData, setRepodata] = useState({});
  const [repoInfo, setRepoInfo] = useState();

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
  const livres = [];

  for (let i = 0; i < 100; i++) {
    livres.push(<p key={i}>livre {i + 1}</p>);
  }
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
        <DialogContent>
          <div>{livres}</div>
        </DialogContent>
        <Button> ajouter un nouveau livre </Button>
        <PanDialogActions
          closeFn={() => handleClose()}
          closeLabel={doI18n("pages:content:close", i18nRef.current)}
          onlyCloseButton={true}
        />
      </PanDialog>
    </Box>
  );
}
