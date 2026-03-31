import { useContext, useState, useEffect } from 'react';
import {
    Button,
    DialogContent,
    Tooltip,
    Box,
    Typography,
    Stack
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import {doI18n, getJson,  postJson} from "pithekos-lib";
import {i18nContext, debugContext, Header} from "pankosmia-rcl";
import { FilePicker } from 'react-file-picker';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Proskomma } from "proskomma-core";
import { PanDialog, PanDialogActions } from "pankosmia-rcl";

function OptionUsfmImport() {
    const { i18nRef } = useContext(i18nContext);
    const { debugRef } = useContext(debugContext);
    const [loading, setLoading] = useState(false);
    const [usfmImportAnchorEl, setUsfmImportAnchorEl] = useState(true);
    const usfmImportOpen = Boolean(usfmImportAnchorEl);
    const [filePicked, setFilePicked] = useState({});
    const [localBookContent, setLocalBookContent] = useState();
    console.log("localBookContent",localBookContent)
    const [repoPath, setRepoPath] = useState([]);
    const [isUsfmValid, setIsUsfmValid] = useState(false);
    const [validationResult, setValidationResult] = useState({});
    const [bookIsDuplicate, setBookIsDuplicate] = useState(false);
    const [nameProject, setNameProject] = useState("")
    const pk = new Proskomma();
    const initialQuery = `{
        documents {
          id
          headers {key value}
          cvIndexes {
            chapter
          }
        }
      }`;
    const bookCode = Object.keys(validationResult).length > 0 ? validationResult.data.documents[0].headers?.find(header => header.key === 'bookCode') : {};
    const title = Object.keys(validationResult).length > 0 ? validationResult.data.documents[0].headers?.find(header => header.key === 'h') : {};
    const cvIndexes = Object.keys(validationResult).length > 0 ? validationResult.data.documents[0].cvIndexes : [];


    const handleFilePicked = (fileFromPicker) => {
        setValidationResult({});
        const reader = new FileReader();
        reader.onloadstart = () => {
            setLoading(true);
        };
        reader.onload = (event) => {
            const fileContent = event.target.result;
            setLocalBookContent(fileContent);
            setLoading(false);
        };
        reader.onerror = (error) => {
            console.error("Error reading file:", error);
            setLoading(false);
        };
        reader.readAsText(fileFromPicker);
    };

    const handleCloseCreate = async () => {
        setUsfmImportAnchorEl(false);
        setTimeout(() => {
            window.location.href = '/clients/content';
        }, 500);
    };

    const handleCreateLocalBook = async (localBookContent, repoPath) => {
            const response = await postJson(
                `/burrito/ingredient/raw/${repoPath}?ipath=${`${localBookContent.split("toc1")[0].split(" ")[1]}.usfm`}&update_ingredients`,
                JSON.stringify({ "payload": localBookContent }),
                debugRef.current
            );
            if (response.ok) {
                enqueueSnackbar(doI18n("pages:core-contenthandler_text_translation:book_created", i18nRef.current), {
                    variant: "success",
                });
                handleCloseCreate();
            } else {
                enqueueSnackbar(`${doI18n("pages:core-contenthandler_text_translation:book_creation_error", i18nRef.current)}: ${response.status}`, { variant: "error" });
            };
    };


    const usfmValidation = (file) => {
        const regexForBookAbbr = /^\\id [A-Z0-9]{3}.*$/m;
        setIsUsfmValid(regexForBookAbbr.test(file) && file.includes("\\mt") && file.includes("\\c") && file.includes("\\v"));
    };

    useEffect(() => {
        if (localBookContent) {
            usfmValidation(localBookContent);
        }
    }, [localBookContent]);


    useEffect(() => {
        if (isUsfmValid) {

            try {
                pk.importDocument({ lang: "eng", abbr: `${localBookContent.split("toc1")[0].split(" ")[1]}` }, `${filePicked.name.split(".")[1]}`, localBookContent);
                try {
                    const res = pk.gqlQuerySync(initialQuery);

                    setValidationResult(res);
                } catch (error) {
                    console.error("An error occurred while a query on the instance:", error.message);
                }
            } catch (error) {
                console.error("An error occurred while validating the USFM:", error.message);
            }

        }

    }, [localBookContent, isUsfmValid])

    return (
        <Box>
            <PanDialog
                isOpen={usfmImportOpen}
                closeFn={() => { setLocalBookContent(null); setUsfmImportAnchorEl(null); }}
                titleLabel={`${doI18n("pages:core-contenthandler_text_translation:import_content", i18nRef.current)} - ${nameProject}`}>
                <DialogContent sx={{ mt: 1 }}>
                    <FilePicker
                        extensions={['usfm', 'sfm', 'txt']}
                        onChange={(file) => { handleFilePicked(file); setFilePicked(file) }}
                        onError={error => { enqueueSnackbar(`${error}`, { variant: "error", }); setLoading(false); }}
                    >
                        <Tooltip
                            open={localBookContent ? (bookIsDuplicate || !isUsfmValid) : false}
                            title={!isUsfmValid ? doI18n("pages:core-contenthandler_text_translation:usfm_invalid", i18nRef.current) : doI18n("pages:core-contenthandler_text_translation:book_already_exists", i18nRef.current)}
                            placement="bottom-end"
                        >
                            <Button
                                type="button"
                                disabled={loading}
                                variant="contained"
                                color="primary"
                                component="span"
                                startIcon={<UploadFileIcon />}
                            >
                                {loading ? 'Reading File...' : (filePicked.name ? filePicked.name : doI18n("pages:core-contenthandler_text_translation:import_click", i18nRef.current))}
                            </Button>

                        </Tooltip>
                    </FilePicker>
                    {(Object.keys(validationResult).length > 0 && !bookIsDuplicate) &&
                        <Stack spacing={2} sx={{ mt: 0.5 }}>
                            <Typography variant="body1">
                                {`Book Code: ${JSON.stringify(bookCode?.value, null, 2)}`}
                            </Typography>
                            <Typography variant="body1">
                                {`Title: ${JSON.stringify(title?.value, null, 2)}`}
                            </Typography>
                            <Typography variant="body1">
                                {`Chapters from ${JSON.stringify(cvIndexes[0]?.chapter, null, 2)} to ${JSON.stringify(cvIndexes[cvIndexes.length - 1]?.chapter, null, 2)}`}
                            </Typography>
                        </Stack>
                    }

                </DialogContent>
                <PanDialogActions
                    closeFn={() => { setLocalBookContent(null); setUsfmImportAnchorEl(null)}}
                    closeLabel={doI18n("pages:core-contenthandler_text_translation:cancel", i18nRef.current)}
                    actionFn={() => {
                        handleCreateLocalBook(localBookContent, repoPath)
                        setUsfmImportAnchorEl(null);
                    }}
                    closeOnAction={false}
                    actionLabel={doI18n("pages:core-contenthandler_text_translation:create", i18nRef.current)}
                    isDisabled={localBookContent ? (bookIsDuplicate || !isUsfmValid) : true}
                />
            </PanDialog>
        </Box>
    );
}
export default OptionUsfmImport;