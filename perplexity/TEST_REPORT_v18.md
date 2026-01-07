# Test Report: Perplexity v18 Script

**Date**: 2026-01-07
**Version**: v18
**Test Page**: PostgreSQL administration best practices query
**Output File**: `perplexity_v18_2026-01-07.md` (4753 lines)

---

## ✅ SUCCESSFUL Features

### 1. **Metadata Extraction** ✓ PERFECT
```
## Metadata
- **Date**: 2026-01-07T20:26:56.015Z
- **URL**: https://www.perplexity.ai/search/issledui-luchshie-praktiki-i-p-4fZyQh0ZQoS_b9CeiaQ4dA
- **Title**: исследуй лучшие практики и подходы по администратированию, оптимизации и...
```
**Status**: Works perfectly
**Improvement over v17**: NEW feature

---

### 2. **Artifact Filtering** ✓ PERFECT
**Before (v17)**:
```markdown
## Answer

Chart
Code Interpreter Graph
Chart
Code Interpreter Graph
Excellent. Now I have all the research complete...
```

**After (v18)**:
```markdown
## Answer

Excellent. Now I have all the research complete with comprehensive coverage and visualizations...
```

**Result**: Artifacts completely removed!
**Status**: WORKING AS INTENDED
**Improvement over v17**: FIXED

---

### 3. **Image Extraction** ✓ EXCELLENT
- **Captured**: 4 high-quality images
- **Sources**: All from ppl-ai-code-interpreter-files.s3.amazonaws.com
- **Quality**: Full resolution with authentication tokens
- **Line numbers**: 4750-4753

**Images captured**:
1. PostgreSQL Configuration Parameters chart
2. Query optimization flowchart
3. Performance monitoring diagram
4. Performance comparison tables

**Status**: Better than v17 (improved loading detection)
**Improvement over v17**: ENHANCED (up to 20 attempts vs fixed 2.5s)

---

### 4. **Answer Content** ✓ COMPLETE
- **Language**: Russian (as expected)
- **Structure**: Well-formatted with headings, lists, code blocks
- **Citations**: Preserved with links to sources
- **Code blocks**: Formatted with backticks
- **Length**: ~4500 lines of comprehensive content

**Major sections**:
- ## Комплексное руководство по администрированию и оптимизации PostgreSQL
- ## Стратегическая конфигурация памяти и ресурсов
- ## Оптимизация параметров Write-Ahead Logging (WAL)
- ## Стратегическое управление автоматической очисткой (Autovacuum)
- ...and 10+ more sections

**Status**: Complete and well-formatted

---

## ❌ FAILED / MISSING Features

### 1. **Reasoning Section** ❌ MISSING
**Expected**:
```markdown
## Reasoning
### Step 1
Я исследую лучшие практики администрирования...
> **Queries:** PostgreSQL database administration best practices 2025
- [Top 10 PostgreSQL® best practices...]
```

**Actual**: Section not present in output

**Analysis**:
- Present in v17 output
- Button not found or DOM structure changed
- Selector: `.group\\/goal` may be outdated
- Button text: "steps" or "reasoning" may have changed

**Impact**: MEDIUM - Reasoning steps provide valuable context
**Priority**: Fix for v18.1

---

### 2. **Related Questions** ❌ MISSING
**Expected**:
```markdown
## Related Questions
1. Как настроить PostgreSQL для высокой конкурентности?
2. Какие есть лучшие практики для вакууминга?
```

**Actual**: Section not present in output

**Analysis**:
- Multiple selectors tried, none matched
- Possible reasons:
  1. Feature not available for this query
  2. DOM structure different than expected
  3. Questions loaded dynamically after script execution

**Impact**: LOW - Nice to have but not critical
**Priority**: Fix for v18.1 or v19

---

## 📊 COMPARISON: v17 vs v18

| Feature | v17 | v18 | Change |
|---------|-----|-----|--------|
| Metadata | ❌ | ✅ | NEW |
| Prompt | ✅ | ✅ | Same |
| Reasoning | ✅ | ❌ | **REGRESSION** |
| Sidebar Sources | ✅ | ✅ | Same |
| Answer (with artifacts) | ⚠️ | ✅ | **FIXED** |
| Images | ✅ | ✅ | Enhanced |
| Related Questions | ❌ | ❌ | Same (not working) |

**Net Improvement**: +2 enhancements, -1 regression, 1 same

---

## 🔍 ROOT CAUSE ANALYSIS

### Reasoning Section Failure

**Code Location**: `perplexity_v18.js` lines 27-51

```javascript
let b = Array.from(d.querySelectorAll("button")).find(x => /steps|reasoning/i.test(x.innerText));
if(b) {
  b.click();
  await w(1000);
  let gs = d.querySelectorAll(".group\\/goal");
  // ...
}
```

**Possible Issues**:
1. Button text changed (not "steps" or "reasoning")
2. Button selector too specific
3. DOM structure different
4. Timing issue (need longer wait after click)

**Recommendation**: Add fallback selectors and better error logging

---

## 🎯 RECOMMENDATIONS

### For v18.1 (Hotfix)
1. **Fix Reasoning extraction**
   - Add more button text patterns
   - Add fallback selectors
   - Increase wait time after click
   - Add console.log for debugging

2. **Improve Related Questions**
   - Add delay before checking
   - Try more selectors
   - Check if feature exists for query type

### For v19 (Future)
1. **Add configurable options**
   - Include/exclude sections
   - Adjustable timeouts

2. **Better error handling**
   - Log to console which sections failed
   - Show summary to user

3. **Enhanced debugging**
   - Add `debugMode` flag
   - Log each step

---

## 📝 CONCLUSION

**Overall Assessment**: ⚠️ **PARTIAL SUCCESS**

**Strengths**:
- ✅ Metadata works perfectly
- ✅ Artifact filtering completely successful
- ✅ Image extraction improved
- ✅ Answer content complete

**Weaknesses**:
- ❌ Reasoning section regression (worked in v17)
- ❌ Related Questions still not working

**Recommendation**: **Release v18.1** with Reasoning fix

**Score**: **7/10** - Good improvements, but needs regression fix
