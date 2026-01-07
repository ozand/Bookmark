# Perplexity Bookmarklet Installation Guide

## About Minification

**Important**: The bookmarklet (`perplexity_v18.js`) is intentionally **NOT** minified to a single line. Modern browsers support multi-line bookmarklets without any issues.

### Why Multi-Line?

1. **Maintainability** - Easier to read and debug
2. **Reliability** - Avoids syntax errors from minification tools
3. **Compatibility** - Works perfectly in all modern browsers
4. **Development** - `perplexity_v18_readable.js` is identical - use either version

## Installation

### Method 1: Create Bookmark Manually

1. **Copy the entire contents** of `perplexity_v18.js`
   - It starts with `javascript:(function(){`
   - It ends with `x();})();`

2. **Create a new bookmark** in your browser:
   - **Chrome/Edge**: Ctrl+D → Edit → Name: "Perplexity Extractor" → Paste code in URL field
   - **Firefox**: Ctrl+D → More → Name: "Perplexity Extractor" → Paste code in URL field
   - **Safari**: Cmd+D → Name: "Perplexity Extractor" → Paste code in URL field

3. **Use the bookmarklet**:
   - Navigate to any Perplexity AI search result
   - Click the "Perplexity Extractor" bookmark
   - Markdown file will download automatically

### Method 2: Bookmarklet Manager (Optional)

For easier management, use a bookmarklet manager extension:
- **Chrome/Edge**: Bookmarklets Manager
- **Firefox**: Bookmarklets (extension)

## Files

- **`perplexity_v18.js`** - Production bookmarklet (multi-line, formatted)
- **`perplexity_v18_readable.js`** - Development version (identical, with comments)
- **`perplexity_v17.js`** - Legacy version (one-line, URL-encoded)

## Troubleshooting

### Bookmark not working?

1. **Check the URL field**: Ensure it starts with `javascript:`
2. **Check line breaks**: Make sure you copied the entire file
3. **Browser console**: Press F12 and check for errors

### File not downloading?

1. **Check popup blocker**: Allow downloads from Perplexity
2. **Check permissions**: Some browsers require explicit permission
3. **Try again**: Click the bookmarklet again

## Version History

- **v18**: Current version with metadata, artifact filtering, related questions
- **v17**: Legacy one-line format (still works)

## Support

For issues or questions:
1. Check `IMPROVEMENTS.md` for changelog
2. Check `CLAUDE.md` for technical documentation
3. Review the code - it's well formatted and commented
