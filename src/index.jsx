import {createRoot} from "react-dom/client";
import {SpaContainer} from "pithekos-lib";
import {createHashRouter, RouterProvider} from "react-router-dom";
import './index.css';
import NewBibleContent from "./pages/NewTextTranslationContent";
import NewTextTranslationBook from "./pages/NewTextTranslationBook";
import ZipExport from "./pages/Export/ZipExport";
import UsfmExport from "./pages/Export/UsfmExport";
import PdfGenerate from "./pages/Export/PdfGenerate";
import UsfmImport from "./pages/Import/UsfmImport";
import App from "./App";

const router = createHashRouter([
    {
        path:"/",
        element:<App/>
    },
    {
        path: "/createDocument/textTranslation",
        element: <NewBibleContent/>
    },
    {
        path:"newBook",
        element:<NewTextTranslationBook/>
    },
    {
        path:"importBook",
        element:<UsfmImport/>
    },
    {
        path:"/export/zip",
        element:<ZipExport/>
    },
    {
        path:"/export/usfm",
        element:<UsfmExport/>
    },
    {
        path:"/export/pdf",
        element:<PdfGenerate/>
    }
]);

createRoot(document.getElementById("root"))
    .render(
        <SpaContainer>
            <RouterProvider router={router}/>
        </SpaContainer>
    );