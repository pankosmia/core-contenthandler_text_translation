import { Grid2 } from "@mui/material";
import { PanLanguagePicker, PanVersificationPicker } from "pankosmia-rcl";
import { getAndSetJson } from "pankosmia-lib/http";
import { useEffect, useState } from "react";

export default function LanguagePicker({
  setCurrentLanguage,
  currentLanguage,
  setIsValid,
  versification,
  setVersification,
  open,
}) {
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
        <PanVersificationPicker
          versification={versification}
          setVersification={setVersification}
          isOpen={open}
        />
      </Grid2>
    </Grid2>
  );
}
