import { DialogContent, DialogContentText, useTheme } from '@mui/material';
import { doI18n, getJson } from 'pithekos-lib';
import { PanDialog, PanDialogActions, i18nContext, debugContext } from "pankosmia-rcl";

import { useContext, useEffect, useState } from 'react';

export default function AboutRepo({ repoInfo, open, closeFn }) {
    const { i18nRef } = useContext(i18nContext);
    const theme = useTheme();
    const [repoPath, setRepoPath] = useState([])
    const [nameProject, setNameProject] = useState("");
    const [dataRepo, setDataRepo] = useState({});

    const getProjectSummaries = async () => {
        const hash = window.location.hash;
        const query = hash.includes('?') ? hash.split('?')[1] : '';
        const params = new URLSearchParams(query);
        const path = params.get('repoPath');
        setRepoPath(path);
        const summariesResponse = await getJson(`/burrito/metadata/summary/${path}`, debugContext.current);
        if (summariesResponse.ok) {
            const data = summariesResponse.json;
            setNameProject(data.name);
            console.log('data',data);
        } else {
            console.error(`${doI18n("pages:core-contenthandler_text_translation:error_data", i18nRef.current)}`);
        }

    };

    useEffect(
        () => {
            getProjectSummaries();
        },
        []
    );

    return (
        <PanDialog
            titleLabel={`${doI18n('pages:content:about_document', i18nRef.current)} ${repoInfo.source} - ${repoInfo.abbreviation} `}
            isOpen={open}
            closeFn={() => closeFn()}
            theme={theme}
        >
            <DialogContent>
                {repoInfo
                    ? Object.entries(repoInfo).map(([key, value]) => {
                        const keys =
                            repoInfo.name === repoInfo.description
                                ? ['name', 'flavor', 'dateUpdated', 'language_code', 'book_codes']
                                : ['name', 'description', 'flavor', 'dateUpdated', 'language_code', 'book_codes'];
                        if (!keys.includes(key)) return null;
                        return (
                            <DialogContentText
                                variant={key === 'name' ? 'h6' : 'body2'}
                                key={key}
                                sx={{
                                    fontWeight: key === 'name' ? 'bold' : 'normal',
                                    fontStyle: key === 'description' ? 'italic' : 'normal',
                                    mb: 1,
                                }}
                            >
                                {key === 'flavor'
                                    ? `${doI18n('pages:content:about_repo_flavor', i18nRef.current)} : ${value}`
                                    : null}
                                {key === 'language_code'
                                    ? `${doI18n('pages:content:about_repo_language-code', i18nRef.current)} : ${value}`
                                    : null}
                                {key === 'dateUpdated'
                                    ? `${doI18n('pages:content:about_repo_dateUdapted', i18nRef.current)} : ${value}`
                                    : null}
                                {key === 'book_codes' && Array.isArray(value)
                                    ? `${doI18n('pages:content:book_or_books', i18nRef.current)} : ${value.join(', ')}`
                                    : null}
                                {key === 'name' ? `${value}` : null}
                                {key === 'description' ? `${value}` : null}
                            </DialogContentText>
                        );
                    })
                    : null}
            </DialogContent>
            <PanDialogActions
                closeFn={() => closeFn()}
                closeLabel={doI18n('pages:content:close', i18nRef.current)}
                onlyCloseButton={true}
            />
        </PanDialog>
    );
}
