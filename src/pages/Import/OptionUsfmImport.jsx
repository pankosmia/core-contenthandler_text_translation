import { useContext, useState, useEffect } from 'react';
import {
    Button,
    Tooltip,
    Box,
    Grid2,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemIcon
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { doI18n } from "pithekos-lib";
import { i18nContext } from "pankosmia-rcl";
import { FilePicker } from 'react-file-picker';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Proskomma } from "proskomma-core";
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

function OptionUsfmImport({ localBookContent, setLocalBookContent, isUsfmValid, setIsUsfmValid }) {
    const { i18nRef } = useContext(i18nContext);
    const [loading, setLoading] = useState(false);
    const [filePicked, setFilePicked] = useState({});
    const [validationResult, setValidationResult] = useState({});

    //const [bookIsDuplicate, setBookIsDuplicate] = useState(false);

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


    const usfmValidation = (file) => {
        const regexForBookAbbr = /^\\id [A-Z0-9]{3}.*$/m;
        setIsUsfmValid(regexForBookAbbr.test(file) && ((file.includes("\\mt") && file.includes("\\c") && file.includes("\\v")) || file.includes("\\imt")));
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

    const handleDeleteUsfmFile = () => {
        setLocalBookContent();
        setFilePicked({});
        setValidationResult({});
        setIsUsfmValid(false)
    }
    return (
        <Box>

            <FilePicker
                extensions={['usfm', 'sfm', 'txt']}
                onChange={(file) => { handleFilePicked(file); setFilePicked(file) }}
                onError={error => { enqueueSnackbar(`${error}`, { variant: "error", }); setLoading(false); }}
            >
                <Tooltip
                    //open={localBookContent ? !isUsfmValid : isUsfmValid}
                    title={localBookContent ? (isUsfmValid && doI18n("pages:core-contenthandler_text_translation:change_usfm_file", i18nRef.current)) : (!isUsfmValid && doI18n("pages:core-contenthandler_text_translation:usfm_invalid", i18nRef.current))}
                    placement="bottom-end"
                >
                    <span>
                        <Button
                            type="button"
                            disabled={loading || isUsfmValid}
                            variant="contained"
                            color="primary"
                            component="span"
                            startIcon={<UploadFileIcon />}
                        >
                            {doI18n("pages:core-contenthandler_text_translation:import_click", i18nRef.current)}
                        </Button>
                    </span>
                </Tooltip>
            </FilePicker>

            {Object.keys(validationResult).length > 0 &&
                <Grid2 item xs={12} md={6}>
                    <List>
                        <ListItem
                            secondaryAction={
                                <IconButton edge="end" aria-label="delete" onClick={handleDeleteUsfmFile}>
                                    <DeleteOutlinedIcon />
                                </IconButton>
                            }
                        >
                            <ListItemIcon>
                                {loading ? "" : <CheckOutlinedIcon />}
                            </ListItemIcon>

                            <ListItemText
                                primary={filePicked.name}
                                secondary={loading ? 'loading' : 'complete'}
                            />
                        </ListItem>
                    </List>
                </Grid2>
            }
        </Box >
    );
}
export default OptionUsfmImport;