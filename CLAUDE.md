# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

This is a bookmark repository containing browser scripts for web scraping and content extraction, specifically for Scribd.com. The scripts are bookmarklets designed to be executed directly in the browser.

## Repository Structure

- `scribd.com/scripts.js` - Main bookmarklet script for Scribd content extraction
- `gemini deep research/` - Empty directory (reserved for future use)
- `notebooklm/` - Empty directory (reserved for future use)

## Scribd Bookmarklet Script

The `scribd.com/scripts.js` file contains a JavaScript bookmarklet that:

1. **Expands document content** - Clicks expand/read more buttons to reveal full text
2. **Scrolls through pages** - Implements slow scrolling (80% viewport height, 0.8s intervals) to trigger lazy loading of images
3. **Extracts pages** - Finds `.outer_page` elements containing document pages
4. **Cleans DOM for printing** - Removes all UI elements except document pages
5. **Applies print styles** - Centers pages, resets positioning, adds page breaks
6. **Triggers print dialog** - Initiates browser print/PDF save

### Key Implementation Details

- **Lazy Loading Handling**: Scribd uses lazy loading for images, so the script scrolls through the entire document with 800ms delays between scrolls to ensure all images load
- **DOM Manipulation**: Completely replaces `document.body.innerHTML` with a clean container
- **Page Selection**: Targets `.outer_page` class elements; fallback to `#main_content_wrapper` if needed
- **Page Breaks**: Uses `page-break-after: always` CSS for proper print pagination
- **Language**: Script contains Russian console messages and user alerts

### Usage

To use the bookmarklet:
1. Minify the JavaScript (removing newlines and extra whitespace)
2. Create a browser bookmark with `javascript:` prefix
3. Execute while on a Scribd document page

### Limitations

- After execution, the DOM is destroyed and page reload is required
- Assumes specific Scribd DOM structure (`.outer_page`, `.outer_page_container`)
- Uses `alert()` for user interaction which may be blocked by some browsers
- Hardcoded timing values (800ms scroll delay, 3000ms final wait) may need adjustment
