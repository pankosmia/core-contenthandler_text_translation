import {useContext, useState, useEffect} from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Tooltip,
    Box,
    AppBar,
    Toolbar,
    Typography
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import {i18nContext, doI18n, getJson, debugContext, postJson, Header} from "pithekos-lib";
import { FilePicker } from 'react-file-picker';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import {Proskomma} from "proskomma-core";

function UsfmImport() {

    const {i18nRef} = useContext(i18nContext);
    const {debugRef} = useContext(debugContext);
    const [loading, setLoading] = useState(false);
    const [usfmImportAnchorEl, setUsfmImportAnchorEl] = useState(true);
    const usfmImportOpen = Boolean(usfmImportAnchorEl);
    const [filePicked, setFilePicked] = useState({});
    const [localBookContent, setLocalBookContent] = useState();
    const [repoBooks, setRepoBooks] = useState([]);
    const [repoPath, setRepoPath] = useState([]);
    const [isUsfmValid, setIsUsfmValid] = useState(false);
    const [validationResult, setValidationResult] =  useState({});
    const pk = new Proskomma();
    const initialQuery = `{
        id
        processor
        documents {
          id
          book: header(id: "bookCode")
          title: header(id: "toc")
          mainBlocksText
        }
      }`;

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
            setRepoBooks(bookCode);
        } else {
            console.error(`${doI18n("pages:core-contenthandler_text_translation:error_data", i18nRef.current)}`);
        }
    };

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
        setUsfmImportAnchorEl(false);
        setTimeout(() => {
            window.location.href = '/clients/content';
        },500);
    };

    const handleCreateLocalBook = async (localBookContent, repoPath) => {
        if (!repoBooks.includes(localBookContent.split("toc1")[0].split(" ")[1])){
            const response = await postJson(
                `/burrito/ingredient/raw/${repoPath}?ipath=${`${localBookContent.split("toc1")[0].split(" ")[1]}.usfm`}&update_ingredients`,
                JSON.stringify({"payload": localBookContent}),
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
        }
    };

    useEffect(
        () => {
            getProjectSummaries();
        },
        []
    );

    const usfmValidation = (file) => {
        const regexForBookAbbr = /^\\id [A-Z0-9]{3}.*$/m;
        if (regexForBookAbbr.test(file) && file.includes("\\mt") && file.includes("\\c") && file.includes("\\v")){
            setIsUsfmValid(true);
        } else {
            setIsUsfmValid(false);
        }
    };

    useEffect(() => {
        if (localBookContent){

            usfmValidation(localBookContent);
        }
    },[localBookContent])

    useEffect(() => {
        if (isUsfmValid){
            try {
                pk.importDocument({lang: "eng", abbr: `${localBookContent.split("toc1")[0].split(" ")[1]}`}, `${filePicked.name.split(".")[1]}`, localBookContent);
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
    },[isUsfmValid])
  
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
          <Dialog
              fullWidth={true}
              open={usfmImportOpen}
              onClose={() => {setLocalBookContent(null); setUsfmImportAnchorEl(null); handleClose()}}
              sx={{
                backdropFilter: "blur(3px)",
              }}
              slotProps={{
                  paper: {
                      component: 'form'
                  }
              }}
          >
            <AppBar
                color="secondary"
                sx={{
                    position: "relative",
                    borderTopLeftRadius: 4,
                    borderTopRightRadius: 4,
                }}
            >
                <Toolbar>
                    <Typography variant="h6" component="div">
                        {doI18n("pages:core-contenthandler_text_translation:import_content", i18nRef.current)}
                    </Typography>
                </Toolbar>
            </AppBar>
            <DialogContent sx={{ mt: 1 }}>
                <FilePicker
                  extensions={['usfm', 'sfm', 'txt']}
                  onChange={(file) => {handleFilePicked(file); setFilePicked(file)}}
                  onError={error => {console.error(error); setLoading(false);}}
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
                </FilePicker>
                {Object.keys(validationResult).length > 0 && <div><pre>{JSON.stringify(validationResult, null, 2)}</pre></div> }
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {setLocalBookContent(null); setUsfmImportAnchorEl(null); handleClose()}}>
                    {doI18n("pages:core-contenthandler_text_translation:cancel", i18nRef.current)}
                </Button>
                <Tooltip 
                    open={localBookContent ? (repoBooks.includes(localBookContent.split("toc1")[0].split(" ")[1]) || !isUsfmValid) : false} 
                    title={!isUsfmValid ? doI18n("pages:core-contenthandler_text_translation:usfm_invalid", i18nRef.current) : doI18n("pages:core-contenthandler_text_translation:book_already_exists", i18nRef.current)}
                    placement="top-end"
                >
                  <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        handleCreateLocalBook(localBookContent, repoPath)
                        setUsfmImportAnchorEl(null);
                      }}
                      disabled={localBookContent ? (repoBooks.includes(localBookContent.split("toc1")[0].split(" ")[1]) || !isUsfmValid) : false}
                  >
                    {doI18n("pages:core-contenthandler_text_translation:create", i18nRef.current)}
                  </Button>
                </Tooltip>
            </DialogActions>
        </Dialog>
      </Box>
    );
}

export default UsfmImport;