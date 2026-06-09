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

  const toggleBook = (book) => {
    setSelectedBookList((prev) =>
      prev.includes(book) ? prev.filter((b) => b !== book) : [...prev, book],
    );
  };
  return (
    <>
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
