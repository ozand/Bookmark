# Changelog: v18.1 → v18.2

## Release Date: 2026-01-07

---

## 🆕 NEW FEATURE: Per-Message Reasoning Extraction

### Problem
In v18.1, sources were extracted per message, but the **reasoning/thinking process** for each message was not captured. Users couldn't see:
- What queries Perplexity searched for
- The step-by-step reasoning process
- How sources were selected and used

### Solution
v18.2 extracts reasoning for **each message** by clicking all "X steps completed" buttons and capturing the expanded reasoning content.

---

## 🔍 How It Works

### Step 1: Find Reasoning Buttons
```javascript
let reasoningButtons = Array.from(d.querySelectorAll("button"))
    .filter(x => /\d+\s+steps\s+completed/i.test(x.innerText));
```

Matches buttons like:
- "7 steps completed"
- "6 steps completed"
- "15 steps completed"

### Step 2: Extract Reasoning Content

For each button:
1. **Click to expand** reasoning section
2. **Wait 3 seconds** for content to load
3. **Try 3 extraction strategies**:
   - Strategy 1: Search siblings for reasoning indicators
   - Strategy 2: Look for specific CSS classes
   - Strategy 3: Extract text from button's neighborhood

### Step 3: Organize by Message
```markdown
## Per-Message Reasoning

### Message 1 (7 steps)
Searched: "PostgreSQL skip scan multicolumn index"
Found: 15 sources
Step 1: Understanding multicolumn indexes...
Step 2: Analyzing skip scan optimization...
...

### Message 2 (6 steps)
Searched: "PostgreSQL 18 new features"
...
```

---

## 🎯 Extraction Strategies

### Strategy 1: Sibling Search
```javascript
// Look for reasoning indicators in sibling elements
if (text.includes("Searched") || text.includes("Step") ||
    text.includes("Found") || text.includes("Query")) {
    // Extract first 30 lines
}
```

**Matches**:
- "Searched: PostgreSQL query optimization"
- "Step 1: Analyzing..."
- "Found: 12 sources"

### Strategy 2: CSS Class Search
```javascript
// Look for elements with reasoning-related classes
let nearbyElements = d.querySelectorAll('[class*="reasoning"], [class*="step"], [data-reasoning]');
```

**Matches**:
- `<div class="reasoning-content">`
- `<div data-reasoning="true">`
- `<div class="step-container">`

### Strategy 3: Neighborhood Extraction
```javascript
// Extract text after "steps completed"
let stepsIndex = allText.indexOf("steps completed");
let afterSteps = allText.substring(stepsIndex + 14).trim();
```

**Fallback**: If specific strategies fail, extract text near button

---

## 📝 Output Structure

### v18.1 Output:
```markdown
## Per-Message Sources
### Message 1 (97 sources)
### Message 2 (79 sources)
```

### v18.2 Output:
```markdown
## Per-Message Reasoning
### Message 1 (7 steps)
Searched: "PostgreSQL best practices 2025"
Found: 25 sources
[Reasoning content...]

### Message 2 (6 steps)
Searched: "Query optimization techniques"
...

---

## Per-Message Sources
### Message 1 (97 sources)
### Message 2 (79 sources)
```

---

## ⚙️ Configuration

### Wait Time
```javascript
await w(3000); // Wait 3 seconds for content to load
```

**Why 3 seconds?**
- Reasoning content is loaded dynamically
- 2 seconds may not be enough for complex reasoning
- 3 seconds ensures content is fully loaded
- Each message adds +3s to processing time

### Line Limits
```javascript
.slice(0, 30); // Limit to first 30 lines (Strategy 1)
.slice(0, 20); // Limit to first 20 lines (Strategy 3)
```

**Why limits?**
- Avoid extracting entire page content
- Focus on reasoning steps
- Prevent overflow from nearby content

---

## 📊 Performance Impact

| Messages | v18.1 Time | v18.2 Time | Increase |
|----------|------------|------------|----------|
| 1 | ~8s | ~11s | +3s |
| 2 | ~11s | ~17s | +6s |
| 5 | ~20s | ~35s | +15s |
| 10 | ~35s | ~65s | +30s |

**Formula**: `~5s base + (messages × 6s)`
- +3s per message for reasoning
- +3s per message for sources

---

## ✅ Benefits

