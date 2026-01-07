# Perplexity Bookmarklet v18.4 - CHANGELOG

## 🎯 Overview

**Release Date**: 2026-01-08
**Version**: 18.4
**Previous**: 18.3
**Type**: Bug Fix - Reasoning Structure

---

## 🐛 Issue Fixed

### Problem: v18.3 Lost Reasoning Structure

**In v18.3**, reasoning was extracted as raw markdown, losing the structured format:

```markdown
### Message 1 (10 steps)

Chart
Code Interpreter Graph
Excellent. Now I have all the research complete...
## Комплексное руководство...
[instaclustr](https://...)
```

**Problems**:
- ❌ No step-by-step breakdown
- ❌ Artifacts included ("Chart", "Code Interpreter Graph")
- ❌ No search queries visible
- ❌ Links mixed with content
- ❌ Lost the v17 structured format

---

## ✅ Solution

### What Changed in v18.4

**Return to v17 approach** - extract reasoning steps individually using `.group/goal` selectors.

**Key insight**: v17 had the RIGHT format, but only worked for single messages. v18.4 combines v17's structured extraction with v18.2's multi-message support.

### v18.4 Output Format:

```markdown
## Per-Message Reasoning

### Message 1 (10 steps)

#### Step 1
Я исследую лучшие практики администрирования...

> **Queries:** PostgreSQL database administration best practices 2025, ...

- [Top 10 PostgreSQL® best practices for 2025 instaclustr](https://...)
- [PostgreSQL tuning: 6 things you can do... instaclustr](https://...)

#### Step 2
Извлекая детальный контент из ключевых источников...

> **Queries:** postgresql, docs.aws.amazon

- [postgresql](https://www.postgresql.org/docs/current/performance-tips.html)
- [docs.aws.amazon](https://docs.aws.amazon.com/...)
```

### Benefits:

✅ **Step-by-step structure** - Each reasoning step separated
✅ **Search queries visible** - Shows what AI searched for
✅ **Links organized** - Sources listed under each step
✅ **No artifacts** - Filters out "Chart", "Code Interpreter Graph"
✅ **Multi-message support** - Works with multiple reasoning blocks
✅ **v17 compatibility** - Same format users loved

---

## 🔍 Technical Details

### Extraction Strategy (v18.4):

1. **Click reasoning button** - Expands the section
2. **Wait 3 seconds** - Allows content to load
3. **Find `.group/goal` elements** - Reasoning steps
4. **Extract each step individually**:
   - Step description (`.pr-sm` selector)
   - Search queries (`.bg-subtler` selector)
   - Source links (`<a>` elements)
5. **Format as structured markdown** - Clear hierarchy

### Code Comparison:

**v18.3 (WRONG)**:
```javascript
// Raw markdown extraction
let markdownDivs = buttonParent.querySelectorAll('[id^="markdown-content"]');
let reasoningContent = md(contentDiv);
o += reasoningContent.trim();
```

**v18.4 (CORRECT)**:
```javascript
// Structured extraction like v17
let gs = buttonParent.querySelectorAll('.group\\/goal');
gs.forEach((g, stepIndex) => {
    let t = g.querySelector(".pr-sm");
    o += "#### Step " + (stepIndex + 1) + "\n";
    o += t.innerText.trim() + "\n\n";

    // Queries
    let sq = Array.from(g.querySelectorAll(".bg-subtler"));
    let qt = sq.map(el => el.innerText.replace(/search/gi, ""));
    o += "> **Queries:** " + qt.join(", ") + "\n\n";

    // Links
    let l = Array.from(g.querySelectorAll("a"));
    l.forEach(link => {
        o += "- [" + linkText + "](" + link.href + ")\n";
    });
});
```

---

## 📊 Comparison Table

| Feature | v17 | v18.2 | v18.3 | v18.4 |
|---------|-----|-------|-------|-------|
| Structured steps | ✅ | ❌ | ❌ | ✅ |
| Search queries | ✅ | ❌ | ❌ | ✅ |
| Links per step | ✅ | ❌ | ❌ | ✅ |
| Multi-message | ❌ | ✅ | ✅ | ✅ |
| No artifacts | ✅ | ✅ | ❌ | ✅ |
| Clean format | ✅ | ❌ | ❌ | ✅ |

**v18.4 = Best of v17 + v18.2**

---

## 🧪 Testing

### Expected Output Structure:

```markdown
## Per-Message Reasoning

### Message 1 (10 steps)

#### Step 1
[Step description]

> **Queries:** [search terms]

- [Source 1](url)
- [Source 2](url)

#### Step 2
[Step description]

> **Queries:** [search terms]

- [Source 3](url)

### Message 2 (7 steps)
...
```

### Test Checklist:

- [x] Click "X steps completed" button
- [x] Find .group/goal elements
- [x] Extract step descriptions
- [x] Extract search queries
- [x] Extract source links
- [x] Format with #### headings
- [x] No artifacts (Chart, Code Interpreter Graph)
- [x] Works with multiple messages

---

## 🔄 Migration from v18.3

### For Users:

**Action required**:
1. Delete old v18.3 bookmarklet
2. Copy v18.4 code
3. Create new bookmark

**What's different**:
- Reasoning now structured like v17
- Each step is separated with #### heading
- Search queries shown in blockquotes
- Sources listed under each step
- No more "Chart" or "Code Interpreter Graph" artifacts

**No breaking changes** - Other sections (Sources, Answer, Images) unchanged.

---

## 📦 Files

**New**:
- `perplexity_v18.4.js` - Production bookmarklet (26.4 KB)
- `perplexity_v18.4_readable.js` - Source (12.4 KB)
- `CHANGELOG_v18.4.md` - This file

**Unchanged**:
- `perplexity_v18.3.js` - Previous version (still available)
- `perplexity_v18.2.js` - Previous version (still available)
- `perplexity_v17.js` - Original structured version (reference)

---

## 🔮 Future Improvements

Potential enhancements for v18.5+:

1. **Better selector robustness**
   - More fallback strategies
   - Handle DOM changes

2. **Enhanced query extraction**
   - Separate query types
   - Show query results count

3. **Step categorization**
   - Identify step types (search, analysis, synthesis)
   - Better formatting

---

## 📞 Feedback

If reasoning extraction doesn't work:

1. Open browser console (F12)
2. Run the bookmarklet
3. Look for selector errors
4. Check if `.group/goal` elements exist
5. Verify button was clicked
6. Check wait time was sufficient

**Debug mode**:
Add console.log statements:
```javascript
console.log('Found steps:', gs.length);
console.log('Step text:', t.innerText);
```

---

**Version**: 18.4
**Release Date**: 2026-01-08
**Status**: ✅ Ready for use
**Note**: Returns to v17's structured format with multi-message support
