# Perplexity Bookmarklet - Improvements v17 → v18

## Summary of Changes

### ✅ Implemented Improvements

#### 1. **Metadata Section** (NEW)
- **Date**: ISO 8601 timestamp
- **URL**: Current page URL
- **Title**: Document title
```
## Metadata
- **Date**: 2026-01-07T12:34:56.789Z
- **URL**: https://www.perplexity.ai/search/...
- **Title**: исследуй лучшие практики...
```

#### 2. **Artifact Filtering** (FIXED)
Removed unwanted text from Answer section:
- ❌ "Chart"
- ❌ "Code Interpreter Graph"
- ❌ "Code Interpreter"
- ❌ "Programming, Chart"

**Before (v17):**
```markdown
## Answer

Chart
Code Interpreter Graph
Chart
Code Interpreter Graph
Excellent. Now I have all the research complete...
```

**After (v18):**
```markdown
## Answer

Excellent. Now I have all the research complete...
```

#### 3. **Enhanced Image Extraction** (IMPROVED)
**Before (v17):**
- Fixed 2.5 second wait
- Simple image check (width > 100px)

**After (v18):**
- Up to 20 attempts with 500ms intervals
- Waits for images to actually load (`img.complete && img.naturalWidth > 0`)
- More reliable image capture

```javascript
while (attempts < maxAttempts) {
    let loadedCount = Array.from(d.querySelectorAll("img[src*='http']"))
        .filter(img => img.complete && img.naturalWidth > 0).length;
    if (loadedCount > 0) break;
    await w(500);
    attempts++;
}
```

#### 4. **Related Questions Extraction** (NEW)
Attempts multiple selectors to find related questions:
```javascript
const relatedSelectors = [
    '[data-testid="related-questions"]',
    '.related-questions',
    '[class*="related"]',
    '[class*="follow-up"]',
    '[class*="followup"]'
];
```

Output format:
```markdown
## Related Questions
1. How to configure PostgreSQL for high concurrency?
2. What are the best practices for vacuuming?
3. How to optimize slow queries?
```

#### 5. **Cleaner Output** (IMPROVED)
- Removes triple+ newlines (`\n{3,}` → `\n\n`)
- Filters empty lines after artifact removal
- Better readability

#### 6. **Version Bump**
- v17 → v18
- Filenames: `perplexity_v18_YYYY-MM-DD.md`
- Readable version: `perplexity_v18_readable.js` (for development)

---

## Gap Analysis Status

| Issue | v17 | v18 | Status |
|-------|-----|-----|--------|
| Artifacts in Answer | ❌ | ✅ | **FIXED** |
| Image loading | ⚠️ | ✅ | **IMPROVED** |
| Related questions | ❌ | ✅ | **ADDED** |
| Metadata | ❌ | ✅ | **ADDED** |
| Code blocks | ⚠️ | ⚠️ | *Needs testing* |
| Tables | N/A | N/A | No tables in HTML |

---

## Installation

### As Bookmarklet
Use `perplexity_v18.js` (minified, one line)

### For Development
Use `perplexity_v18_readable.js` (formatted, commented)

---

## Testing Checklist

- [ ] Test on simple query (no images)
- [ ] Test on complex query (with images)
- [ ] Test on query with code blocks
- [ ] Test on query with related questions
- [ ] Verify metadata is correct
- [ ] Verify no artifacts in Answer
- [ ] Verify all images are captured
- [ ] Verify file download works

---

## Known Limitations

1. **Code blocks**: Still using simple `innerText` extraction - may not handle nested code blocks perfectly
2. **Related questions**: Depends on Perplexity's DOM structure - may break if they change selectors
3. **Images**: May not capture lazy-loaded images that are way below the fold

---

## Future Improvements (Potential)

1. **Enhanced code block detection**
   - Look for language indicators (class="language-python")
   - Preserve syntax highlighting hints

2. **Table extraction**
   - Convert HTML tables to Markdown tables
   - Handle nested tables

3. **Thread/conversation history**
   - Extract multiple Q&A pairs in a thread
   - Preserve conversation structure

4. **Copy button**
   - Add button to copy markdown to clipboard
   - Alternative to file download

5. **Configuration options**
   - Include/exclude sections
   - Choose output format (MD, JSON, HTML)