1. **Full Process Visibility**
   - See what Perplexity searched for
   - Understand reasoning steps
   - Track source selection process

2. **Better Research**
   - Learn from Perplexity's approach
   - Identify key sources used
   - Understand query refinement

3. **Educational Value**
   - Study AI reasoning process
   - Improve your own search queries
   - Learn effective research techniques

---

## ⚠️ Known Limitations

### 1. **Dynamic Content Loading**
- Reasoning loads via AJAX after click
- 3 second wait may not be enough for slow connections
- **Mitigation**: Strategies 2 & 3 don't require waiting

### 2. **DOM Structure Variations**
- Perplexity may change CSS classes
- Button text may vary
- **Mitigation**: 3 different extraction strategies

### 3. **Fallback Content**
- If reasoning not found, shows error message
- Doesn't break entire extraction
- **Mitigation**: Graceful degradation

### 4. **Content Boundaries**
- May extract nearby text accidentally
- Limited to first 20-30 lines
- **Mitigation**: Line limits and keyword filtering

---

## 🔧 Troubleshooting

### Issue: "Unable to extract reasoning content"

**Possible causes**:
1. Perplexity changed DOM structure
2. Content took longer than 3 seconds to load
3. Reasoning not available for this message

**Solutions**:
1. Open browser console (F12) for error details
2. Refresh page and try again
3. Check if "X steps completed" button exists

### Issue: Extracted wrong content

**Possible causes**:
1. Content boundaries not detected correctly
2. Similar keywords in nearby content

**Solutions**:
1. Manual review of extracted content
2. Report issue with URL and extracted content

---

## 🎯 Use Cases

### When v18.2 is MOST useful:
- **Learning**: Study AI reasoning patterns
- **Research**: Understand search strategies
- **Optimization**: Improve your own queries
- **Verification**: Check Perplexity's logic
- **Education**: Teaching research methods

### When v18.1 is sufficient:
- Quick fact-checking
- Speed prioritized
- Reasoning not important
- Simple queries

---

## 📦 Files Changed

**New**:
- `perplexity_v18.2.js` - Production bookmarklet (320 lines, readable)
- `perplexity_v18.2_readable.js` - Same as above (kept for compatibility)
- `CHANGELOG_v18.2.md` - This file

**Updated**:
- `TEST_REPORT_v18.md` → needs update for v18.2

**Unchanged**:
- `perplexity_v18.1.js` - Previous version (still available)
- `perplexity_v18.js` - Original version (still available)

---

## 🔄 Migration from v18.1

### For Users
- **No breaking changes** - backward compatible
- **New section**: "Per-Message Reasoning" appears before Sources
- **Longer wait time**: +3s per message
- **Same installation**: Copy bookmarklet, create bookmark

### For Developers
- **New function**: Per-message reasoning extraction
- **New strategies**: 3 extraction methods with fallbacks
- **Error handling**: Graceful degradation if reasoning not found
- **Logging**: Console errors for debugging

---

## 🧪 Testing Checklist

Before using v18.2 on important queries:

- [ ] Test on single-message query
- [ ] Test on multi-message conversation
- [ ] Verify reasoning content is correct
- [ ] Check sources are still extracted properly
- [ ] Verify metadata is accurate
- [ ] Test on slow connection (may need longer wait)
- [ ] Check console for errors (F12)

---

## 📞 Feedback

If you find issues with v18.2:
1. Open browser console (F12)
2. Run the bookmarklet
3. Note any error messages
4. Check extracted reasoning content
5. Report with: URL, browser, error, extracted content

---

## 🔮 Future Improvements (v18.3+)

1. **Adaptive Wait Time**
   - Detect when content actually loads
   - Use MutationObserver for dynamic content
   - Reduce wait time when possible

2. **Better Content Boundaries**
   - Detect reasoning section boundaries
   - Avoid extracting nearby content
   - Use semantic HTML markers

3. **Structured Extraction**
   - Parse reasoning steps into sections
   - Extract query terms separately
   - Identify source citations

4. **Performance Optimization**
   - Parallel extraction (multiple buttons at once)
   - Reduce redundant DOM queries
   - Cache parent elements

---

**Version**: 18.2
**Release Date**: 2026-01-07
**Previous**: 18.1
**Status**: ✅ Ready for testing
**Note**: Reasoning extraction uses 3 fallback strategies for reliability
