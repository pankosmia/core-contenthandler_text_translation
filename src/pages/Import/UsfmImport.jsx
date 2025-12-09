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

function UsfmImport({open, closeFn, localBookContent, setLocalBookContent, handleCreateLocalBook, repoPath, repoBooks}) {

    const {i18nRef} = useContext(i18nContext);
    const [loading, setLoading] = useState(false);

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
  
    return <Dialog
        open={open}
        onClose={() => {setLocalBookContent(null); closeFn()}}
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
            <Button onClick={() => {setLocalBookContent(null); closeFn()}}>
                {doI18n("pages:core-contenthandler_text_translation:cancel", i18nRef.current)}
            </Button>
            <Tooltip open={localBookContent ? repoBooks.includes(localBookContent.split("toc1")[0].split(" ")[1]) : false} title="Book already exists">
              <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    handleCreateLocalBook(localBookContent, repoPath)
                    closeFn();
                  }}
                  disabled={localBookContent ? repoBooks.includes(localBookContent.split("toc1")[0].split(" ")[1]) : false}
              >
                {doI18n("pages:core-contenthandler_text_translation:create", i18nRef.current)}
              </Button>
            </Tooltip>
        </DialogActions>
    </Dialog>;
}

export default UsfmImport;