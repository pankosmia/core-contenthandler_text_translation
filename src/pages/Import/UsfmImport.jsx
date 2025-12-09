import {useContext, useState} from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Tooltip
} from "@mui/material";
import {i18nContext, doI18n} from "pithekos-lib";
import { FilePicker } from 'react-file-picker';
import UploadFileIcon from '@mui/icons-material/UploadFile';

function UsfmImport() {

    const {i18nRef} = useContext(i18nContext);
    const [loading, setLoading] = useState(false);
    const [usfmImportAnchorEl, setUsfmImportAnchorEl] = useState(null);
    const usfmImportOpen = Boolean(usfmImportAnchorEl);
    const [localBookContent, setLocalBookContent] = useState();
    const [repoBooks, setRepoBooks] = useState([]);
    const [repoPath, setRepoPath] = useState([])

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
                setErrorMessage(`${doI18n("pages:core-contenthandler_text_translation:book_creation_error", i18nRef.current)}: ${response.status
                    }`);
                setErrorDialogOpen(true);
            };
        }
    };

    useEffect(() => {
        if (localBookContent && !repoBooks.includes(localBookContent.split("toc1")[0].split(" ")[1])){
            setBookCode(localBookContent.split("toc1")[0].split(" ")[1]);
            setBookTitle(localBookContent.split("\\toc2")[0].split("\\toc1")[1].split(" ")[1]);
            setBookAbbr(localBookContent.split("toc1")[0].split(" ")[1]);
        }
    },[localBookContent])
  
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
              open={usfmImportOpen}
              onClose={() => {setLocalBookContent(null); setUsfmImportAnchorEl(null)}}
              slotProps={{
                  paper: {
                      component: 'form',
                  },
              }}
          >
            <DialogTitle sx={{ backgroundColor: 'secondary.main' }}><b>{doI18n("pages:core-contenthandler_text_translation:import_content", i18nRef.current)}</b></DialogTitle>
            <DialogContent sx={{ mt: 1 }}>
                <FilePicker
                  extensions={['usfm', 'sfm', 'txt']}
                  onChange={handleFilePicked}
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
                    {loading ? 'Reading File...' : doI18n("pages:core-contenthandler_text_translation:import", i18nRef.current)}
                  </Button>
                </FilePicker>    
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {setLocalBookContent(null); setUsfmImportAnchorEl(null)}}>
                    {doI18n("pages:core-contenthandler_text_translation:cancel", i18nRef.current)}
                </Button>
                <Tooltip open={localBookContent ? repoBooks.includes(localBookContent.split("toc1")[0].split(" ")[1]) : false} title="Book already exists">
                  <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        handleCreateLocalBook(localBookContent, repoPath)
                        setUsfmImportAnchorEl(null);
                      }}
                      disabled={localBookContent ? repoBooks.includes(localBookContent.split("toc1")[0].split(" ")[1]) : false}
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