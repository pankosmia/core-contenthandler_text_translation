import {
  Box,
  Typography,
  ListItem,
  List,
  ListItemIcon,
  ListItemText,
  Checkbox,
} from "@mui/material";
import { useState, useEffect, useContext } from "react";
import { getAndSetJson, doI18n } from "pithekos-lib";
import {
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import ListMenuItem from "../pages/ListMenuItem";

import sx from "../pages/Selection.styles";
import { i18nContext } from "pankosmia-rcl";
export default function ContentZip({
  open,
  versification,
  setVersification,
  booklist,
  setSelectedBookList,
  selectedBookList,
}) {
  const { i18nRef } = useContext(i18nContext);

  const [versificationCodes, setVersificationCodes] = useState([]);
  useEffect(() => {
    if (open) {
      getAndSetJson({
        url: "/content-utils/versifications",
        setter: setVersificationCodes,
      }).then();
    }
  }, [open]);
  const toggleBook = (book) => {
    setSelectedBookList((prev) =>
      prev.includes(book) ? prev.filter((b) => b !== book) : [...prev, book],
    );
  };
  return (
    <>
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
      {/* Book selection list */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          {doI18n(
            "pages:core-contenthandler_text_translation:select_books",
            i18nRef.current,
          )}
        </Typography>

        <List dense>
          {booklist.map((book) => (
            <ListItem key={book} button onClick={() => toggleBook(book)}>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={selectedBookList.includes(book)}
                  tabIndex={-1}
                  disableRipple
                />
              </ListItemIcon>
              <ListItemText primary={book.split("-")[1]} />
            </ListItem>
          ))}
        </List>
      </Box>
    </>
  );
}
