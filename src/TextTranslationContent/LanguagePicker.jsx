import {
    Checkbox,
    FormControl, FormControlLabel, FormGroup,
    TextField,
    Typography,
    Grid2,
    FormLabel,
    RadioGroup, Radio,
    DialogContentText,
    Autocomplete,

} from "@mui/material";
import {
    i18nContext,
    doI18n,
    getJson,
    getAndSetJson,
} from "pithekos-lib";
import { useContext, useEffect, useState } from "react";
import { PanFilteredMenu } from "pankosmia-rcl";

export default function LanguagePicker({ contentType, setContentType, errorLangCode, setErrorLangCode, localRepos, contentLanguageCode, open, setCurrentLanguageCode, currentLanguageCode, setContentLanguageCode }) {
    const { i18nRef } = useContext(i18nContext);
    const [languageOption, setLanguageOption] = useState("BCP47List");
    const [localRepoOnly, setLocalRepoOnly] = useState(true);
    const [resourcesBurrito, setResourcesBurrito] = useState(false);
    const [burritoSelected, setBurritoSelected] = useState("")

    useEffect(() => {
        if (languageOption) {
            setCurrentLanguageCode({ language_code: "", language_name: "" })
        }
    }, [setCurrentLanguageCode, languageOption])

    useEffect(
        () => {
            if (open) {
                getAndSetJson({
                    url: "/app-resources/lookups/bcp47-language_codes.json",
                    setter: setContentLanguageCode
                }).then()
            }
        },
        [open]
    );

    useEffect(() => {
        if (burritoSelected) {
            getJson(`/burrito/metadata/summary/${burritoSelected}`)
                .then((res) => res.json)
                .then((data) => setCurrentLanguageCode({ ...currentLanguageCode, language_code: data.language_code, language_name: data.language_name }))
                .catch((err) => console.error('Error :', err));
        }

    }, [open, burritoSelected]);

    const languageCodes = Object.entries(contentLanguageCode).map(([key, value]) => ({
        language_code: key,
        language_name: value.en,
    }));
    
    const burritos = localRepos.filter(burrito =>
        (localRepoOnly && burrito.startsWith("_local_")) || (resourcesBurrito && burrito.startsWith("git"))
    );
    const regexLangCode = /^x-[a-z]{3}$/

    return (
        <>
            <FormControl>
                <FormLabel
                    id="language_code-create-options">
                    {doI18n("pages:core-contenthandler_text_translation:choose_language", i18nRef.current)}
                </FormLabel>
                <RadioGroup
                    row
                    aria-labelledby="language_code-create-options"
                    name="language_code-create-options-radio-group"
                    value={languageOption}
                    onClick={event => setLanguageOption(event.target.value)}
                >
                    <FormControlLabel value="BCP47List" control={<Radio />}
                        label={doI18n("pages:core-contenthandler_text_translation:lang_code_bcp47_list", i18nRef.current)} />
                    <FormControlLabel value="burrito" control={<Radio />}
                        label={doI18n("pages:core-contenthandler_text_translation:lang_code_burrito", i18nRef.current)} />
                    <FormControlLabel value="customLanguage" control={<Radio />}
                        label={doI18n("pages:core-contenthandler_text_translation:lang_code_custom_language", i18nRef.current)} />
                </RadioGroup>
            </FormControl>
            {languageOption === "BCP47List" &&
                <Grid2 container spacing={2} >
                    <Grid2 item size={12}>
                        <Typography>{doI18n("pages:core-contenthandler_text_translation:description_bcp47_list", i18nRef.current)}</Typography>
                    </Grid2>
                    <Grid2 item size={6}>
                        <PanFilteredMenu
                            onChange={(event, newValue) => {
                                setCurrentLanguageCode(newValue)
                            }}
                            data={languageCodes}
                            getOptionLabel={(option) =>
                                `${option.language_name || ''}`}
                            titleLabel={`${doI18n("pages:core-contenthandler_text_translation:lang_name", i18nRef.current)} * `}
                        />
                    </Grid2>
                    <Grid2 item size={6}>
                        <TextField
                            disabled
                            id="language_code"
                            sx={{ width: "100%" }}
                            label={doI18n("pages:core-contenthandler_text_translation:lang_code", i18nRef.current)}
                            value={currentLanguageCode ? currentLanguageCode.language_code : null}
                        />
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
                </Grid2>
            }
            {languageOption === "burrito" &&

                <Grid2 container spacing={1} justifyItems="flex-end" alignItems="stretch">
                    <Typography>{doI18n("pages:core-contenthandler_text_translation:description_lang_code_burrito", i18nRef.current)}</Typography>
                    <Grid2 item size={12}>
                        <FormLabel>{doI18n("pages:core-contenthandler_text_translation:title_section_burrito", i18nRef.current)}</FormLabel>
                        <FormGroup row required>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        color='secondary'
                                        checked={localRepoOnly}
                                        onChange={() => setLocalRepoOnly(!localRepoOnly)}
                                        defaultChecked
                                    />
                                }
                                label={doI18n("pages:core-contenthandler_text_translation:local_project", i18nRef.current)}
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        color='secondary'
                                        checked={resourcesBurrito}
                                        onChange={() => setResourcesBurrito(!resourcesBurrito)}
                                    />
                                }
                                label={doI18n("pages:core-contenthandler_text_translation:burrito_resources", i18nRef.current)}
                            />
                        </FormGroup>
                    </Grid2>
                    <Grid2 item size={12}>
                        <PanFilteredMenu
                            data={burritos}
                            onChange={(event, newValue) => {
                                setBurritoSelected(newValue)
                            }}
                            getOptionLabel={(option) => `${option}`}
                            titleLabel={`${doI18n("pages:core-contenthandler_text_translation:document", i18nRef.current)} *`}

                        />
                    </Grid2>

                    <Grid2 item size={6}>
                        <TextField
                            disabled
                            id="language_name"
                            sx={{ width: "100%" }}
                            label={doI18n("pages:core-contenthandler_text_translation:lang_name", i18nRef.current)}
                            value={currentLanguageCode ? currentLanguageCode.language_name : null}
                        />
                    </Grid2>
                    <Grid2 item size={6}>
                        <TextField
                            disabled
                            id="language_code"
                            sx={{ width: "100%" }}
                            label={doI18n("pages:core-contenthandler_text_translation:lang_code", i18nRef.current)}
                            value={currentLanguageCode ? currentLanguageCode.language_code : null}
                        />
                    </Grid2>
                </Grid2>
            }
            {languageOption === "customLanguage" &&
                <Grid2 container spacing={1} justifyItems="flex-end" alignItems="stretch">
                    <Grid2 item size={12}>
                        <Typography>{doI18n("pages:core-contenthandler_text_translation:description_custom_language", i18nRef.current)}</Typography>
                    </Grid2>
                    <Grid2 item size={6}>
                        <TextField
                            id="language_name"
                            required
                            sx={{ width: "100%" }}
                            label={doI18n("pages:core-contenthandler_text_translation:lang_name", i18nRef.current)}
                            value={currentLanguageCode ? currentLanguageCode.language_name : null}
                            onChange={(event) => {
                                const value = event.target.value;
                                setCurrentLanguageCode({ ...currentLanguageCode, language_name: value });
                            }}
                        />
                    </Grid2>
                    <Grid2 item size={6}>
                        <TextField
                            id="language_code"
                            placeholder='x-abc'
                            error={errorLangCode}
                            helperText={`${doI18n("pages:core-contenthandler_text_translation:helper_language_code", i18nRef.current)}`}
                            required
                            sx={{ width: "100%" }}
                            label={doI18n("pages:core-contenthandler_text_translation:lang_code", i18nRef.current)}
                            value={currentLanguageCode ? currentLanguageCode.language_code : null}
                            onChange={(event) => {
                                const value = event.target.value.toLocaleLowerCase();
                                setCurrentLanguageCode({ ...currentLanguageCode, language_code: value });
                                setErrorLangCode(!regexLangCode.test(value))
                            }}
                        />
                    </Grid2>
                </Grid2>
            }
        </>
    )
}