import {useContext, useState, useEffect} from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from "@mui/material";
import {i18nContext, doI18n} from "pithekos-lib";
import { FilePicker } from 'react-file-picker'

function ZipImport({open, closeFn, localBookContent, setLocalBookContent, handleCreateLocalBook, repoPath}) {

    const {i18nRef} = useContext(i18nContext);
   /*  const [content, setContent] = useState(null); */
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
        onClose={closeFn}
        slotProps={{
            paper: {
                component: 'form',
            },
        }}
    >
        <DialogTitle sx={{ backgroundColor: 'secondary.main' }}><b>{doI18n("pages:content:import_content", i18nRef.current)}</b></DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
            <DialogContentText>
              {/* <input
                type='file'
                accept='.zip'
                onChange={onChange}
              /> */}
            </DialogContentText>
            <FilePicker
              extensions={['usfm']}
              onChange={handleFilePicked}
              onError={error => {console.error(error); setLoading(false);}}
            >
              <button type="button" disabled={loading}>
                {loading ? 'Reading File...' : doI18n("pages:content:import", i18nRef.current)}
              </button>
            </FilePicker>
            {/* <Button
                variant="contained"
                color="primary"
                onClick={() => {
                    newClick();
                    onSubmit();
                }}
            >
              {doI18n("pages:content:import", i18nRef.current)}
            </Button> */}
            
            
        </DialogContent>
        <DialogActions>
            <Button onClick={closeFn}>
                {doI18n("pages:content:cancel", i18nRef.current)}
            </Button>
            <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  handleCreateLocalBook(localBookContent, repoPath)
                  closeFn();
                }}
            >
              {doI18n("pages:content:import", i18nRef.current)}
            </Button>
        </DialogActions>
    </Dialog>;
}

export default ZipImport;