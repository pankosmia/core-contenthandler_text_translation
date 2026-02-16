import { useState, useContext, useEffect } from "react";
import {
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    Box,
    DialogContent,
    useTheme,
} from "@mui/material";
import { useSnackbar } from "notistack";
import {
    postJson,
    doI18n,
    getJson,
} from "pithekos-lib";
import sx from "./Selection.styles";
import ListMenuItem from "./ListMenuItem";
import { PanDialog, PanDialogActions, i18nContext, debugContext, Header } from "pankosmia-rcl";
import ErrorDialog from "../TextTranslationContent/ErrorDialog";

export default function DeleteTextTranslationBook() {
    const { enqueueSnackbar } = useSnackbar();

    const { i18nRef } = useContext(i18nContext);
    const { debugRef } = useContext(debugContext);
    const [bookCode, setBookCode] = useState("");
    const [open, setOpen] = useState(true);
    const [repoPath, setRepoPath] = useState([])
    const [bookCodes, setBookCodes] = useState([]);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [nameProject, setNameProject] = useState("");
    const theme = useTheme();

    const getProjectSummaries = async () => {
        const hash = window.location.hash;
        const query = hash.includes('?') ? hash.split('?')[1] : '';
        const params = new URLSearchParams(query);
        const path = params.get('repoPath');
        setRepoPath(path);
        const summariesResponse = await getJson(`/burrito/metadata/summary/${path}`, debugContext.current);
        if (summariesResponse.ok) {
            const data = summariesResponse.json;
            const bookCode = data.book_codes;
            setNameProject(data.name);
            setBookCodes(bookCode)
        } else {
            console.error(`${doI18n("pages:core-contenthandler_text_translation:error_data", i18nRef.current)}`);
        }

    };

    useEffect(
        () => {
            getProjectSummaries();
        },
        []
    );

    useEffect(() => {
        const doFetch = async () => {
            setBookCode("");
        };
        if (open) {
            doFetch().then();
        }
    }, [open]);

    const handleClose = () => {
        const url = window.location.search;
        const params = new URLSearchParams(url);
        const returnType = params.get("returntypepage");
        if (returnType === "dashboard") {
            window.location.href = "/clients/main";
        } else {
            window.location.href = "/clients/content";
        }
    };

    const handleCloseCreate = async () => {
        await postJson(`/burrito/metadata/remake-ingredients/${repoPath}`)
        setOpen(false);
        setTimeout(() => {
            window.location.href = '/clients/content';
        }, 500);
    };

    const handleDelete = async () => {
        const deleteResponse = await postJson(`/burrito/ingredient/delete/${repoPath}?ipath=${bookCode}.usfm`, debugRef.current);
        if (deleteResponse.ok) {
            enqueueSnackbar(`${doI18n("pages:core-contenthandler_text_translation:book_deleted", i18nRef.current)}`, {
                variant: "success",
            });
            handleCloseCreate();
        } else {
            setErrorMessage(`${doI18n("pages:core-contenthandler_text_translation:book_delete_error", i18nRef.current)}: ${deleteResponse.status
                }`);
            setErrorDialogOpen(true);
        };

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
                    backdropFilter: "blur(3px)",
                }}
            />
            <Header
                titleKey="pages:core-contenthandler_text_translation:title"
                currentId="core-contenthandler_text_translation"
                requireNet={false}
            />
            <PanDialog
                titleLabel={`${doI18n("pages:core-contenthandler_text_translation:delete_book", i18nRef.current)} - ${nameProject}`}
                isOpen={open}
                closeFn={() => handleClose()}
                theme={theme}
                fullWidth={false}
            >
                <DialogContent>
                    <FormControl sx={{ width: "100%" }}>
                        <InputLabel
                            id="bookCode-label"
                            htmlFor="bookCode"
                            sx={sx.inputLabel}
                        >
                            {doI18n("pages:core-contenthandler_text_translation:book_code", i18nRef.current)}
                        </InputLabel>
                        <Select
                            variant="outlined"
                            required
                            labelId="bookCode-label"
                            name="bookCode"
                            inputProps={{
                                id: "bookCode",
                            }}
                            value={bookCode}
                            label={doI18n("pages:core-contenthandler_text_translation:book_code", i18nRef.current)}
                            onChange={(event) => {
                                setBookCode(event.target.value);
                            }}
                            sx={sx.select}
                        >
                            {bookCodes.map(
                                (listItem, n) => (
                                    <MenuItem
                                        key={n}
                                        value={listItem}
                                        dense
                                    >
                                        <ListMenuItem
                                            listItem={`${listItem} - ${doI18n(
                                                `scripture:books:${listItem}`,
                                                i18nRef.current
                                            )}`}
                                        />
                                    </MenuItem>
                                )
                            )}
                        </Select>
                    </FormControl>
                </DialogContent>
                <PanDialogActions
                    closeFn={() => handleClose()}
                    closeLabel={doI18n("pages:core-contenthandler_text_translation:close", i18nRef.current)}
                    actionFn={handleDelete}
                    closeOnAction={false}
                    actionLabel={doI18n("pages:core-contenthandler_text_translation:delete_button", i18nRef.current)}
                />
            </PanDialog>
            {/* Error Dialog */}
            <ErrorDialog setErrorDialogOpen={setErrorDialogOpen} handleClose={handleClose} errorDialogOpen={errorDialogOpen} errorMessage={errorMessage} />
        </Box>
    );
}