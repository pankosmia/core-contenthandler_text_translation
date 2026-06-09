import { DialogContent, Typography } from "@mui/material";
import { PanDialog, PanDialogActions, i18nContext } from "pankosmia-rcl";
import { doI18n } from "pithekos-lib";
import { useContext } from "react";

export default function ModalCreateTextTranslation({
  openModalCreate,
  handleCreate,
}) {
  const { i18nRef } = useContext(i18nContext);

  return (
    <PanDialog isOpen={openModalCreate}>
      <DialogContent>
        <Typography>
          {" "}
          Voulez vous rajouter un livre appuyer sur oui dans le cas contraire
          vous creéez un projet vide
        </Typography>
        <Typography> translation plan</Typography>
        <Typography></Typography>
      </DialogContent>
      <PanDialogActions
        closeFn={() => handleCreate()}
        closeLabel={doI18n(
          "pages:core-contenthandler_text_translation:close",
          i18nRef.current,
        )}
        actionFn={handleCreate}
        closeOnAction={false}
        actionLabel={doI18n(
          "pages:core-contenthandler_text_translation:create",
          i18nRef.current,
        )}
      />
    </PanDialog>
  );
}
