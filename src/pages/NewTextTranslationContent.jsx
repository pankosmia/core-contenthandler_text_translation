import { useState, useContext, useEffect } from 'react';
import {
    Box,
    DialogContent,
    Button,
    Stepper,
    Step,
    StepLabel,
    DialogActions,
    DialogContentText,

} from "@mui/material";
import {
    postJson,
    doI18n,
    getAndSetJson,
    getJson,
} from "pithekos-lib";
import { PanDialog, i18nContext, debugContext, Header } from "pankosmia-rcl";
import ErrorDialog from '../TextTranslationContent/ErrorDialog';
import LanguagePicker from '../TextTranslationContent/LanguagePicker';
import NameDocument from '../TextTranslationContent/NameDocument';
import ContentDocument from '../TextTranslationContent/ContentDocument';

export default function NewBibleContent() {

    const [open, setOpen] = useState(true)
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { i18nRef } = useContext(i18nContext);
    const { debugRef } = useContext(debugContext);
    const [contentName, setContentName] = useState("");
    const [contentAbbr, setContentAbbr] = useState("");
    const [contentType, setContentType] = useState("text_translation");
    const [contentOption, setContentOption] = useState("book");
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [bookCode, setBookCode] = useState("TIT");
    const [bookTitle, setBookTitle] = useState("Tit");
    const [bookAbbr, setBookAbbr] = useState("Ti");
    const [postCount, setPostCount] = useState(0);
    const [showVersification, setShowVersification] = useState(true);
    const [versification, setVersification] = useState("eng");
    const [bookCodes, setBookCodes] = useState([]);
    const [localRepos, setLocalRepos] = useState([]);
    const [repoExists, setRepoExists] = useState(false);
    const [currentLanguage, setCurrentLanguage] = useState({ language_code: "", language_name: "" });
    const [languageIsValid, setLanguageIsValid] = useState(true);
    const [errorAbbreviation, setErrorAbbreviation] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set());

    const steps = [`${doI18n("pages:core-contenthandler_text_translation:name_section", i18nRef.current)}`,
    `${doI18n("pages:core-contenthandler_text_translation:language", i18nRef.current)}`,
    `${doI18n("pages:core-contenthandler_text_translation:content_section", i18nRef.current)}`
    ];

    const handleClose = () => {
        const url = window.location.search;
        const params = new URLSearchParams(url);
        const returnType = params.get("returntypepage");

        if (returnType === "dashboard") {
            window.location.href = "/clients/main";
        } else {
            window.location.href = "/clients/content";
        }
    }

    const handleCloseCreate = async () => {
        setOpen(false);
        setTimeout(() => {
            window.location.href = '/clients/content';
        });
    };
    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const handleNext = async () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);

        } if (activeStep === steps.length - 1) {
            try {
                await handleCreate();
            } catch (error) {
                console.error("Erreur création projet", error)
            }
            return;
        }
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    useEffect(
        () => {
            const doFetch = async () => {
                const versificationResponse = await getJson("/content-utils/versification/eng", debugRef.current);
                if (versificationResponse.ok) {
                    setBookCodes(Object.keys(versificationResponse.json.maxVerses));
                }
            };
            if (bookCodes.length === 0 && open) {
                doFetch().then();
            }
        }, [open]
    );

    useEffect(
        () => {
            if (open) {
                getAndSetJson({
                    url: "/git/list-local-repos",
                    setter: setLocalRepos
                }).then()
            }
        },
        [open]
    );

    useEffect(
        () => {
            setContentName("");
            setContentAbbr("");
            setContentType("text_translation");
            setBookCode("TIT");
            setBookTitle("Titus");
            setBookAbbr("Ti");
            setShowVersification(true);
            setVersification("eng");
        },
        [postCount]
    );

    const renderStepContent = (step) => {
        switch (step) {
            case 1:
                return <NameDocument contentType={contentType} setContentType={setContentType} repoExists={repoExists} setRepoExists={setRepoExists} contentName={contentName} setContentName={setContentName} contentAbbr={contentAbbr} setContentAbbr={setContentAbbr} errorAbbreviation={errorAbbreviation} setErrorAbbreviation={setErrorAbbreviation} localRepos={localRepos} />
            case 2:
                return <LanguagePicker currentLanguage={currentLanguage} setCurrentLanguage={setCurrentLanguage} setIsValid={setLanguageIsValid} />
            case 3:
                return <ContentDocument open={open} contentOption={contentOption} setContentOption={setContentOption} versification={versification} setVersification={setVersification} bookCode={bookCode} setBookCode={setBookCode} bookAbbr={bookAbbr} bookCodes={bookCodes} setBookAbbr={setBookAbbr} bookTitle={bookTitle} setBookTitle={setBookTitle} showVersification={showVersification} setShowVersification={setShowVersification} selectedPlan={selectedPlan} setSelectedPlan={setSelectedPlan} />
            default:
                return null;
        }
    }
    const isStepValid = (step) => {
        switch (step) {
            case 0:
                return (
                    contentName.trim().length > 0 &&
                    contentAbbr.trim().length > 0 &&
                    contentType.trim().length > 0 &&
                    (errorAbbreviation === false)
                );

            case 1:
                return (
                    currentLanguage?.language_code?.trim().length > 0 &&
                    currentLanguage?.language_name?.trim().length > 0 &&
                    (languageIsValid === true)
                );
            case 2:

                if (contentOption === "book") {
                    return (
                        versification.trim().length === 3 &&
                        bookCode.trim().length === 3 &&
                        bookTitle.trim().length > 0 &&
                        bookAbbr.trim().length > 0
                    );
                }

                if (contentOption === "plan") {
                    return (
                        versification.trim().length === 3 &&
                        Boolean(selectedPlan)
                    );
                }
                return true;
            default:
                return true;
        }
    };

    const handleCreate = async () => {
        // versification for plan comes from plan
        let planJson = null;
        let submittedVersification = versification;
        if (contentOption === "plan" && selectedPlan) {
            const planResponse = await getJson(
                `/burrito/ingredient/raw/${selectedPlan}?ipath=plan.json`,
                debugRef.current
            );
            if (planResponse.ok) {
                planJson = planResponse.json;
                submittedVersification = planJson.versification;
            } else {
                console.log(planResponse.error);
                setErrorMessage(`${doI18n("pages:core-contenthandler_text_translation:content_creation_error", i18nRef.current)}: ${planResponse.status}`);
                setErrorDialogOpen(true);
                return;
            }
        }
        // Make repo (empty for plans)
        const payload = {
            content_name: contentName,
            content_abbr: contentAbbr,
            content_type: contentType,
            content_language_code: currentLanguage.language_code,
            content_language_name: currentLanguage.language_name,
            versification: submittedVersification,
            add_book: contentOption === "book",
            book_code: contentOption === "book" ? bookCode : null,
            book_title: contentOption === "book" ? bookTitle : null,
            book_abbr: contentOption === "book" ? bookAbbr : null,
            add_cv: contentOption === "book" ? showVersification : null,

        };
        const response = await postJson(
            "/git/new-text-translation",
            JSON.stringify(payload),
            debugRef.current
        );
        if (response.ok) {
            setPostCount(postCount + 1);
        } else {
            setErrorMessage(`${doI18n("pages:core-contenthandler_text_translation:book_creation_error", i18nRef.current)}: ${response.status
                }`);
            setErrorDialogOpen(true);
            return;
        }
        // Add books for plan
        if (planJson) {
            // Get bookCode list
            const bookCodes = Array.from(new Set(planJson.sections.map(s => s.bookCode)));
            for (const bookCode of bookCodes) {
                const bookSections = planJson.sections.filter(s => s.bookCode === bookCode);
                let chapterNo = 0;
                let usfmBits = [];
                usfmBits.push(`\\id ${bookCode} -- ${planJson.short_name} -- v${planJson.version} -- ${planJson.copyright}`);
                const printableBookCode = ["1", "2", "3"].includes(bookCode[0]) ?
                    `${bookCode[0]} ${bookCode[1]}${bookCode[2].toLowerCase()}` :
                    `${bookCode[0]}${bookCode[1].toLowerCase()}${bookCode[2].toLowerCase()}`;
                for (const headerTag of ["toc1", "toc2", "toc3", "mt"]) {
                    usfmBits.push(`\\${headerTag} ${printableBookCode}`);
                }
                for (const bookSection of bookSections) {
                    usfmBits.push(`\\rem ${bookSection.cv[0]}-${bookSection.cv[1]}`);
                    usfmBits.push(`\\ts\\*`);
                    for (const sectionField of planJson.sectionStructure) {
                        if (sectionField.type === "paraField") {
                            if (bookSection.fieldInitialValues && bookSection.fieldInitialValues[sectionField.name]) {
                                usfmBits.push(`\\${sectionField.paraTag}`);
                                usfmBits.push("___")
                            } else if (planJson.fieldInitialValues && planJson.fieldInitialValues[sectionField.name]) {
                                usfmBits.push(`\\${sectionField.paraTag}`);
                                usfmBits.push("___")
                            }
                        } else if (sectionField.type === "scripture") {
                            for (const para of bookSection.paragraphs) {
                                if (para.units) {
                                    const paraChapter = parseInt(para.units[0].split(":")[0]);
                                    if (paraChapter !== chapterNo) {
                                        usfmBits.push(`\\c ${paraChapter}`);
                                        chapterNo = paraChapter;
                                    }
                                    usfmBits.push(`\\${para.paraTag}`);
                                    for (const unit of para.units) {
                                        const [ch, vr] = unit.split(":");
                                        if (parseInt(ch) !== chapterNo) {
                                            usfmBits.push(`\\c ${ch}`);
                                            chapterNo = parseInt(ch);
                                            usfmBits.push(`\\${para.paraTag}`);
                                        }
                                        usfmBits.push(`\\v ${vr}`);
                                        usfmBits.push("___")
                                    }
                                } else { // bridge
                                    usfmBits.push(`\\rem ${para.cv[0]}-${para.cv[1]}`);
                                    usfmBits.push(`\\${para.paraTag}`);
                                    usfmBits.push("___")
                                }
                            }
                        }
                    }
                }
                const payload = {
                    payload: usfmBits.join("\n")
                };
                const newBookResponse = await postJson(
                    `/burrito/ingredient/raw/_local_/_local_/${contentAbbr}?ipath=${bookCode}.usfm&update_ingredients`,
                    JSON.stringify(payload)
                );
                if (!newBookResponse.ok) {
                    setErrorMessage(`${doI18n("pages:core-contenthandler_text_translation:book_creation_error", i18nRef.current)}: ${response.status
                        }`);
                    setErrorDialogOpen(true);
                    return;
                }
            }
        }
        await handleCloseCreate();
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
                    }}
                />
                <Header
                    titleKey="pages:content:title"
                    currentId="content"
                    requireNet={false}
                />

                <PanDialog
                    titleLabel={doI18n("pages:core-contenthandler_text_translation:create_content_text_translation", i18nRef.current)}
                    isOpen={open}
                    closeFn={() => handleCloseCreate()}
                >
                    <DialogContent>
                        <Stepper sx={{ position: "sticky" }} activeStep={activeStep}>
                            {steps.map((label, index) => {
                                const stepProps = {};
                                const labelProps = {};
                                if (isStepSkipped(index)) {
                                    stepProps.completed = false;
                                }
                                return (
                                    <Step key={label} {...stepProps}>
                                        <StepLabel {...labelProps}>{label}</StepLabel>
                                    </Step>
                                );
                            })}
                        </Stepper>

                        {activeStep !== steps.length && (
                            <>
                                <DialogContentText
                                    variant='subtitle2'
                                    sx={{ paddingBottom: 1 }}
                                >
                                    {doI18n(`pages:core-contenthandler_text_translation:required_field`, i18nRef.current)}
                                </DialogContentText>
                                {renderStepContent(activeStep + 1)}
                            </>
                        )}
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2 }}>
                        <Button
                            color="inherit"
                            disabled={activeStep === 0}
                            onClick={handleBack}
                        >
                            {doI18n("pages:core-contenthandler_text_translation:back_button", i18nRef.current)}
                        </Button>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button
                            onClick={handleNext}
                            disabled={!isStepValid(activeStep) || repoExists}
                        >
                            {activeStep === steps.length - 1 ? `${doI18n("pages:core-contenthandler_text_translation:create", i18nRef.current)}` : `${doI18n("pages:core-contenthandler_text_translation:next_button", i18nRef.current)}`}
                        </Button>

                    </DialogActions>
                </PanDialog>
                <ErrorDialog setErrorDialogOpen={setErrorDialogOpen} handleClose={handleClose} errorDialogOpen={errorDialogOpen} errorMessage={errorMessage} />
            </Box>
    );
}