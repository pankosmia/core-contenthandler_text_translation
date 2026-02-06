import { useState, useContext, useEffect } from 'react';
import {
    Checkbox,
    FormControl, FormControlLabel, FormGroup,
    TextField,
    Select,
    MenuItem,
    InputLabel, Grid2,
    FormLabel,
    RadioGroup, Radio,
    Typography,
    FormHelperText,

} from "@mui/material";
import {
    doI18n,
    getAndSetJson,
    getJson,
} from "pithekos-lib";
import sx from "../pages/Selection.styles";
import ListMenuItem from "../pages/ListMenuItem";
import { i18nContext, PanVersificationPicker, PanBookPicker } from 'pankosmia-rcl';
export default function ContentDocument({ open, contentOption, setContentOption, versification, setVersification, bookCode, setBookCode, bookAbbr, setBookAbbr, bookCodes, bookTitle, setBookTitle, showVersification, setShowVersification, selectedPlan, setSelectedPlan }) {
    const { i18nRef } = useContext(i18nContext);

    const [metadataSummaries, setMetadataSummaries] = useState({});
    const planResources = Object.entries(metadataSummaries)
        .filter(r => r[1].flavor === "x-translationplan")
        .map(r => r[1].name)

    useEffect(() => {
        if (open) {
            getAndSetJson({
                url: "/burrito/metadata/summaries",
                setter: setMetadataSummaries
            }).then()
        }
    },
        [open]
    );

    return (
        <>
            {
                contentOption !== "plan" &&
                <PanVersificationPicker versification={versification} setVersification={setVersification} isOpen={open} />
            }
            <FormControl>
                <FormLabel
                    id="book-create-options">
                    {doI18n("pages:core-contenthandler_text_translation:add_content", i18nRef.current)}
                </FormLabel>
                <RadioGroup
                    row
                    aria-labelledby="book-create-options"
                    name="book-create-options-radio-group"
                    value={contentOption}
                    onChange={event => setContentOption(event.target.value)}
                >
                    {/*<FormControlLabel value="none" control={<Radio />}
                                label={doI18n("pages:core-contenthandler_text_translation:no_content_radio", i18nRef.current)} />*/}
                    <FormControlLabel value="book" control={<Radio />}
                        label={doI18n("pages:core-contenthandler_text_translation:book_content_radio", i18nRef.current)} />
                    <FormControlLabel value="plan"
                        disabled={planResources.length === 0}
                        control={<Radio />}
                        label={doI18n("pages:core-contenthandler_text_translation:plan_content_radio", i18nRef.current)} />
                </RadioGroup>
            </FormControl>
            <Typography sx={{ padding: 1 }}>{contentOption === "book" ? `${doI18n("pages:core-contenthandler_text_translation:helper_book", i18nRef.current)}` : `${doI18n("pages:core-contenthandler_text_translation:helper_template", i18nRef.current)}`}</Typography>
            {
                (contentOption === "book") &&
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
            }
            {
                (contentOption === "plan") &&
                <Grid2 container spacing={1} justifyItems="flex-end" alignItems="stretch">
                    <Grid2 item size={12}>
                        <FormControl sx={{ width: "100%" }}>
                            <InputLabel id="select-plan-label" required htmlFor="plan" sx={sx.inputLabel}>
                                {doI18n("pages:core-contenthandler_text_translation:select_plan", i18nRef.current)}
                            </InputLabel>
                            <Select
                                variant="outlined"
                                required
                                labelId="plan-label"
                                name="plan"
                                inputProps={{
                                    id: "bookCode",
                                }}
                                value={selectedPlan}
                                label={doI18n("pages:core-contenthandler_text_translation:select_plan", i18nRef.current)}
                                onChange={event => {
                                    setSelectedPlan(event.target.value);
                                }}
                                sx={sx.select}
                            >
                                {
                                    Object.entries(metadataSummaries)
                                        .filter(r => r[1].flavor === "x-translationplan")
                                        .map(r =>
                                            <MenuItem key={r[0]} value={r[0]} dense>
                                                <ListMenuItem
                                                    listItem={r[1].name} />
                                            </MenuItem>
                                        )
                                }
                            </Select>
                        </FormControl>
                    </Grid2>
                </Grid2>
            }
        </>
    );
}