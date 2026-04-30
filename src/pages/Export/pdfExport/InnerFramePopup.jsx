import { useState, useEffect, useContext } from "react";
// import {PdfGen} from "jxl-pdf"
import { getJson, doI18n } from "pithekos-lib";
import { debugContext } from "pankosmia-rcl";
import "react-pdf/dist/Page/TextLayer.css";
import { Modal, Button, Input, DialogContent, Box, Grid2, AppBar, Toolbar, Typography, Card, CardContent, CardActionArea, IconButton } from "@mui/material";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { v4 as uuidv4 } from "uuid";
import { useLocation } from "react-router-dom";
import {
  TextOnlyTooltip,
  StyledSwitch,
} from "./fieldPicker/customMuiComponent";
import { WrapperTemplate } from "./WrapperTemplate";
import { SelectOption } from "./SelectOptions";

import { Add, ExpandMore } from "@mui/icons-material";
import { PanDialog, PanDialogActions, i18nContext, Header } from "pankosmia-rcl";
import Bcv from "../pdfExport/icons/sectionIcons/bcv";
import fontsJson from '../pdfExport/fieldPicker/fonts.json';

// import localForage from 'localforage';
// import readLocalResources from '@/components/Resources/useReadLocalResources';
// import packageInfo from '../../../../package.json';

export function findProjectInfo(meta, autoGrapha) {
  return autoGrapha?.filter((a) => a.path === meta)[0];
}

function changeMetaDataToWrapperSection(meta, autoGrapha) {
  const projInfo = findProjectInfo(meta, autoGrapha);
  if (projInfo.type === "Text Translation") {
    return {
      0: {
        type: "bcvWrapper",
        id: uuidv4(),
        content: {
          content: { 0: { type: "null", content: {} } },
          order: [0],
        },
      },
    };
  }
  if (projInfo.type === "OBS") {
    return {
      0: {
        type: "obsWrapper",
        id: uuidv4(),
        content: {
          content: { 0: { type: "null", content: {} } },
          order: [0],
        },
      },
    };
  }
  if (projInfo.type === "Juxtalinear") {
    return {
      0: {
        type: "bcvWrapper",
        id: uuidv4(),
        content: {
          content: { 0: { type: "null", content: {} } },
          order: [0],
        },
      },
    };
  }
}

function messageToPeople(json) {
  let message = "";
  for (let i = 0; i < json.level; i++) {
    message += "\t";
  }
  if (json.type === "step") {
    message += `Starting step ${json.args[0]}`;
  } else if (json.type === "section") {
    message += `Starting to prepare ${json.args[0]}`;
  } else if (json.type === "wrappedSection") {
    message += `Preparing section of type ${json.args[0]} from ${json.args[1].split("-")[0]}`;
    if (json.args[1].split("-")[1]) {
      message += ` to ${json.args[1].split("-")[1]}`;
    }
  } else if (json.type === "pdf") {
    message += `Writing pdf of ${json.args[1]}`;
  } else {
    findProjectInfo();
    message += json.msg;
  }
  return message;
}

// function createSection(folder, pickerJson) {
//   const path = require("path");
//   const fs = window.require("fs");
//   const fixedPath = fixPath(folder);

//   let projects;
//   try {
//     if (!fs.existsSync(fixedPath)) {
//       fs.mkdirSync(fixedPath);
//     }
//     projects = fs.readdirSync(fixedPath);
//   } catch (err) {
//     // logger.error("InnerFramePopup.js", `Error reading project dir: ${err}`);
//   }

//   let currentMetadataPath = "";
//   // eslint-disable-next-line
//   for (const project of projects) {
//     currentMetadataPath = fixPath(
//       path.join(fixedPath, project, "metadata.json"),
//     );
//     if (fs.existsSync(currentMetadataPath)) {
//       const jsontest = fs.readFileSync(currentMetadataPath, "utf-8");
//       const jsonParse = JSON.parse(jsontest);
//       // let projectS, jsonParseIngre;

//       // if (jsonParse.identification?.name.en) {
//       //   jsonParseIngre = jsonParse.ingredients;
//       //   projectS = `[${ jsonParse.identification.name.en }]`;
//       // } else {
//       //   jsonParseIngre = jsonParse.meta.ingredients;
//       //   projectS = `[${ jsonParse.meta.full_name }]`;
//       // }

