# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

This is a bookmark repository containing browser scripts for web scraping and content extraction. The scripts are bookmarklets designed to be executed directly in the browser.

## Repository Structure

- `scribd.com/scripts.js` - Main bookmarklet script for Scribd content extraction
- `perplexity/perplexity_v18.js` - Perplexity AI bookmarklet (minified, production)
- `perplexity/perplexity_v18_readable.js` - Perplexity AI bookmarklet (readable, development)
- `perplexity/IMPROVEMENTS.md` - Detailed changelog and improvement documentation
- `gemini deep research/` - Empty directory (reserved for future use)
- `notebooklm/` - Empty directory (reserved for future use)

---

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

---

## Perplexity Bookmarklet Script

The `perplexity/perplexity_v18.js` file contains a JavaScript bookmarklet for extracting Perplexity AI responses, including reasoning steps, sources, images, and related questions.

### Features

1. **Metadata Extraction** - Captures date, URL, and page title
2. **Prompt Extraction** - Extracts the original user query from H1
3. **Reasoning Steps** - Captures multi-step reasoning process with:
   - Step descriptions
   - Search queries used
   - Source links for each step
4. **Sidebar Sources** - Extracts all sources from the sidebar modal
5. **Answer Content** - Main response in Markdown format with:
   - Artifact filtering (removes "Chart Code Interpreter Graph" etc.)
   - Proper Markdown formatting
   - Citations preserved
6. **Images** - Extracts images from the Images/Media tab with improved loading detection
7. **Related Questions** - Attempts to extract follow-up question suggestions

### Key Implementation Details

- **Markdown Converter**: Custom HTML-to-Markdown parser handling headings, lists, links, images, code blocks
- **Artifact Filtering**: Removes unwanted text like "Chart", "Code Interpreter Graph" from Answer section
- **Image Loading**: Up to 20 attempts (500ms intervals) to wait for images to load before extraction
- **Multiple Selectors**: Tries various selectors for related questions to handle DOM changes
- **Clean Output**: Removes triple+ consecutive newlines for better readability

### Version History

- **v17**: Initial version with basic extraction
- **v18**: Added metadata, artifact filtering, improved image loading, related questions extraction

See `perplexity/IMPROVEMENTS.md` for detailed changelog.

### Usage

To use the bookmarklet:
1. Copy the contents of `perplexity_v18.js` (minified version)
2. Create a browser bookmark with the script as the URL (javascript: prefix included)
3. Navigate to any Perplexity AI search result
4. Click the bookmark to extract and download the report as Markdown

### Output Format

The bookmarklet generates a Markdown file named `perplexity_v18_YYYY-MM-DD.md` containing:
- Metadata section
- Original prompt
- Reasoning steps (if available)
- Sidebar sources (if available)
- Main answer
- Images (if available)
- Related questions (if available)

### Limitations

- Depends on Perplexity's DOM structure - may break if they change class names or selectors
- Code blocks use simple extraction - may not preserve language hints perfectly
- Related questions extraction attempts multiple selectors but may not find them if DOM structure changes
- Images may not capture lazy-loaded images far below the fold

### Development

For development and debugging, use `perplexity_v18_readable.js` which contains:
- Proper formatting and indentation
- Comments explaining each section
- Same functionality as minified version

Always test changes in readable version before minifying for production use.
