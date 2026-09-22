import React, { useState, useEffect } from "react";
import { Box, MenuItem, TextField } from "@mui/material";
import { getJson } from "pankosmia-lib/http";
import { doI18n } from "pankosmia-lib/i18n";

function BookPicker({
  setFirstChapter,
  bcvRef,
  debugRef,
  i18nRef,
  currentProjectRef,
  disable = false,
}) {
  const [contentBooks, setContentBooks] = useState([]);
  const [currentBook, setCurrentBook] = useState(bcvRef.current.bookCode);
  useEffect(() => {
    setCurrentBook(bcvRef.current.bookCode);
  }, [bcvRef.current.bookCode]);

  useEffect(() => {
    const getProjectBooks = async () => {
      if (currentProjectRef.current) {
        const projectPath = `${currentProjectRef.current.source}/${currentProjectRef.current.organization}/${currentProjectRef.current.project}`;
        const fullMetadataResponse = await getJson(
          `/api/burrito/metadata/summary/${projectPath}`,
          debugRef.current,
        );
        if (fullMetadataResponse.ok) {
          setContentBooks(fullMetadataResponse.json.book_codes);
        }
      }
    };
    getProjectBooks().then();
  }, [currentProjectRef]);

  useEffect(() => {
    if (currentBook) {
      setFirstChapter(currentProjectRef.current, debugRef.current, currentBook);
    }
  }, [currentBook]);

  return (
    <Box sx={{ justifyContent: "space-between" }}>
      <div>
        <TextField
          disabled={disable}
          label={`${doI18n("pages:core-local-workspace:book", i18nRef.current)}`}
          fullWidth
          id="book-button"
          size="small"
          select
          value={currentBook}
        >
          {contentBooks.map((b, n) => (
            <MenuItem
              sx={{ maxHeight: "3rem", height: "2rem" }}
              value={b}
              key={n}
              onClick={() => setCurrentBook(b)}
            >
              {doI18n(`scripture:books:${b}`, i18nRef.current)}
            </MenuItem>
          ))}
        </TextField>
      </div>
    </Box>
  );
}

export default BookPicker;
