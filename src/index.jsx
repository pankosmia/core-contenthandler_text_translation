import {createRoot} from "react-dom/client";
import {SpaContainer} from "pithekos-lib";
import {createHashRouter, RouterProvider} from "react-router-dom";
import './index.css';
import NewBibleContent from "./pages/NewTextTranslationContent";
import NewTextTranslationBook from "./pages/NewTextTranslationBook";
import UsfmExport from "./pages/Export/UsfmExport";
import PdfGenerate from "./pages/Export/PdfGenerate";
import UsfmImport from "./pages/Import/UsfmImport";
import App from "./App";
import NameDocument from "./TextTranslationContent/NameDocument";

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
        path: "/createDocument/textTranslation/nameDocument",
        element: <NameDocument/>
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