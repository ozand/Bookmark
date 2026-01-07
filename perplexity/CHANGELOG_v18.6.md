# Perplexity Bookmarklet v18.6 - CHANGELOG

## 🎯 Overview

**Release Date**: 2026-01-08
**Version**: 18.6
**Previous**: 18.5
**Type: Improvement** - Section reordering

---

## 📋 What Changed

### User Request

User wanted "Per-Message Sources" section to appear **at the very end** of the document, after all other sections including "All Sources (Combined)".

**User's exact words**:
> "теперь Per-Message Sources блок со всеми ссылками под всеми сообщениями, в конце"

Translation: "now Per-Message Sources block with all links under all messages, at the end"

---

### Problem in v18.5

**In v18.5**, sections appeared in this order:

```markdown
1. Metadata
2. Prompt
3. Per-Message Reasoning
4. Answer
5. Per-Message Sources        ← User wanted this at the end
6. All Sources (Combined)
7. Images
8. Related Questions
```

**Issue**: "Per-Message Sources" appeared in the middle, but user wanted it at the very end.

---

### Solution in v18.6

**In v18.6**, "Per-Message Sources" moved to the very end (but still INSIDE function x() so variable `o` is accessible):

```markdown
1. Metadata
2. Prompt
3. Per-Message Reasoning
4. Answer
5. All Sources (Combined)      ← Moved up
6. Images
7. Related Questions
8. Download
9. Per-Message Sources        ← Moved to VERY END
```

---

## 📊 Comparison

| Section | v18.5 Order | v18.6 Order | Change |
|---------|-------------|-------------|--------|
| Metadata | 1st | 1st | - |
| Prompt | 2nd | 2nd | - |
| Reasoning | 3rd | 3rd | - |
| Answer | 4th | 4th | - |
| **Per-Message Sources** | **5th** | **9th (last)** | ✅ **Moved to end!** |
| All Sources | 6th | 5th | Moved up |
| Images | 7th | 6th | Moved up |
| Related Questions | 8th | 7th | Moved up |
| Download | 9th | 8th | Moved up |

---

## 🎨 Output Format (v18.6)

```markdown
# Perplexity Report v18.6

## Metadata
- Date, URL, Title

## Prompt
[User's question]

## Per-Message Reasoning
[AI's step-by-step thinking]

## Answer
[Main AI response]

## All Sources (Combined)
* [All unique sources from all messages](url)

## Images
![img](url)

## Related Questions
* [Question 1](url)
* [Question 2](url)

## Download
[File downloaded automatically]

## Per-Message Sources        ← AT THE VERY END
### Message 1 (19 sources)
* [Source specific to message 1](url)
* [Another source](url)

### Message 2 (15 sources)
* [Source specific to message 2](url)
```

---

## 🔍 Technical Details

### Challenge: Function Scope

**Problem**: Per-Message Sources must be **INSIDE** function `x()` to access variable `o`.

**Wrong approach** (v18.6 initial attempt):
```javascript
async function x() {
    let o = "...";
    // ...
}  // ← Function closes

// PER-MESSAGE SOURCES
try {
    let sourceButtons = ...  // ← ERROR: 'o' is not defined!
}
```

**Correct approach** (v18.6 final):
```javascript
async function x() {
    let o = "...";
    // ...

    // PER-MESSAGE SOURCES (moved to end in v18.6)
    try {
        let sourceButtons = ...  // ← Works! 'o' is accessible
    } catch (e) { ... }

}  // ← Function closes HERE

x();
})();
```

### Implementation

Created `tools/reorder_sections_v18.6.js` that:
1. Finds section boundaries by comment lines
2. Extracts sections in order
3. Reorders: Part1 → Answer → All Sources → Images → Per-Message Sources → closing brace → x(); })();
4. Updates version number
5. Updates comments

**Key insight**: Per-Message Sources must come **BEFORE** the closing brace `}` of function `x()`, but **AFTER** all other sections.

---

## 🎯 Benefits

✅ **Matches user request** - Per-Message Sources at the very end
✅ **Logical flow** - Main content first, detailed sources last
✅ **All Sources prominent** - Combined sources appear higher up
✅ **Per-message details** - Specific sources for each message at end

---

## 🔄 Migration from v18.5

### For Users:

**What's different**:
- "Per-Message Sources" section moved to the very end
- "All Sources (Combined)" moved up (appears before Per-Message Sources)
- Other sections remain in same order

**Action required**:
1. Delete old v18.5 bookmarklet
2. Copy v18.6 code
3. Create new bookmark

**No breaking changes** - All sections still present, just reordered.

---

## 📦 Files

**New**:
- `perplexity_v18.6.js` - Production bookmarklet (26.5 KB)
- `perplexity_v18.6_readable.js` - Source (12.4 KB)
- `CHANGELOG_v18.6.md` - This file
- `tools/reorder_sections_v18.6.js` - Section reordering utility

**Updated**:
- N/A (v18.5 unchanged)

**Unchanged**:
- `perplexity_v18.5.js` - Previous version (still available)

---

## 🧪 Testing

### Expected Section Order:

```bash
# Verify order in output
grep "^## " perplexity_v18.6_YYYY-MM-DD.md
```

Should output:
```markdown
## Metadata
## Prompt
## Per-Message Reasoning
## Answer
## All Sources (Combined)      ← 5th section
## Images                        ← 6th section
## Related Questions             ← 7th section
## Per-Message Sources          ← 8th section (LAST)
```

---

## 🔮 Future Improvements

Potential enhancements for v18.7+:

1. **Configurable section order**
   - Let users choose section order
   - Store preference in localStorage

2. **Collapsible sections**
   - Add HTML details/summary
   - Show/hide sections by default

3. **Section numbering**
   - Auto-generate from sections
   - Link to each section

---

**Version**: 18.6
**Release Date**: 2026-01-08
**Status**: ✅ Ready for use
**Note**: Per-Message Sources moved to very end as requested