//       let fileName;
//       if (jsonParse?.type?.flavorType?.flavor?.name === "textTranslation") {
//         if (jsonParse.resourceMeta) {
//           pickerJson.book[jsonParse.resourceMeta?.full_name] = {
//             description: `${jsonParse.resourceMeta?.full_name}`,
//             language: `${jsonParse.resourceMeta?.language}`,
//             src: {
//               type: "fs",
//               path: fixedPath.includes("projects")
//                 ? path.join(`${fixedPath}`, `${project}`, "ingredients")
//                 : path.join(`${fixedPath}`, `${project}`),
//             },
//             books: [],
//           };
//         } else if (jsonParse.identification) {
//           pickerJson.book[
//             jsonParse.identification.name[jsonParse.languages[0].tag]
//           ] = {
//             description: `${jsonParse.identification.name[jsonParse.languages[0].tag]}`,
//             language: `${jsonParse.languages[0].tag}`,
//             src: {
//               type: "fs",
//               path: fixedPath.includes("projects")
//                 ? path.join(`${fixedPath}`, `${project}`, "ingredients")
//                 : path.join(`${fixedPath}`, `${project}`),
//             },
//             books: [],
//           };
//         }
//       } else if (jsonParse?.type?.flavorType?.flavor?.name === "textStories") {
//         fileName = "content";
//         pickerJson.OBS[`OBS ${jsonParse.resourceMeta?.full_name}`] = {
//           description: `OBS ${jsonParse.resourceMeta?.full_name}`,
//           language: jsonParse.meta.defaultLocale,
//           src: {
//             type: "fs",
//             path: fixedPath.includes("projects")
//               ? path.join(`${fixedPath}`, `${project}`, "ingredients")
//               : path.join(`${fixedPath}`, `${project}`, `${fileName}`),
//           },
//           books: [],
//         };
//       } else if (jsonParse?.meta?.repo?.flavor_type === "parascriptural") {
//         fileName = "content";
//         pickerJson.tNotes[`tNotes ${jsonParse.meta.repo.full_name}`] = {
//           description: `tNotes ${jsonParse.meta.repo.full_name}`,
//           language: jsonParse.meta.defaultLocale,
//           src: {
//             type: "fs",
//             path: fixedPath.includes("projects")
//               ? path.join(`${fixedPath}`, `${project}`, "ingredients")
//               : path.join(`${fixedPath}`, `${project}`),
//           },
//           books: [],
//         };
//       } else if (
//         jsonParse?.type?.flavorType?.flavor?.name === "x-juxtalinear"
//       ) {
//         fileName = "content";
//         pickerJson.jxl[Object.values(jsonParse.identification.name)[0]] = {
//           description: `${Object.values(jsonParse.identification.name)[0]}`,
//           language: jsonParse.languages[0]
//             ? jsonParse.languages[0].name.en
//             : "French",
//           src: {
//             type: "fs",
//             path: fixedPath.includes("projects")
//               ? path.join(`${fixedPath}`, `${project}`, "ingredients")
//               : path.join(`${fixedPath}`, `${project}`),
//           },
//           books: jsonParse.type.flavorType.currentScope
//             ? Object.keys(jsonParse.type.flavorType.currentScope)
//             : [],
//         };
//       }
//     }
//   }
// }

function transformPrintDataToKitchenFaucet(jsonData) {
  // console.log("jsonData ==", jsonData)
  const kitchenFaucet = [];
  if (jsonData.content) {
    for (let i = 0; i < jsonData.order.length; i++) {
      const currentWrapper = jsonData.content[jsonData.order[i]];

      const elem = { ...currentWrapper };
      if (!elem.ranges) {
        if (elem.type === "obsWrapper") {
          elem.ranges = ["1-50"];
        }
      }
      delete elem.content;
      elem.sections = [];
      if (currentWrapper.content.order) {
        for (let j = 0; j < currentWrapper.content.order.length; j++) {
          const section = {
            ...currentWrapper.content.content[currentWrapper.content.order[j]],
          };
          const source = section.source;
          delete section.source;
          if (section.type === "bookNote") {
            section.notes = source;
          } else if (
            section.type === "bcvBible" ||
            section.type === "paraBible"
          ) {
            section.content.scriptureSrc = source;
          } else if (section.type === "obs") {
            section.content.obs = source;
          }

          elem.sections.push(section);
        }
      }

      kitchenFaucet.push(elem);
    }
  }
  console.log(kitchenFaucet);
  return { global: jsonData.metaData, sections: kitchenFaucet };
}

