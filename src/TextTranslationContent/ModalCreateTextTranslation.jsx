import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  DialogContent,
  Stack,
  Typography,
} from "@mui/material";
import { PanDialog, PanDialogActions, i18nContext } from "pankosmia-rcl";
import { doI18n, getAndSetJson } from "pithekos-lib";
import { useContext, useEffect, useState } from "react";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import { useNavigate } from "react-router-dom";
import SelectionOptionTranslationPlan from "./TranslationPlan";

export default function ModalCreateTextTranslation({
  openModalCreate,
  handleCreate,
  setOpenModalCreate,
  setContentOption,
}) {
  const { i18nRef } = useContext(i18nContext);
  const navigate = useNavigate();
  const [openModalOptionTranslationPlan, setOpenModalOptionTranslationPlan] =
    useState(false);
  const [metadataSummaries, setMetadataSummaries] = useState({});
  const planResources = Object.entries(metadataSummaries)
    .filter((r) => r[1].flavor === "x-translationplan")
    .map((r) => r[1].name);
  console.log("planResources", planResources);
  useEffect(() => {
    if (openModalOptionTranslationPlan) {
      getAndSetJson({
        url: "/api/burrito/metadata/summaries",
        setter: setMetadataSummaries,
      }).then();
    }
  }, [openModalOptionTranslationPlan]);
  return (
    <>
      <PanDialog
        titleLabel={"Choose document content "}
        isOpen={openModalCreate}
        fullWidth={false}
      >
        <DialogContent>
          <Stack spacing={1}>
            <Typography variant="body">
              {" "}
              Your new document is completely empty. To start editing you will
              need at least one empty book structure.{" "}
            </Typography>
            <Card>
              <CardActionArea onClick={() => navigate("/managerBook")}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography
                        component="div"
                        variant="body1"
                        sx={{ fontWeight: "bold" }}
                      >
                        Manage books
                      </Typography>

                      <Typography
                        variant="subtitle1"
                        component="div"
                        sx={{ color: "text.secondary" }}
                      >
                        Add empty book structures or import your work.
                      </Typography>
                    </Box>

                    <ArrowForwardOutlinedIcon
                      sx={{
                        color: "text.secondary",
                        ml: 2,
                      }}
                    />
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
            <Card>
              <CardActionArea
                disabled={planResources.length === 0}
                onClick={() => setOpenModalOptionTranslationPlan(true)}
                sx={{
                  "&.Mui-disabled": {
                    opacity: 0.5,
                    backgroundColor: "action.disabledBackground",
                  },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography
                        component="div"
                        variant="body1"
                        sx={{ fontWeight: "bold" }}
                      >
                        Start from a translation plan
                      </Typography>

                      <Typography
                        variant="subtitle1"
                        component="div"
                        sx={{ color: "text.secondary" }}
                      >
                        Choose from a selection of ready-to-use translation
                        structures.
                      </Typography>
                    </Box>

                    <ArrowForwardOutlinedIcon
                      sx={{
                        color: "text.secondary",
                        ml: 2,
                      }}
                    />
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Stack>
        </DialogContent>
        <PanDialogActions
          closeFn={() => setOpenModalCreate(false)}
          closeLabel={doI18n(
            "pages:core-contenthandler_text_translation:close",
            i18nRef.current,
          )}
          onlyCloseButton
        />
      </PanDialog>
      <SelectionOptionTranslationPlan
        metadataSummaries={metadataSummaries}
        setContentOption={setContentOption}
        open={openModalOptionTranslationPlan}
        close={setOpenModalOptionTranslationPlan}
      />
    </>
  );
}
