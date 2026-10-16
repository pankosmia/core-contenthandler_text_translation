import { createRoot } from "react-dom/client";
import { SpaContainer } from "pankosmia-rcl";
import { createHashRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import NewBibleContent from "./pages/NewTextTranslationContent";
import NewTextTranslationBook from "./pages/NewTextTranslationBook";
import UsfmExport from "./pages/Export/UsfmExport";
import PdfGenerate from "./pages/Export/PdfGenerate";
import UsfmImport from "./pages/Import/UsfmImport";
import App from "./App";
import { styled } from "@mui/material";
import { SnackbarProvider, MaterialDesignContent } from "notistack";
import MuncherTest from "./pages/MuncherTest";
const router = createHashRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/createDocument/textTranslation",
    element: <NewBibleContent />,
  },
  {
    path: "newBook",
    element: <NewTextTranslationBook />,
  },
  {
    path: "importBook",
    element: <UsfmImport />,
  },
  {
    path: "/export/usfm",
    element: <UsfmExport />,
  },
  {
    path: "/export/pdf",
    element: <PdfGenerate />,
  },
  {
    path: "MuncherTest",
    element: <MuncherTest />,
  },
]);
function AppLayout() {
  const CustomSnackbarContent = styled(MaterialDesignContent)(() => ({
    "&.notistack-MuiContent-error": {
      backgroundColor: "#FDEDED",
      color: "#D32F2F",
    },
    "&.notistack-MuiContent-info": {
      backgroundColor: "#E5F6FD",
      color: "#0288D1",
    },
    "&.notistack-MuiContent-warning": {
      backgroundColor: "#FFF4E5",
      color: "#EF6C00",
    },
    "&.notistack-MuiContent-success": {
      backgroundColor: "#EDF7ED",
      color: "#2E7D32",
    },
  }));
  return (
    <SnackbarProvider
      Components={{
        error: CustomSnackbarContent,
        info: CustomSnackbarContent,
        warning: CustomSnackbarContent,
        success: CustomSnackbarContent,
      }}
      maxSnack={6}
    >
      <SpaContainer>
        <RouterProvider router={router} />
      </SpaContainer>
    </SnackbarProvider>
  );
}
createRoot(document.getElementById("root")).render(<AppLayout />);
