import { createRoot } from "react-dom/client";
import { SpaContainer } from "pankosmia-rcl";
import { createHashRouter, RouterProvider } from "react-router-dom";
import './index.css';
import NewBibleContent from "./pages/NewTextTranslationContent";
import NewTextTranslationBook from "./pages/NewTextTranslationBook";
import UsfmExport from "./pages/Export/UsfmExport";
import PdfGenerate from "./pages/Export/PdfGenerate";
import UsfmImport from "./pages/Import/UsfmImport";
import App from "./App";
import DeleteTextTranslationBook from "./pages/DeleteTextTranslationBook";
import { ThemeProvider } from "@emotion/react";
import { useEffect, useState } from "react";
import { getAndSetJson } from "pithekos-lib";
import { createTheme } from "@mui/material";
import { SnackbarProvider } from "notistack";

const router = createHashRouter([
    {
        path: "/",
        element: <App />
    },
    {
        path: "/createDocument/textTranslation",
        element: <NewBibleContent />
    },
    {
        path: "newBook",
        element: <NewTextTranslationBook />
    },
    {
        path: "deleteBook",
        element: <DeleteTextTranslationBook />
    },
    {
        path: "importBook",
        element: <UsfmImport />
    },
    {
        path: "/export/usfm",
        element: <UsfmExport />
    },
    {
        path: "/export/pdf",
        element: <PdfGenerate />
    }
]);
function AppLayout() {

    const [themeSpec, setThemeSpec] = useState({
        palette: {
            primary: {
                main: "#666",
            },
            secondary: {
                main: "#888",
            },
        },
    });

    useEffect(() => {
        if (
            themeSpec.palette &&
            themeSpec.palette.primary &&
            themeSpec.palette.primary.main &&
            themeSpec.palette.primary.main === "#666"
        ) {
            getAndSetJson({
                url: "/app-resources/themes/default.json",
                setter: setThemeSpec,
            }).then();
        }
    }, []);

    console.log(themeSpec);

    const theme = createTheme(themeSpec);
    return <ThemeProvider theme={theme}>
            <SpaContainer>
                <RouterProvider router={router} />
            </SpaContainer>
    </ThemeProvider>
}
createRoot(document.getElementById("root"))
    .render(
        <AppLayout />
    );