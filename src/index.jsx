import {createRoot} from "react-dom/client";
import {SpaContainer} from "pankosmia-rcl";
import {createHashRouter, RouterProvider} from "react-router-dom";
import './index.css';
import NewBibleContent from "./pages/NewTextTranslationContent";
import NewTextTranslationBook from "./pages/NewTextTranslationBook";
import UsfmExport from "./pages/Export/UsfmExport";
import PdfGenerate from "./pages/Export/PdfGenerate";
import UsfmImport from "./pages/Import/UsfmImport";
import App from "./App";
import DeleteTextTranslationBook from "./pages/DeleteTextTranslationBook";

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
        path:"deleteBook",
        element:<DeleteTextTranslationBook/>
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