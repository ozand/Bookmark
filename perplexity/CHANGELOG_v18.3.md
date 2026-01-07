# Perplexity Bookmarklet v18.3 - CHANGELOG

## 🎯 Overview

**Release Date**: 2026-01-08
**Version**: 18.3
**Previous**: 18.2
**Type**: Bug Fix - Reasoning Extraction

---

## 🐛 Issue Fixed

### Problem: Reasoning Content Extracted as Plain Text

**In v18.2**, reasoning steps were extracted incorrectly:
- Only source names were captured (plain text)
- Links were lost
- Structure was not preserved
- No markdown formatting

**Example of v18.2 output**:
```markdown
### Message 1 (10 steps)
Code Interpreter Graph
instaclustr
perplexity
learn.microsoft
instaclustr+1
...
```

This was just a list of text, missing:
- ❌ Actual reasoning text
- ❌ Search queries
- ❌ Links to sources
- ❌ Proper structure

---

## ✅ Solution

### What Changed in v18.3

**Key improvement**: Use the existing `md()` markdown converter for reasoning content.

**Before (v18.2)**:
```javascript
// Extracted plain text only
let lines = text.split("\n")
    .filter(l => l.trim().length > 5)
    .slice(0, 30);
lines.forEach(line => {
    o += line.trim() + "\n";
});
```

**After (v18.3)**:
```javascript
// Find markdown-content div and convert to markdown
let markdownDivs = buttonParent.querySelectorAll('[id^="markdown-content"]');
if (markdownDivs.length > 0) {
    let contentDiv = markdownDivs[markdownDivs.length - 1];
    let reasoningContent = md(contentDiv);
    o += reasoningContent.trim() + "\n\n";
}
```

---

## 📊 What You Get Now

### v18.3 Output Format:

```markdown
## Per-Message Reasoning

### Message 1 (10 steps)

Now I'll create a comprehensive professional report for the user.

### PostgreSQL 18 Skip-Scan Index Feature

PostgreSQL 18 introduces a significant enhancement called **skip scan**, which
solves a long-standing limitation...

[opensource-db](https://opensource-db.com/pg18-hacktober-31-days-of-new-features-skip-scan-on-multicolumn-b-tree-indexes/)

### Example Query

```sql
-- Index
CREATE INDEX idx_sales ON sales(region, category, date);

-- Query
SELECT * FROM sales
WHERE category = 'Electronics' AND date > '2024-01-01';
```

In PostgreSQL 17 this query would ignore the index...

[pgedge](https://www.pgedge.com/blog/postgres-18-skip-scan-breaking-free-from-the-left-most-index-limitation)
```

### Benefits:

✅ **Full markdown formatting** - headings, bold, code blocks
✅ **Links preserved** - all source links included
✅ **Search queries** - actual query text captured
✅ **Reasoning text** - AI's thought process included
✅ **Proper structure** - matches the UI layout

---

## 🔍 Technical Details

### Extraction Strategy

1. **Click reasoning button** - Expands the reasoning section
2. **Wait 3 seconds** - Allows content to load
3. **Find markdown container** - Looks for `[id^="markdown-content"]`
4. **Convert to markdown** - Uses the `md()` HTML→Markdown converter
5. **Trim and output** - Clean formatting

### Fallback Strategy:

If primary selector fails:
```javascript
// Look for prose class (common in Perplexity UI)
let parent = btn.parentElement;
while (parent && !parent.classList.contains('prose')) {
    parent = parent.parentElement;
}
if (parent) {
    o += md(parent).trim() + "\n\n";
}
```

---

## 📈 Performance

| Metric | v18.2 | v18.3 | Change |
|--------|-------|-------|--------|
| Reasoning extraction | Text only | Full markdown | ✅ |
| Links preserved | ❌ No | ✅ Yes | +100% |
| Structure | ❌ Plain list | ✅ Formatted | ✅ |
| File size | 10.3 KB | 11.0 KB | +7% |
| Output size | 23.2 KB | 23.2 KB | 0% |

---

## 🧪 Testing

### Test Checklist:

- [x] Click "X steps completed" button
- [x] Wait for content to expand
- [x] Find markdown-content div
- [x] Convert HTML to Markdown
- [x] Verify links are preserved
- [x] Check formatting (headings, code blocks, etc.)

### Expected Output Structure:

```markdown
## Per-Message Reasoning
### Message N (X steps)
[Markdown content with links]
---
```

---

## 🔄 Migration from v18.2

### For Users:

**Action required**:
1. Delete old v18.2 bookmarklet
2. Copy v18.3 code
3. Create new bookmark

**What's different**:
- Reasoning section now includes full markdown
- Links are clickable
- Better formatting preserved
- File size slightly larger (+7%)

**No breaking changes** - v18.3 is backward compatible.

### For Developers:

**Changed files**:
- `perplexity_v18.3_readable.js` - New reasoning extraction logic
- `perplexity_v18.3.js` - Minified bookmarklet

**Key code change**:
```javascript
// Use md() converter instead of text extraction
o += md(contentDiv).trim() + "\n\n";
```

---

## 🐛 Known Issues

1. **Timing dependent**: 3-second wait may not be enough for slow connections
2. **Selector dependent**: Relies on Perplexity's DOM structure (`[id^="markdown-content"]`)
3. **No collapse back**: Reasoning sections stay expanded after extraction

### Workarounds:

- Increase wait time if needed: `await w(5000);` (line 56)
- Check console for errors if extraction fails
- Manual collapse: Click button again after running bookmarklet

---

## 🔮 Future Improvements (v18.4+)

1. **Adaptive wait time**
   - Use MutationObserver to detect when content loads
   - Reduce unnecessary waiting

2. **Better fallbacks**
   - Multiple selector strategies
   - Content-based detection

3. **Auto-collapse**
   - Collapse reasoning sections after extraction
   - Restore original UI state

4. **Per-step extraction**
   - Extract each reasoning step separately
   - Better structure for complex reasoning

---

## 📦 Files

**New**:
- `perplexity_v18.3.js` - Production bookmarklet (23.2 KB)
- `perplexity_v18.3_readable.js` - Development version (11.0 KB)
- `CHANGELOG_v18.3.md` - This file

**Updated**:
- N/A (v18.2 files remain unchanged)

**Unchanged**:
- `perplexity_v18.2.js` - Previous version (still available)
- `perplexity_v18.1.js` - Previous version (still available)

---

## 📞 Feedback

If reasoning extraction doesn't work:

1. Open browser console (F12)
2. Run the bookmarklet
3. Look for errors in console
4. Check if reasoning button was clicked
5. Verify wait time was sufficient

**Debug mode**:
Add `console.log('Reasoning content:', reasoningContent);` after line 72 in readable version.

---

**Version**: 18.3
**Release Date**: 2026-01-08
**Status**: ✅ Ready for use
**Note**: Reasoning now extracted as full markdown with links preserved
