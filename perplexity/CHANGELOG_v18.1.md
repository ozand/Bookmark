# Changelog: v18 → v18.1

## Release Date: 2026-01-07

---

## 🆕 NEW FEATURE: Per-Message Sources Extraction

### Problem
In v18, the script only extracted sources from the **first** "X sources" button (Sidebar Sources), ignoring sources for individual chat messages.

### Solution
v18.1 extracts sources for **each message** in the conversation separately.

### Implementation

**Before (v18)**:
```javascript
// Find only FIRST button
let sb = Array.from(d.querySelectorAll("button")).find(x => /\d+\s+sources/i.test(x.innerText));
```

**After (v18.1)**:
```javascript
// Find ALL buttons
let sourceButtons = Array.from(d.querySelectorAll("button")).filter(x => /\d+\s+sources/i.test(x.innerText));

// Extract sources for each message
for(let i = 0; i < sourceButtons.length; i++) {
  let btn = sourceButtons[i];
  let sourceCount = btn.innerText.match(/\d+/)[0];
  o += "### Message " + (i+1) + " (" + sourceCount + " sources)\n";
  // ... extract sources ...
}
```

---

## 📝 Output Structure Change

### v18 Output:
```markdown
## Sidebar Sources
* [source1](url1)
* [source2](url2)
```

### v18.1 Output:
```markdown
## Per-Message Sources
### Message 1 (97 sources)
* [source1](url1)
* [source2](url2)
...

### Message 2 (79 sources)
* [source3](url3)
* [source4](url4)
...

---

## All Sources (Combined)
* [source1](url1)
* [source2](url2)
* [source3](url3)
* [source4](url4)
...
```

---

## 🔍 How It Works

1. **Finds all "X sources" buttons** on the page
   - Uses regex: `/\d+\s+sources/i` (matches "97 sources", "79 sources", etc.)
   - Filters all buttons, not just the first one

2. **Iterates through each button**
   - Extracts source count from button text
   - Clicks button to open modal
   - Waits 2 seconds for modal to load
   - Extracts all links from modal
   - Closes modal
   - Moves to next button

3. **Deduplicates per message**
   - Uses `Set()` to avoid duplicate links within each message
   - Different messages may have overlapping sources

4. **Keeps "All Sources (Combined)" section**
   - Maintains backward compatibility
   - Shows all unique sources from all messages combined
   - Useful for seeing complete source list at a glance

---

## ⚙️ Technical Details

### Button Selector
```javascript
Array.from(d.querySelectorAll("button"))
  .filter(x => /\d+\s+sources/i.test(x.innerText))
```

### Source Count Extraction
```javascript
let sourceCount = btn.innerText.match(/\d+/)[0];
// "97 sources" → "97"
```

### Modal Extraction
```javascript
let sl = d.querySelectorAll("div.h-full a");
// Same selector as v18 Sidebar Sources
```

### Modal Closing
```javascript
let cls = d.querySelector('button[data-testid="close-modal"]')
       || d.querySelector('button[aria-label="Close"]');
```

---

## 📊 Example Output

**Scenario**: Conversation with 2 messages
- Message 1: "PostgreSQL configuration" (97 sources)
- Message 2: "Query optimization tips" (79 sources)

**Output**:
```markdown
# Perplexity Report v18.1

## Metadata
- **Date**: 2026-01-07T20:30:00.000Z
- **URL**: https://www.perplexity.ai/search/...
- **Title**: PostgreSQL best practices

---

## Prompt
How to optimize PostgreSQL?

---

## Per-Message Sources

### Message 1 (97 sources)
* [Top 10 PostgreSQL best practices](https://www.instaclustr.com/...)
* [PostgreSQL tuning guide](https://www.instaclustr.com/...)
* [PostgreSQL performance tips](https://www.postgresql.org/...)
... (94 more)

### Message 2 (79 sources)
* [Query optimization techniques](https://www.postgresql.org/...)
* [EXPLAIN ANALYZE guide](https://www.crunchydata.com/...)
... (76 more)

---

## All Sources (Combined)
* [Top 10 PostgreSQL best practices](https://www.instaclustr.com/...)
* [PostgreSQL tuning guide](https://www.instaclustr.com/...)
... (all unique sources from both messages)

---

## Answer
[Full answer content...]

---

## Images
[Images...]
```

---

## ⚠️ Known Limitations

1. **Processing Time**
   - Each source button adds ~3 seconds (2s wait + 1s close)
   - 10 messages = ~30 seconds additional processing time
   - **Recommendation**: Be patient for long conversations

2. **Modal Detection**
   - Assumes modal structure: `div.h-full a`
   - May break if Perplexity changes modal DOM
   - **Fallback**: Shows error message if extraction fails

3. **Message-Content Linking**
   - Sources extracted by button order (1st, 2nd, 3rd...)
   - Doesn't directly link sources to answer content
   - **Future improvement**: Parse DOM to associate sources with answer sections

---

## ✅ Benefits

1. **Complete Source Tracking**
   - See exactly which sources were used for each answer
   - Identify source overlap between messages

2. **Better Research**
   - Understand which sources are consistently cited
   - Identify primary vs secondary sources

3. **Transparency**
   - Full visibility into Perplexity's research process
   - Verify source relevance per message

---

## 🔄 Migration from v18

### For Users
- **No changes needed** - bookmarklet works the same way
- **Expect longer processing** for conversations with many messages
- **New section in output**: "Per-Message Sources"

### For Developers
- **New files**: `perplexity_v18.1.js`, `perplexity_v18.1_readable.js`
- **Breaking changes**: None (backward compatible)
- **API changes**: None

---

## 📈 Performance Impact

| Messages | v18 Time | v18.1 Time | Increase |
|----------|----------|------------|----------|
| 1 | ~5s | ~8s | +3s |
| 2 | ~5s | ~11s | +6s |
| 5 | ~5s | ~20s | +15s |
| 10 | ~5s | ~35s | +30s |

**Formula**: `~5s base + (messages × 3s)`

---

## 🎯 Use Cases

### When v18.1 is MOST useful:
- Multi-turn conversations
- Research-heavy queries
- Verifying source consistency
- Academic research
- Fact-checking responses

### When v18 is sufficient:
- Single quick queries
- Sources not important
- Speed prioritized
- Simple Q&A

---

## 🐛 Bug Fixes

### Fixed in v18.1
- ✅ Now extracts ALL "X sources" buttons, not just first
- ✅ Sources organized by message
- ✅ Better source tracking for conversations

### Still Pending (for v19)
- ❌ Reasoning section still not working (regression from v17)
- ❌ Related Questions still not extracted
- ❌ No direct linking of sources to answer sections

---

## 📦 Files Changed

**New**:
- `perplexity_v18.1.js` - Minified bookmarklet (multi-line)
- `perplexity_v18.1_readable.js` - Readable development version
- `CHANGELOG_v18.1.md` - This file

**Unchanged**:
- `perplexity_v18.js` - Previous version (still available)

---

## 🚀 Installation

Same as v18 - see `INSTALL.md` for instructions.

**Quick Start**:
1. Copy contents of `perplexity_v18.1.js`
2. Create browser bookmark
3. Name it "Perplexity Extractor v18.1"
4. Run on any Perplexity page

---

## 📞 Feedback

If you find issues with v18.1:
1. Check browser console (F12) for errors
2. Verify "X sources" buttons are visible on page
3. Try refreshing the page
4. Report issues with: URL, browser, error message

---

**Version**: 18.1
**Release Date**: 2026-01-07
**Previous**: 18.0
**Status**: ✅ Ready for use