function summariesToProjects(summaries) {
  return Object.entries(summaries).map(([key, value]) => {
    const parts = key.split("/");
    const id = parts[parts.length - 1];

    return {
      path: key,
      bookId: value.book_codes || "",
      name: value.name,
      id,
      type: mapFlavorToType(value.flavor),
    };
  });
}

function mapFlavorToType(flavor) {
  if (flavor === "textTranslation") return "Text Translation";
  if (flavor === "x-juxtalinear") return "Juxtalinear";
  if (flavor === "textStories") return "OBS";
  return "Unknown";
}

export default function InnerFramePopup() {
  const [listResourcesForPdf, setListResourcesForPdf] = useState({
    book: {},
    jxl: {},
    md: {},
    html: {},
    OBS: {},
    tNotes: {},
    "OBS-TN": {},
  });
  const { debugRef } = useContext(debugContext);
  const { i18nRef } = useContext(i18nContext);
  // fake selected project

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const selectedProject = params.get("repoPath")
  const [projectSummaries, setProjectSummaries] = useState(null);
  const [open, setOpen] = useState(true);

  // console.log(projectSummaries);
  const handleClose = async () => {
    setOpen(false);
    setTimeout(() => {
      window.location.href = '/clients/content';
    }, 500);
  };
  const getProjectSummaries = async () => {
    const summariesResponse = await getJson(
      "/burrito/metadata/summaries",
      debugRef.current,
    );
    if (summariesResponse.ok) {
      setProjectSummaries(summariesToProjects(summariesResponse.json));
    }
  };
  useEffect(() => {
    getProjectSummaries();
  }, []);

  const init = { bcvWrapper: ["bcvBible"], obsWrapper: ["obs"] };
  const initNames = { bcvWrapper: "Book/Chapter/Verse", obsWrapper: "OBS" };

  // const jsonWithHeaderChoice = PdfGen.pageInfo();

  const jsonWithHeaderChoice = {
    pages: ["Letter", "Legal", "A4", "Executive"],
    fonts: Object.entries(fontsJson).map(([key, value]) => value.label.en),
    label_fonts: Object.entries(fontsJson).map(([key, value]) => key),
    sizes: ["8pt", "9pt", "10pt", "12pt", "14pt"],
    verbose: ["true", "false"],
  };
  // use to know if we can drag or not
  const [update, setUpdate] = useState(true);
  const [doReset, setDoReset] = useState(true);
  // the order Of The Selected choice
  const [orderSelection, setOrderSelection] = useState([0]);
  // is the json is validate or not
  const [isJsonValidate, setIsJsonValidate] = useState(true);
  const [jsonValidation, setJsonValidation] = useState({});
  const [messagePrint, setMessagePrint] = useState("");
  // the actual kitchenFaucet
  const pdfCallBacks = (json) => {
    setMessagePrint((prev) => `${prev}\n${messageToPeople(json)}`);
  };

  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (selectedProject && projectSummaries) {
      setSelected(changeMetaDataToWrapperSection(selectedProject, projectSummaries));
    }
  }, [selectedProject, projectSummaries]);

  // advenceMode allow adding new Wrapper
  const [advanceMode, setAdvanceMode] = useState(false);
  const [infoProject, setInfoProject] = useState(null);
  useEffect(() => {
    if (selectedProject && projectSummaries) {
      setInfoProject(findProjectInfo(selectedProject, projectSummaries));
    }
  }, [selectedProject, projectSummaries]);

  
  // the selected headerInfo
  const [headerInfo, setHeaderInfo] = useState(
    '{"sizes":"9on11","fonts":"allGentium","pages":"EXECUTIVE", "verbose":"false"}',
  );
  let parseHeaderInfo = JSON.parse(headerInfo)

  // const [headerInfo, setHeaderInfo] = useState('{}');
  const [nameFile, setNameFile] = useState("");
  const [folder, setFolder] = useState(null);
  // zoom of the preview
  const [kitchenFaucet, setKitchenFaucet] = useState("{}");

  const [openModalAddWrapper, setOpenModalAddWrapper] = useState(false);

  const handleOpenModalAddWrapper = (isOpen) => {
    setOpenModalAddWrapper(isOpen);
  };
  const handleChangeHeaderInfo = (type, value) => {
    const data = JSON.parse(headerInfo);
    data[type] = value;
    setHeaderInfo(JSON.stringify(data));
  };

  const sortableListClassName = "sortable-TESTWRAPPER-list";
  const itemClassName = "sortable-test1-item";

  // This useEffect Allow the user to drag end drop element in a list (here the wrapper themSelf)
  // useEffect(() => {
  //   const sortableList = document.querySelector(`.${sortableListClassName}`);
  //   const items = sortableList.querySelectorAll(`.${itemClassName}`) ?? "";
  //   items.forEach((item) => {
  //     item.addEventListener("dragstart", () => {
  //       setTimeout(() => item.classList.add("dragging"), 0);
  //     });
  //     item.addEventListener("dragend", () => {
  //       item.classList.remove("dragging");
  //     });
  //   });
  //   const initSortableList = (e) => {
  //     if (update) {
  //       e.preventDefault();
  //       e.stopPropagation();
  //       const draggingItem = document.querySelector(
  //         `.${itemClassName}.dragging`,
  //       );
  //       if (!draggingItem) {
  //         return;
  //       }
  //       const siblings = [
  //         ...sortableList.querySelectorAll(`.${itemClassName}:not(.dragging)`),
  //       ];

  //       const nextSibling = siblings.find(
  //         (sibling) => e.clientY <= sibling.offsetTop + sibling.offsetHeight,
  //       );

  //       sortableList.insertBefore(draggingItem, nextSibling);
  //     }
  //   };

  //   sortableList.addEventListener("dragover", initSortableList);
  //   sortableList.addEventListener("dragenter", (e) => e.preventDefault());
  //   return () => {
  //     sortableList.removeEventListener("dragover", initSortableList);
  //     items.forEach((item) => {
  //       item.removeEventListener("dragstart", () => {
  //         setTimeout(() => item.classList.add("dragging"), 0);
  //       });
  //     });
  //   };
  // }, [update]);
  // useEffect(() => {
  //   const pickerJson = Object.keys(listResourcesForPdf).reduce(
  //     (a, v) => ({ ...a, [v]: {} }),
  //     {},
  //   );
  //   localForage
  //     .getItem('userProfile')
  //     .then(async (user) => {
  //       const path = require('path');
  //       const newpath = localStorage.getItem('userPath');
  //       const currentUser = user?.username;
  //       const folderProject = path.join(
  //         newpath,
  //         packageInfo.name,
  //         'users',
  //         `${currentUser}`,
  //         'projects',
  //       );
  //       setInfoProject((prev) => {
  //         const p = { ...prev };
  //         p.path = path.join(
  //           newpath,
  //           packageInfo.name,
  //           'users',
  //           `${currentUser}`,
  //           'projects',
  //           `${p.name}_${p.id[0]}`,
  //           'ingredients',
  //         );
  //         return p;
  //       });
  //       const folderRessources = path.join(
  //         newpath,
  //         packageInfo.name,
  //         'users',
  //         `${currentUser}`,
  //         'resources',
  //       );
  //       createSection(folderProject, pickerJson);
  //       createSection(folderRessources, pickerJson);
  //       return currentUser;
  //     })
  //     .then((currentUser) => {
  //       setListResourcesForPdf(pickerJson);
  //       return currentUser;
  //     })
  //     .then((currentUser) => readLocalResources(currentUser, () => { }));
  // }, []);

  useEffect(() => {
    setKitchenFaucet(
      JSON.stringify(
        transformPrintDataToKitchenFaucet({
          order: orderSelection,
          metaData: JSON.parse(headerInfo),
          content: selected,
        }),
      ),
    );
  }, [selected, headerInfo, orderSelection]);

  // useEffect(() => {
  //   const validationJson = global.PdfGenStatic.validateConfig(
  //     JSON.parse(kitchenFaucet),
  //   );
  //   setJsonValidation(validationJson);
  //   if (validationJson.length === 0) {
  //     const header = JSON.parse(headerInfo);
  //     if (
  //       header.workingDir &&
  //       folder &&
  //       header.sizes &&
  //       header.fonts &&
  //       header.pages
  //     ) {
  //       if (!header.outputPath && folder) {
  //         const path = window.require("path");
  //         setHeaderInfo((prev) => {
  //           const data = { ...JSON.parse(prev) };
  //           data.outputPath = path.join(
  //             `${folder}`,
  //             `${generate({ exactly: 5, wordsPerString: 1 }).join("-")}.pdf`,
  //           );
  //           data.verbose = false;
  //           return JSON.stringify(data);
  //         });
  //       }
  //       setIsJsonValidate(true);
  //     }
  //   } else {
  //     setIsJsonValidate(true);
  //   }
  // }, [selected, headerInfo, orderSelection, folder, kitchenFaucet]);

  // const openFileDialogSettingData = async () => {
  //   try {
  //     const options = {
  //       properties: ["openDirectory"],
  //     };
  //     const { dialog } = window.require("@electron/remote");
  //     const chosenFolder = await dialog.showOpenDialog(options);
  //     if (chosenFolder.canceled) {
  //       // Handle dialog cancel case
  //       // eslint-disable-next-line
  //       console.error("Dialog was canceled");
  //       return;
  //     }
  //     if (chosenFolder.filePaths.length > 0) {
  //       setFolder(chosenFolder.filePaths[0]);
  //     } else {
  //       // Handle case where no folder was selected
  //       // eslint-disable-next-line
  //       console.error("No folder was selected");
  //     }
  //   } catch (error) {
  //     // eslint-disable-next-line
  //     console.error("Error opening file dialog:", error);
  //   }
  // };

  // useEffect(() => {
  //   const path = window.require("path");
  //   if (folder && nameFile === "") {
  //     setHeaderInfo((prev) => {
  //       const data = { ...JSON.parse(prev) };
  //       data.outputPath = path.join(
  //         `${folder}`,
  //         `${generate({ exactly: 5, wordsPerString: 1 }).join("-")}.pdf`,
  //       );
  //       data.verbose = false;
  //       return JSON.stringify(data);
  //     });
  //   } else if (folder && nameFile !== "") {
  //     setHeaderInfo((prev) => {
  //       const data = { ...JSON.parse(prev) };
  //       data.outputPath = path.join(`${folder}`, `${nameFile}.pdf`);
  //       data.verbose = false;
  //       return JSON.stringify(data);
  //     });
  //   }
  // }, [folder]);

  // useEffect(() => {
  //   if (folder && nameFile !== "") {
  //     const path = window.require("path");
  //     setHeaderInfo((prev) => {
  //       const data = { ...JSON.parse(prev) };
  //       data.outputPath = path.join(`${folder}`, `${nameFile}.pdf`);
  //       data.verbose = false;
  //       return JSON.stringify(data);
  //     });
  //   }
  // }, [nameFile]);

  // useEffect(() => {
  //   const fs = window.require("fs");
  //   const os = window.require("os");
  //   const path = window.require("path");

  //   // Get the temporary directory of the system
  //   const tmpDir = os.tmpdir();
  //   fs.mkdtemp(`${tmpDir}${path.sep}`, (err, folder) => {
  //     if (err) {
  //       // eslint-disable-next-line
  //       console.error(err);
  //     } else {
  //       setHeaderInfo((prev) => {
  //         const data = { ...JSON.parse(prev) };
  //         data.workingDir = folder;
  //         return JSON.stringify(data);
  //       });
  //     }
  //   });
  // }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    const regex = /^[a-zA-Z_-]*$/; // Regular expression to allow only letters, underscores and dashes

    if (regex.test(value)) {
      setNameFile(value); // Update state only if the input matches the regex
    }
  };

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
        titleKey={`${doI18n("pages:content:title", i18nRef.current)}`}
        currentId="core-contenthandler_text_translation"
        requireNet={false}
      />
      <PanDialog titleLabel="PDF publisher" isOpen={true}>
        <AppBar position="static" sx={{ backgroundColor: "#f5f5f5" }}>
          <Toolbar>
            <Grid2 container alignItems="center" sx={{ width: "100%" }} justifyContent="space-between">
              <Grid2 container gap={1}>
                <Button size="large" color="secondary" variant="outlined">
                  OPEN PRESET
                </Button>
                <Button size="large" color="secondary" variant="outlined">
                  SAVE AS PRESET
                </Button>
              </Grid2>
              <Typography color="#000">preset_name</Typography>
            </Grid2>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <Grid2 container spacing={1} >
            <Grid2 size={8} container direction="column" spacing={1}>
              <Grid2 item >
                <SelectOption
                  title="Paper size"
                  type="pages"
                  option={jsonWithHeaderChoice.pages}
                  handleChange={handleChangeHeaderInfo}
                />
              </Grid2>
              <Grid2>
                <SelectOption
                  title="Font family"
                  type="fonts"
                  option={jsonWithHeaderChoice.label_fonts}
                  handleChange={handleChangeHeaderInfo}
                />
              </Grid2>
              <Grid2>
                <SelectOption
                  title="Font size"
                  type="sizes"
                  option={jsonWithHeaderChoice.sizes}
                  handleChange={handleChangeHeaderInfo}
                />
              </Grid2>
            </Grid2>
            <Grid2 size="auto">
              {Object.entries(fontsJson[parseHeaderInfo.fonts])
                .filter(([key]) => ["heading", "body", "body2", "greek", "footnote"].includes(key))
                .map(([key, value]) => (
                  <Typography sx={{ fontFamily:value }}>{key} : preview </Typography>
                ))}
            </Grid2>
            <Grid2 item size={12}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexDirection: "row",
                }}>
                <Typography variant="subtitle2"> Content</Typography>
                <Card sx={{ flexDirection: "row" }}>
                  <CardContent>
                    <IconButton sx={{ fontSize: 72 }}>
                      <Bcv />
                    </IconButton>

                    {/* <ul className="sortable-TESTWRAPPER-list">
                      {selected && infoProject && Object.keys(selected).map((k, i, arraySel) => (
                        <li
                          id={k}
                          className="sortable-test1-item"
                          draggable="true"
                          key={k}
                          style={{ margin: 10 }}
                        >
                          <WrapperTemplate
                            doReset={doReset}
                            setFinalPrint={setSelected}
                            projectInfo={infoProject}
                            wrapperType={selected[k].type}
                            keyWrapper={k}
                            setUpdate={setUpdate}
                            advanceMode={advanceMode}
                            changePrintData={setSelected}
                            changePrintOrder={setOrderSelection}
                            showTrashButton={arraySel.length > 1}
                          />
                        </li>
                      ))}
                    </ul>
                    {advanceMode ? (
                      <div
                        style={{
                          borderRadius: 6,
                          borderWidth: 1,
                          borderStyle: "solid",
                          borderCollor: "#EEEEEE",
                          display: "flex",
                          padding: 1,
                          flexDirection: "column",
                          alignItems: "flexStart",
                          alignSelf: "stretch",
                          backgroundColor: "#FCFAFA",
                          margin: 12,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            width: 80,
                            height: 28,
                            paddingLeft: 12,
                            borderRadius: 4,
                            paddingRight: 6,
                            justifyContent: "space-between",
                            alignItems: "center",
                            backgroundColor: "#F50",
                            color: "white",
                            cursor: "pointer",
                          }}
                          onClick={() => handleOpenModalAddWrapper(true)}
                        >
                          Add
                          <ExpandMore />
                        </div>
                      </div>
                    ) : (
                      <div />
                    )}

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        padding: 15,
                        gap: 12,
                      }}
                    >
                      <Button
                        onClick={() => {
                          // openFileDialogSettingData();
                        }}
                      >
                        Choose an export folder
                      </Button>
                      <div>
                        {folder
                          ? `Folder selected : ${folder}`
                          : "Please choose an export folder"}
                      </div>
                      <Input
                        onChange={(e) => {
                          handleInputChange(e);
                        }}
                        value={nameFile}
                        placeholder="your file name here (no special characters allowed)"
                      />
                      <Button
                        style={
                          isJsonValidate
                            ? {
                              borderRadius: 4,
                              backgroundColor: "#F50",
                              borderStyle: "solid",
                              margin: "auto",
                              borderColor: "#F50",
                              color: "white",
                              padding: 15,
                            }
                            : {
                              borderRadius: 4,
                              backgroundColor: "grey",
                              borderStyle: "solid",
                              borderColor: "#F50",
                              margin: "auto",
                              color: "white",
                              padding: 15,
                            }
                        }
                        onClick={async () => {
                          // const executablePath =
                          //   await window.electronAPI.getBrowserPath();

                          // let browser;
                          // try {
                          //   browser = await window.electronAPI.launchPuppeteer({
                          //     headless: "new",
                          //     args: ["--disable-web-security"],
                          //     executablePath,
                          //   });
                          // } catch (err) {
                          //   browser = await window.electronAPI.launchPuppeteer({
                          //     headless: "new",
                          //     args: [
                          //       "--disable-web-security",
                          //       "--no-sandbox",
                          //       "--disable-setuid-sandbox",
                          //     ],
                          //     executablePath,
                          //   });
                          // }

                          // setMessagePrint("Generating Pdf ...");

                          try {
                            setMessagePrint((prev) => `${prev}\nInstanciating pdfGen`);
                            console.log(kitchenFaucet);
                            // Import PdfGenStatic directly

                            // const pdfGen = new PdfGen(
                            //   { ...JSON.parse(kitchenFaucet), browser },
                            //   pdfCallBacks,
                            // );
                            // await pdfGen.doPdf();
                          } catch (pdfError) {
                            setMessagePrint(
                              (prev) =>
                                `${prev}\nPDF generation failed: ${pdfError.message}`,
                            );
                            return;
                          }

                          setMessagePrint(
                            (prev) => `${prev}\nSuccessful pdf generation.`,
                          );
                        }}
                      >
                        print
                      </Button>
                    </div> */}
                  </CardContent>
                </Card>
              </Box>

              {/* <TextOnlyTooltip
                placement="top-end"
                title={
                  <div>
                    <div
                      style={{
                        fontSize: 14,
                        fontStyle: "normal",
                        fontWeight: 600,
                      }}
                    >
                      Advanced mode
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        fontStyle: "normal",
                        fontWeight: 400,
                      }}
                    >
                      Merge projects into a single export, access more print
                      types, and use loop mode.
                    </div>
                  </div>
                }
                arrow
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      color: "black",
                      fontFamily: "Lato",
                      fontWeight: 400,
                      fontSize: 20,
                    }}
                  >
                    Advanced mode
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <StyledSwitch
                      onChange={() => setAdvanceMode((prev) => !prev)}
                    />
                    <div
                      style={{
                        alignSelf: "center",
                        display: "flex",
                        alignItems: "center",
                        color: "black",
                        fontFamily: "Lato",
                        fontWeight: 400,
                        fontSize: 20,
                      }}
                    >
                      {advanceMode ? "On" : "Off"}
                    </div>
                  </div>
                </div>
              </TextOnlyTooltip> */}
            </Grid2>
            <Button variant="contained" startIcon={<Add />}> Add section</Button>
            {/* <Modal
              //open={openModalAddWrapper}
              //onClose={() => handleOpenModalAddWrapper(false)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
              }}
            >
              <div
                style={{
                  backgroundColor: "white",
                  width: "50%",
                  borderRadius: 10,
                }}
              >
                <div>
                  {Object.keys(init).map((c) => (
                    // eslint-disable-next-line
                    <div
                      className="pdfChoice"
                      onClick={() => {
                        const i = Math.max(orderSelection) + 1;
                        setSelected((prev) => {
                          const data = { ...prev };
                          data[i] = { type: c, content: {} };
                          return data;
                        });
                        setOrderSelection((prev) => [...prev, i]);
                        handleOpenModalAddWrapper(false);
                      }}
                    >
                      {initNames[c]}
                    </div>
                  ))}
                </div>
              </div>
            </Modal>
            {messagePrint} */}
          </Grid2>
        </DialogContent>

        <PanDialogActions
          closeFn={() => handleClose()}
          closeLabel={doI18n("pages:core-contenthandler_text_translation:close", i18nRef.current)}
          //actionFn={handleCreate}
          closeOnAction={false}
          actionLabel={doI18n("pages:core-contenthandler_text_translation:create", i18nRef.current)}
        />
      </PanDialog>

      {/* A supprimer */}
      {/* <ul className="sortable-TESTWRAPPER-list">
        {selected && infoProject && Object.keys(selected).map((k, i, arraySel) => (
          <WrapperTemplate
            doReset={doReset}
            setFinalPrint={setSelected}
            projectInfo={infoProject}
            wrapperType={selected[k].type}
            keyWrapper={k}
            setUpdate={setUpdate}
            advanceMode={advanceMode}
            changePrintData={setSelected}
            changePrintOrder={setOrderSelection}
            showTrashButton={arraySel.length > 1}
          />
        ))}
      </ul> */}
    </Box >

  );
}
