import {
  Box,
  Button,
  DialogContent,
  FormControl,
  Grid2,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { doI18n, getAndSetJson, getJson } from "pithekos-lib";
import {
  PanDialog,
  PanDialogActions,
  i18nContext,
  debugContext,
  Header,
} from "pankosmia-rcl";
import sx from "../pages/Selection.styles";
import ListMenuItem from "../pages/ListMenuItem";
import { useContext, useEffect, useState } from "react";
export default function SelectionOptionTranslationPlan() {
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
  const [selectedPlan, setSelectedPlan] = useState({});

  const [metadataSummaries, setMetadataSummaries] = useState({});
  const planResources = Object.entries(metadataSummaries)
    .filter((r) => r[1].flavor === "x-translationplan")
    .map((r) => r[1].name);

  useEffect(() => {
    if (open) {
      getAndSetJson({
        url: "/burrito/metadata/summaries",
        setter: setMetadataSummaries,
      }).then();
    }
  }, [open]);
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
        closeFn={() => setOpen(false)}
      >
        <DialogContent sx={{ overflowY: "auto", maxHeight: "60vh" }}>
          <Typography sx={{ padding: 1 }}>
            {doI18n(
              "pages:core-contenthandler_text_translation:helper_template",
              i18nRef.current,
            )}
          </Typography>
          <FormControl sx={{ width: "100%" }}>
            <InputLabel
              id="select-plan-label"
              required
              htmlFor="plan"
              sx={sx.inputLabel}
            >
              {doI18n(
                "pages:core-contenthandler_text_translation:select_plan",
                i18nRef.current,
              )}
            </InputLabel>
            <Select
              variant="outlined"
              required
              labelId="plan-label"
              name="plan"
              inputProps={{
                id: "bookCode",
              }}
              value={selectedPlan}
              label={doI18n(
                "pages:core-contenthandler_text_translation:select_plan",
                i18nRef.current,
              )}
              onChange={(event) => {
                setSelectedPlan(event.target.value);
              }}
              sx={sx.select}
            >
              {Object.entries(metadataSummaries)
                .filter((r) => r[1].flavor === "x-translationplan")
                .map((r) => (
                  <MenuItem key={r[0]} value={r[0]} dense>
                    <ListMenuItem listItem={r[1].name} />
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </DialogContent>
        <PanDialogActions
          closeFn={() => setOpen(false)}
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
