# pankosmia-text_translation-muncher

`pankosmia-text_translation-muncher` provides reusable textTranslation-flavored muncher components for the Pankosmia ecosystem.

This package contains a set of focused UI tools that can be integrated into Pankosmia clients when textTranslation editing or visualization capabilities are needed.

> **Note:** This package does not contain everything available inside `pankosmia/core-contenthandler_text_translation`. It only exposes reusable components that may or may not be used by other Pankosmia clients.

## Components

### `TextTranslationEditorMuncher`

A component that allows users to edit textTranslation content.

It provides the editing interface required to create and modify both notes and questions.

---

### `TextTranslationViewerMuncher`

A component that allows users to view textTranslation content.

It is intended for read-only visualization use cases where editing capabilities are not required.

---

## Scripts

### `usfm2draftJson.worker.js`

## A component that allows users to use worker for paralleloading of textTranslation for editing

### `usfm2viewerJson.worker.js`

## A component that allows users to use worker for paralleloading of textTranslation for viewing

## Scope

This package contains only reusable BCV-related components.

Included:

- textTranslation editing components
- textTranslation viewing components
- usfm2draftJson.worker.js scripts
- usfm2viewerJson.worker.js scripts

Not included:

- The complete `pankosmia/core-contenthandler_text_translation` application
- Application-specific features
- Internal tools that are not intended for reuse

The goal of this package is to provide lightweight, reusable building blocks for textTranslation features across the Pankosmia ecosystem.

## Testing

To test the Muncher components locally:

1. Start the development server:

```bash
pnpm run dev
```

2. Navigate to:
   `/#/MuncherTest`

## Publishing

To publish this package to npm, use the following command:

```bash
pnpm run publish
```
