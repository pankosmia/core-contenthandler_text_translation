import { useState, useContext, useEffect } from 'react';
import {
    AppBar,
    Button, Checkbox,
    FormControl, FormControlLabel, FormGroup,
    Stack,
    TextField,
    Toolbar,
    Typography,
    Select,
    MenuItem,
    InputLabel, Grid2,
    DialogActions,
    Dialog,
    Box,
    DialogContent,
    Tooltip
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { i18nContext, debugContext, postJson, doI18n, getAndSetJson, getJson, Header } from "pithekos-lib";
import sx from "./Selection.styles";
import ListMenuItem from "./ListMenuItem";

export default function NewBibleContent() {

    const [open, setOpen] = useState(true)
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { i18nRef } = useContext(i18nContext);
    const { debugRef } = useContext(debugContext);
    const [contentName, setContentName] = useState("");
    const [contentAbbr, setContentAbbr] = useState("");
    const [contentType, setContentType] = useState("text_translation");
    const [contentLanguageCode, setContentLanguageCode] = useState("und");
    const [showBookFields, setShowBookFields] = useState(true);
    const [bookCode, setBookCode] = useState("TIT");
    const [bookTitle, setBookTitle] = useState("Tit");
    const [bookAbbr, setBookAbbr] = useState("Ti");
    const [postCount, setPostCount] = useState(0);
    const [showVersification, setShowVersification] = useState(true);
    const [versification, setVersification] = useState("eng");
    const [versificationCodes, setVersificationCodes] = useState([]);
    const [bookCodes, setBookCodes] = useState([]);
    const [protestantOnly, setProtestantOnly] = useState(true);
    const [localRepos, setLocalRepos] = useState([]);
    const [repoExists, setRepoExists] = useState(false);

    const handleClose = () => {
        const url = window.location.search;
        const params = new URLSearchParams(url);
        const returnType = params.get("returntypepage");

        if (returnType === "dashboard") {
            window.location.href = "/clients/main"
        } else {
            window.location.href = "/clients/content"
        }
    }

    const handleCloseCreate = async () => {
        setOpen(false);
        setTimeout(() => {
            window.location.href = '/clients/content';
        });
    };

    useEffect(() => {
        if (open) {
            getAndSetJson({
                url: "/content-utils/versifications",
                setter: setVersificationCodes
            }).then()
        }
    },
        [open]
    );

    useEffect(
        () => {
            const doFetch = async () => {
                const versificationResponse = await getJson("/content-utils/versification/eng", debugRef.current);
                if (versificationResponse.ok) {
                    setBookCodes(Object.keys(versificationResponse.json.maxVerses));
                }
            };
            if (bookCodes.length === 0 && open) {
                doFetch().then();
            }
        }, [open]
    );

    useEffect(
        () => {
            if (open){
                getAndSetJson({
                    url: "/git/list-local-repos",
                    setter: setLocalRepos
                }).then()  
            }  
        },
        [open]
    );

    useEffect(
        () => {
            setContentName("");
            setContentAbbr("");
            setContentType("text_translation");
            setContentLanguageCode("und");
            setBookCode("TIT");
            setBookTitle("Titus");
            setBookAbbr("Ti");
            setShowBookFields(true);
            setShowVersification(true);
            setVersification("eng");
        },
        [postCount]
    );

    const handleCreate = async () => {
        const payload = {
            content_name: contentName,
            content_abbr: contentAbbr,
            content_type: contentType,
            content_language_code: contentLanguageCode,
            versification: versification,
            add_book: showBookFields,
            book_code: showBookFields ? bookCode : null,
            book_title: showBookFields ? bookTitle : null,
            book_abbr: showBookFields ? bookAbbr : null,
            add_cv: showBookFields ? showVersification : null,
        };
        const response = await postJson(
            "/git/new-text-translation",
            JSON.stringify(payload),
            debugRef.current
        );
        if (response.ok) {
            setPostCount(postCount + 1);
            enqueueSnackbar(
                doI18n("pages:content:content_created", i18nRef.current),
                { variant: "success" }
            );
            handleCloseCreate();
        } else {
            enqueueSnackbar(
                `${doI18n("pages:content:content_creation_error", i18nRef.current)}: ${response.status}`,
                { variant: "error" }
            );
            setErrorMessage(`${doI18n("pages:content:book_creation_error", i18nRef.current)}: ${response.status
                }`);
            setErrorDialogOpen(true);
        }
    };

    const handleCloseErrorDialog = () => {
        setErrorDialogOpen(false);
        handleClose();
    };

    return (
        <Box>
            <Box
                sx={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    zIndex: -1,
                    backgroundImage:
                        'url("/app-resources/pages/content/background_blur.png")',
                    backgroundRepeat: "no-repeat",
                }}
            />
            <Header
                titleKey="pages:content:title"
                currentId="content"
                requireNet={false}

            />
            <Dialog
                fullWidth={true}
                open={open}
                onClose={handleClose}
                sx={{
                    backdropFilter: "blur(3px)",
                }}
            >

                <AppBar color='secondary' sx={{ position: 'relative', borderTopLeftRadius: 4, borderTopRightRadius: 4 }}>
                    <Toolbar>
                        <Typography variant="h6" component="div">
                            {doI18n("pages:core-contenthandler_text_translation:new_text_translation_content", i18nRef.current)}
                        </Typography>

                    </Toolbar>
                </AppBar>
                <Typography variant='subtitle2' sx={{ ml: 1, p: 1 }}> {doI18n(`pages:content:required_field`, i18nRef.current)}</Typography>
                <Stack spacing={2} sx={{ m: 2 }}>
                    <TextField
                        id="name"
                        required
                        label={doI18n("pages:content:name", i18nRef.current)}
                        value={contentName}
                        onChange={(event) => {
                            setContentName(event.target.value);
                        }}
                    />
                    <Tooltip 
                        open={repoExists} 
                        slotProps={{popper: {modifiers: [{name: 'offset', options: {offset: [0, -7]}}]}}}
                        title="Repo already exists" placement="top-start"
                    >
                        <TextField
                            id="abbr"
                            required
                            label={doI18n("pages:content:abbreviation", i18nRef.current)}
                            value={contentAbbr}
                            onChange={(event) => {
                                if (localRepos.map(l => l.split("/")[2]).includes(event.target.value)){
                                    setRepoExists(true);
                                } else {
                                    setRepoExists(false);
                                }
                                setContentAbbr(event.target.value);
                            }}
                        />
                    </Tooltip>
                    <TextField
                        id="type"
                        required
                        disabled={true}
                        sx={{ display: "none" }}
                        label={doI18n("pages:content:type", i18nRef.current)}
                        value={contentType}
                        onChange={(event) => {
                            setContentType(event.target.value);
                        }}
                    />
                    <TextField
                        id="languageCode"
                        required
                        label={doI18n("pages:content:lang_code", i18nRef.current)}
                        value={contentLanguageCode}
                        onChange={(event) => {
                            setContentLanguageCode(event.target.value);
                        }}
                    />
                    <FormControl>
                        <InputLabel id="booksVersification-label" required htmlFor="booksVersification"
                            sx={sx.inputLabel}>
                            {doI18n("pages:content:versification_scheme", i18nRef.current)}
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
                            label={doI18n("pages:content:versification_scheme", i18nRef.current)}
                            onChange={(event) => {
                                setVersification(event.target.value);
                            }}
                            sx={sx.select}
                        >
                            {
                                versificationCodes.map((listItem, n) => <MenuItem key={n} value={listItem}
                                    dense>
                                    <ListMenuItem
                                        listItem={`${listItem.toUpperCase()} - ${doI18n(`scripture:versifications:${listItem}`, i18nRef.current)}`}
                                    />
                                </MenuItem>
                                )
                            }
                        </Select>
                    </FormControl>
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    color='secondary'
                                    checked={showBookFields}
                                    onChange={() => setShowBookFields(!showBookFields)}
                                />
                            }
                            label={doI18n("pages:content:add_book_checkbox", i18nRef.current)}
                        />
                    </FormGroup>
                    {
                        showBookFields && <>
                            <Grid2 container spacing={2} justifyItems="flex-end" alignItems="stretch">
                                <Grid2 item size={4}>
                                    <FormControl sx={{ width: "100%" }}>
                                        <InputLabel id="bookCode-label" required htmlFor="bookCode" sx={sx.inputLabel}>
                                            {doI18n("pages:content:book_code", i18nRef.current)}
                                        </InputLabel>
                                        <Select
                                            variant="outlined"
                                            labelId="bookCode-label"
                                            name="bookCode"
                                            inputProps={{
                                                id: "bookCode",
                                            }}
                                            value={bookCode}
                                            label={doI18n("pages:content:book_code", i18nRef.current)}
                                            onChange={(event) => {
                                                setBookCode(event.target.value);
                                                setBookAbbr(
                                                    ["1", "2", "3"].includes(event.target.value[0]) ?
                                                        event.target.value.slice(0, 2) + event.target.value[2].toLowerCase() :
                                                        event.target.value[0] + event.target.value.slice(1).toLowerCase()
                                                );
                                                setBookTitle(doI18n(`scripture:books:${event.target.value}`, i18nRef.current))
                                            }}
                                            sx={sx.select}
                                        >
                                            {
                                                (protestantOnly ? bookCodes.slice(0, 66) : bookCodes).map((listItem, n) => <MenuItem key={n} value={listItem} dense>
                                                    <ListMenuItem listItem={`${listItem} - ${doI18n(`scripture:books:${listItem}`, i18nRef.current)}`} />
                                                </MenuItem>
                                                )
                                            }
                                        </Select>
                                    </FormControl>

                                </Grid2>
                                <Grid2 item size={4}>
                                    <TextField
                                        id="bookAbbr"
                                        required
                                        sx={{ width: "100%" }}
                                        label={doI18n("pages:content:book_abbr", i18nRef.current)}
                                        value={bookAbbr}
                                        onChange={(event) => {
                                            setBookAbbr(event.target.value);
                                        }}
                                    />
                                </Grid2>
                                <Grid2 item size={4}>
                                    <TextField
                                        id="bookTitle"
                                        required
                                        sx={{ width: "100%" }}
                                        label={doI18n("pages:content:book_title", i18nRef.current)}
                                        value={bookTitle}
                                        onChange={(event) => {
                                            setBookTitle(event.target.value);
                                        }}
                                    />
                                </Grid2>
                                <FormGroup>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                color='secondary'
                                                checked={protestantOnly}
                                                onChange={() => setProtestantOnly(!protestantOnly)}
                                            />
                                        }
                                        label={doI18n("pages:content:protestant_books_only", i18nRef.current)}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                color='secondary'
                                                checked={showVersification}
                                                onChange={() => setShowVersification(!showVersification)}
                                            />
                                        }
                                        label={doI18n("pages:content:add_versification_checkbox", i18nRef.current)}
                                    />
                                </FormGroup>
                            </Grid2>

                        </>
                    }
                </Stack>
                <DialogActions>
                    <Button
                        onClick={handleClose}
                        color='primary'
                    >
                        {doI18n("pages:content:close", i18nRef.current)}
                    </Button>
                    <Button
                        autoFocus
                        variant='contained'
                        color="primary"
                        disabled={
                            !(
                                contentName.trim().length > 0 &&
                                contentAbbr.trim().length > 0 &&
                                contentType.trim().length > 0 &&
                                contentLanguageCode.trim().length > 0 &&
                                versification.trim().length === 3 &&
                                (
                                    !showBookFields || (
                                        bookCode.trim().length === 3 &&
                                        bookTitle.trim().length > 0 &&
                                        bookAbbr.trim().length > 0
                                    )
                                )
                            )
                            ||
                            repoExists
                        }
                        onClick={handleCreate}
                    >
                        {doI18n("pages:content:create", i18nRef.current)}
                    </Button>
                </DialogActions>
            </Dialog>
            {/* Error Dialog*/}
            <Dialog open={errorDialogOpen} onClose={handleCloseErrorDialog}>
                <DialogContent>
                    <Typography color="error">{errorMessage}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseErrorDialog} variant="contained" color="primary">
                        {doI18n("pages:content:close", i18nRef.current)}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>

    );
}