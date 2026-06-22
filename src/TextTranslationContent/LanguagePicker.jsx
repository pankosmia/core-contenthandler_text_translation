import {
  FormControl,
  FormHelperText,
  Grid2,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { PanLanguagePicker, i18nContext } from "pankosmia-rcl";
import { doI18n, getAndSetJson } from "pithekos-lib";
import { useContext, useEffect, useState } from "react";
import ListMenuItem from "../pages/ListMenuItem";
import sx from "../pages/Selection.styles";

export default function LanguagePicker({
  setCurrentLanguage,
  currentLanguage,
  setIsValid,
  versification,
  setVersification,
  open,
}) {
  const { i18nRef } = useContext(i18nContext);
  const [versificationCodes, setVersificationCodes] = useState([]);
  console.log("versificationCode", versificationCodes);

  useEffect(() => {
    if (open) {
      getAndSetJson({
        url: "/api/content-utils/versifications",
        setter: setVersificationCodes,
      }).then();
    }
  }, [open]);
  return (
    <Grid2 container spacing={2}>
      <Grid2 item size={12}>
        <PanLanguagePicker
          currentLanguage={currentLanguage}
          setCurrentLanguage={setCurrentLanguage}
          setIsValid={setIsValid}
        />
      </Grid2>
      <Grid2 item size={12}>
        <Stack spacing={1}>
          <Typography variant="body1">Choose versification </Typography>
          <Typography variant="caption">
            Bibles use books, chapters and verses to divide up content.
            Different traditions (eg Protestant, Catholic, Orthodox) do this in
            different ways. This choice affects the number of chapters in some
            books and the number of verses in each chapter, especially in the
            Old Testament. You may change this setting later, but choosing now
            will make things easier later on.
          </Typography>
          <FormControl sx={{ width: "100%" }}>
            <InputLabel
              id="booksVersification-label"
              required
              htmlFor="booksVersification"
              sx={sx.inputLabel}
            >
              {doI18n(
                "pages:core-contenthandler_text_translation:versification_scheme",
                i18nRef.current,
              )}
            </InputLabel>
            <Select
              variant="outlined"
              required
              labelId="booksVersification-label"
              name="booksVersification"
              inputProps={{
                id: "bookVersification",
              }}
              value={versification}
              label={doI18n(
                "pages:core-contenthandler_text_translation:versification_scheme",
                i18nRef.current,
              )}
              onChange={(event) => {
                setVersification(event.target.value);
              }}
              sx={sx.select}
            >
              {versificationCodes.map((listItem, n) => (
                <MenuItem key={n} value={listItem} dense>
                  <ListMenuItem
                    listItem={`${listItem.toUpperCase()} - ${doI18n(`scripture:versifications:${listItem}`, i18nRef.current)}`}
                  />
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              {doI18n(
                `pages:core-contenthandler_text_translation:helper_versification`,
                i18nRef.current,
              )}
            </FormHelperText>
          </FormControl>
        </Stack>
      </Grid2>
    </Grid2>
  );
}
