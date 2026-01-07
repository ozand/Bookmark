# Perplexity Bookmarklet v18.5 - CHANGELOG

## 🎯 Overview

**Release Date**: 2026-01-08
**Version**: 18.5
**Previous**: 18.4
**Type: Improvement** - Section reordering

---

## 📋 What Changed

### Problem: Incorrect section order in v18.4

**In v18.4**, sections appeared in this order:

```markdown
1. Metadata
2. Prompt
3. Per-Message Reasoning
4. Per-Message Sources        ← WRONG
5. All Sources (Combined)      ← WRONG
6. Answer                      ← WRONG (should be earlier)
7. Images
8. Related Questions
```

**Issue**: Answer appeared AFTER Sources, but the web interface shows:
1. User query (Prompt)
2. Reasoning (steps)
3. **Answer** (main response)
4. Sources (per-message)

---

### Solution: Reordered to match web interface

**In v18.5**, sections now match the Perplexity web UI:

```markdown
1. Metadata
2. Prompt                     ← User's query
3. Per-Message Reasoning      ← AI thinking process
4. Answer                     ← MAIN RESPONSE (moved earlier!)
5. Per-Message Sources        ← Sources for each message
6. All Sources (Combined)     ← All sources at the end
7. Images
8. Related Questions
```

---

## 📊 Comparison

| Section | v18.4 Order | v18.5 Order | Match UI? |
|---------|-------------|-------------|-----------|
| Metadata | 1st | 1st | ✅ |
| Prompt | 2nd | 2nd | ✅ |
| Reasoning | 3rd | 3rd | ✅ |
| **Answer** | **6th** | **4th** | ✅ **Fixed!** |
| Per-Message Sources | 4th | 5th | ✅ |
| All Sources | 5th | 6th | ✅ |
| Images | 7th | 7th | ✅ |
| Related Questions | 8th | 8th | ✅ |

---

## 🎨 Output Format (v18.5)

```markdown
# Perplexity Report v18.5

## Metadata
- Date, URL, Title

---

## Prompt
[User's question]

---

## Per-Message Reasoning

### Message 1 (10 steps)

#### Step 1
[AI's thought process]

> **Queries:** search terms

- [Source 1](url)
- [Source 2](url)

#### Step 2
...

---

## Answer
[Main AI response with markdown formatting]

---

## Per-Message Sources

### Message 1 (19 sources)
* [Source link 1](url)
* [Source link 2](url)

### Message 2 (15 sources)
...

---

## All Sources (Combined)
* [All unique sources](url)
...

---

## Images
![img](url)

---

## Related Questions
* [Question 1](url)
```

---

## 🔍 Technical Details

### Code Changes

**v18.4 structure**:
```javascript
// Metadata, Prompt, Reasoning
...

// Per-Message Sources
try {
    let sourceButtons = ...
    // Extract sources
}

// Sidebar Sources
try {
    let sb = ...
    // Extract all sources
}

// Answer
try {
    let c = ...
    // Extract answer
}
```

**v18.5 structure** (reordered):
```javascript
// Metadata, Prompt, Reasoning
...

// Answer (MOVED HERE)
try {
    let c = ...
    // Extract answer
}

// Per-Message Sources (MOVED AFTER Answer)
try {
    let sourceButtons = ...
    // Extract sources
}

// Sidebar Sources (stays after Per-Message)
try {
    let sb = ...
    // Extract all sources
}
```

---

## 🎯 Benefits

✅ **Matches web UI** - Output order matches Perplexity interface
✅ **Answer first** - Main response appears before source lists
✅ **Logical flow** - Query → Thinking → Answer → Sources
✅ **Better readability** - Important content comes first
✅ **Per-message clarity** - Sources labeled "Message 1 (19 sources)"

---

## 🔄 Migration from v18.4

### For Users:

**What's different**:
- Answer section now appears **before** Sources
- More natural reading order
- Same content, just reorganized

**Action required**:
1. Delete old v18.4 bookmarklet
2. Copy v18.5 code
3. Create new bookmark

**No breaking changes** - All sections still present, just reordered.

---

## 📦 Files

**New**:
- `perplexity_v18.5.js` - Production bookmarklet (26.5 KB)
- `perplexity_v18.5_readable.js` - Source (12.4 KB)
- `CHANGELOG_v18.5.md` - This file
- `tools/reorder_sections.js` - Section reordering utility

**Updated**:
- N/A (v18.4 unchanged)

**Unchanged**:
- `perplexity_v18.4.js` - Previous version (still available)

---

## 🧪 Testing

### Expected Section Order:

```bash
# Verify order in output
grep "^## " perplexity_v18.5_YYYY-MM-DD.md
```

Should output:
```markdown
## Metadata
## Prompt
## Per-Message Reasoning
## Answer          ← 4th section
## Per-Message Sources
## All Sources (Combined)
## Images
## Related Questions
```

---

## 🔮 Future Improvements

Potential enhancements for v18.6+:

1. **Collapsible sections**
   - Add HTML anchors
   - Allow show/hide via CSS

2. **Table of contents**
   - Auto-generate from sections
   - Link to each section

3. **Custom ordering**
   - Let users choose section order
   - Configuration options

---

**Version**: 18.5
**Release Date**: 2026-01-08
**Status**: ✅ Ready for use
**Note**: Sections reordered to match Perplexity web interface
