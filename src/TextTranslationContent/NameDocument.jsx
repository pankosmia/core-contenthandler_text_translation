import { Grid2, TextField, Tooltip } from "@mui/material";
import { doI18n } from "pithekos-lib";
import { i18nContext } from "pankosmia-rcl";
import { useContext } from "react";

export default function NameDocument({ contentType, setContentType, repoExists, setRepoExists, errorAbbreviation, setErrorAbbreviation, contentName, setContentName, contentAbbr, setContentAbbr, localRepos }) {
    const regexAbbreviation = /^[A-Za-z0-9][A-Za-z0-9_]{0,6}[A-Za-z0-9]$/
    const { i18nRef } = useContext(i18nContext);

    return (
        <>
            <Grid2 container spacing={1} justifyItems="flex-end" alignItems="stretch">
                <Grid2 item size={12}>
                    <TextField
                        id="name"
                        sx={{ width: "100%" }}
                        required
                        label={doI18n("pages:core-contenthandler_text_translation:name", i18nRef.current)}
                        value={contentName}
                        onChange={(event) => {
                            setContentName(event.target.value);
                        }}
                    />
                </Grid2>
                <Grid2 item size={12}>
                    <Tooltip
                        open={repoExists}
                        slotProps={{ popper: { modifiers: [{ name: 'offset', options: { offset: [0, -7] } }] } }}
                        title={doI18n("pages:core-contenthandler_text_translation:name_is_taken", i18nRef.current)} placement="top-start"
                    >
                        <TextField
                            sx={{ width: "100%" }}
                            id="abbr"
                            error={errorAbbreviation}
                            helperText={`${doI18n("pages:core-contenthandler_text_translation:helper_abbreviation", i18nRef.current)}`}
                            required
                            label={doI18n("pages:core-contenthandler_text_translation:abbreviation", i18nRef.current)}
                            value={contentAbbr}
                            onChange={(event) => {
                                const value = event.target.value
                                setRepoExists(localRepos.map(l => l.split("/")[2]).includes(value));
                                setContentAbbr(value);
                                setErrorAbbreviation(!regexAbbreviation.test(value))
                            }}
                        />
                    </Tooltip>
                </Grid2>
            </Grid2>
            <TextField
                id="type"
                required
                disabled={true}
                sx={{ display: "none" }}
                label={doI18n("pages:core-contenthandler_text_translation:type", i18nRef.current)}
                value={contentType}
                onChange={(event) => {
                    setContentType(event.target.value);
                }}
            />

        </>
    );
}