import { Typography } from "@mui/material";
import { doI18n } from "pankosmia-lib/i18n";
import { useContext } from "react";
import {
  PanDialog,
  PanDialogActions,
  i18nContext,
  debugContext,
  Header,
  PanVersificationPicker,
  PanBookPicker,
} from "pankosmia-rcl";

export default function NewBook({
  bookAbbr,
  bookCode,
  bookTitle,
  setBookAbbr,
  setBookCode,
  setBookTitle,
  showVersification,
  setShowVersification,
  bookCodes,
}) {
  const { i18nRef } = useContext(i18nContext);
  return (
    <>
      <Typography sx={{ padding: 1 }}>
        {doI18n(
          "pages:core-contenthandler_text_translation:helper_book",
          i18nRef.current,
        )}
      </Typography>
      <PanBookPicker
        bookCode={bookCode}
        setBookCode={setBookCode}
        bookAbbr={bookAbbr}
        setBookAbbr={setBookAbbr}
        bookCodes={bookCodes}
        bookTitle={bookTitle}
        setBookTitle={setBookTitle}
        showVersification={showVersification}
        setShowVersification={setShowVersification}
      />
    </>
  );
}
