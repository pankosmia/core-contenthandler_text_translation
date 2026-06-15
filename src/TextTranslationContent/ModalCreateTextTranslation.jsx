import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  DialogContent,
  DialogContentText,
  Stack,
  Typography,
} from "@mui/material";
import { PanDialog, PanDialogActions, i18nContext } from "pankosmia-rcl";
import { doI18n } from "pithekos-lib";
import { useContext } from "react";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import { useNavigate } from "react-router-dom";
export default function ModalCreateTextTranslation({
  openModalCreate,
  handleCreate,
}) {
  const { i18nRef } = useContext(i18nContext);
  const navigate = useNavigate();
  return (
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
            <CardActionArea>
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
        //closeFn={}
        closeLabel={doI18n(
          "pages:core-contenthandler_text_translation:close",
          i18nRef.current,
        )}
        onlyCloseButton
      />
    </PanDialog>
  );
}
