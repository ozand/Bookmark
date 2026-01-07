# Bookmarklet Examples & Patterns

This document contains common patterns and examples for bookmarklet development.

---

## 📚 Table of Contents

- [Basic Patterns](#basic-patterns)
- [DOM Manipulation](#dom-manipulation)
- [Page Metadata](#page-metadata)
- [Button Clicking & Automation](#button-clicking--automation)
- [Data Extraction](#data-extraction)
- [File Downloads](#file-downloads)
- [Debugging & Testing](#debugging--testing)

---

## Basic Patterns

### IIFE Wrapper (Isolation)

Always wrap your bookmarklet code in an IIFE to avoid variable conflicts:

```javascript
(function() {
    // Your code here
    const myVariable = 'safe';
    console.log(myVariable);
})();
```

### Async/Await Pattern

For operations that require waiting:

```javascript
(async function() {
    const wait = ms => new Promise(r => setTimeout(r, ms));

    // Do something
    console.log('Start');

    // Wait 2 seconds
    await wait(2000);

    // Continue
    console.log('End');
})();
```

### User Input

Get input from the user:

```javascript
const name = prompt('Enter your name:', 'Guest');
if (name) {
    alert('Hello, ' + name + '!');
}
```

---

## DOM Manipulation

### Find Elements by Text

```javascript
// Find all buttons containing specific text
const buttons = Array.from(document.querySelectorAll('button'))
    .filter(btn => /sources/i.test(btn.innerText));

console.log('Found', buttons.length, 'source buttons');
```

### Find Elements by Attribute

```javascript
// Find elements with data-* attributes
const modal = document.querySelector('[data-testid="close-modal"]');

// Find elements with partial attribute match
const links = document.querySelectorAll('[href*="perplexity"]');
```

### Change Page Styles

```javascript
// Set page width for better readability
document.querySelector('body').style.setProperty('width', '800px');

// Invert colors for night mode
document.querySelector('body').style.setProperty('color', 'white');
document.querySelector('body').style.setProperty('background', 'black');
```

### Inject CSS

```javascript
const style = document.createElement('style');
style.textContent = `
    body { max-width: 800px; margin: 0 auto; }
    .removed { display: none !important; }
`;
document.head.appendChild(style);
```

---

## Page Metadata

### Get Page Info

```javascript
const pageInfo = {
    title: document.title,
    url: window.location.href,
    domain: window.location.hostname,
    date: new Date().toISOString()
};

console.log(pageInfo);
alert(JSON.stringify(pageInfo, null, 2));
```

### Get Meta Tags

```javascript
// Get description
const desc = Array.from(document.getElementsByTagName('meta'))
    .find(e => e.name === 'description')
    ?.content || 'No description';

// Get author
const author = Array.from(document.getElementsByTagName('meta'))
    .find(e => e.name === 'author')
    ?.content || 'Unknown';

console.log('Description:', desc);
console.log('Author:', author);
```

### Copy URL to Clipboard

```javascript
const url = window.location.href;
navigator.clipboard.writeText(url).then(() => {
    alert('URL copied: ' + url);
});
```

---

## Button Clicking & Automation

### Click Button with Text

```javascript
const button = Array.from(document.querySelectorAll('button'))
    .find(btn => /submit/i.test(btn.innerText));

if (button) {
    button.click();
    console.log('Button clicked!');
} else {
    console.log('Button not found');
}
```

### Click and Wait for Content

```javascript
(async function() {
    const wait = ms => new Promise(r => setTimeout(r, ms));

    // Find and click button
    const btn = document.querySelector('.expand-button');
    if (btn) {
        btn.click();
        console.log('Clicked, waiting for content...');

        // Wait for content to load
        await wait(3000);

        // Now extract content
        const content = document.querySelector('.expanded-content');
        console.log(content?.innerText);
    }
})();
```

### Multiple Clicks with Delays

```javascript
(async function() {
    const wait = ms => new Promise(r => setTimeout(r, ms));

    const buttons = document.querySelectorAll('.item-button');

    for (let i = 0; i < buttons.length; i++) {
        buttons[i].click();
        console.log('Clicked button', i + 1);
        await wait(1000); // Wait 1 second between clicks
    }

    console.log('All buttons clicked!');
})();
```

---

## Data Extraction

### Extract All Links

```javascript
const links = Array.from(document.querySelectorAll('a'))
    .filter(a => a.href && !a.href.includes('javascript:'))
    .map(a => ({
        text: a.innerText.trim(),
        url: a.href
    }));

console.log('Found', links.length, 'links');
console.log(links);
```

### Extract Images

```javascript
const images = Array.from(document.querySelectorAll('img'))
    .filter(img => img.src && img.naturalWidth > 100)
    .map(img => img.src);

console.log('Found', images.length, 'images');
console.log(images);
```

### Extract Text Content

```javascript
// Get main content
const content = document.querySelector('main, article, #content');

if (content) {
    const text = content.innerText
        .replace(/\s+/g, ' ')  // Remove extra whitespace
        .trim();

    console.log('Content length:', text.length);
    console.log(text);
}
```

### Extract Table Data

```javascript
const table = document.querySelector('table');

if (table) {
    const rows = Array.from(table.querySelectorAll('tr'))
        .map(row => Array.from(row.querySelectorAll('td, th'))
            .map(cell => cell.innerText.trim())
        );

    console.table(rows);
}
```

---

## File Downloads

### Download as Text File

```javascript
function downloadFile(filename, content) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Usage
const content = 'Hello, World!\nThis is a bookmarklet download.';
downloadFile('example.txt', content);
```

### Download as JSON

```javascript
const data = {
    title: document.title,
    url: window.location.href,
    timestamp: new Date().toISOString()
};

const json = JSON.stringify(data, null, 2);
const blob = new Blob([json], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'page-data.json';
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
```

### Download as Markdown

```javascript
const md = `# ${document.title}

**URL:** ${window.location.href}
**Date:** ${new Date().toISOString()}

## Content

${document.querySelector('main')?.innerText || 'No content found'}
`;

const blob = new Blob([md], { type: 'text/markdown' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'page.md';
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
```

---

## Debugging & Testing

### Console Logging

```javascript
console.log('Simple message');
console.error('Error message');
console.warn('Warning message');
console.info('Info message');

// Log objects
console.log({ key: 'value', array: [1, 2, 3] });

// Log with label
console.log('Page title:', document.title);
```

### Element Highlighting

```javascript
// Highlight element for debugging
const element = document.querySelector('.target');
if (element) {
    element.style.border = '3px solid red';
    element.style.background = 'yellow';
    console.log('Element highlighted:', element);
}
```

### Count Elements

```javascript
const count = document.querySelectorAll('*').length;
console.log('Total elements:', count);

const counts = {};
document.querySelectorAll('*').forEach(el => {
    counts[el.tagName] = (counts[el.tagName] || 0) + 1;
});
console.table(counts);
```

### Display Page Info

```javascript
const info = `
Page Information:
==================
Title: ${document.title}
URL: ${window.location.href}
Elements: ${document.querySelectorAll('*').length}
Links: ${document.querySelectorAll('a').length}
Images: ${document.querySelectorAll('img').length}
Scripts: ${document.querySelectorAll('script').length}
`;

alert(info);
```

---

## Advanced Patterns

### Retry Logic

```javascript
async function retry(fn, maxAttempts = 3, delay = 1000) {
    for (let i = 0; i < maxAttempts; i++) {
        try {
            return await fn();
        } catch (e) {
            if (i === maxAttempts - 1) throw e;
            console.log(`Attempt ${i + 1} failed, retrying...`);
            await new Promise(r => setTimeout(r, delay));
        }
    }
}

// Usage
retry(() => {
    const element = document.querySelector('.late-content');
    if (!element) throw new Error('Element not found');
    return element.innerText;
}).then(text => console.log(text));
```

### Wait for Element

```javascript
async function waitForElement(selector, timeout = 10000) {
    const start = Date.now();

    while (Date.now() - start < timeout) {
        const element = document.querySelector(selector);
        if (element) return element;
        await new Promise(r => setTimeout(r, 100));
    }

    throw new Error('Element not found: ' + selector);
}

// Usage
waitForElement('.dynamic-content', 5000)
    .then(el => console.log('Found:', el))
    .catch(err => console.error(err));
```

### MutationObserver

```javascript
// Watch for DOM changes
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.classList?.contains('new-content')) {
                console.log('New content detected!', node);
                // Do something with new content
            }
        });
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Don't forget to disconnect when done!
// observer.disconnect();
```

---

## Tips & Best Practices

### ✅ DO:
- Always use IIFE wrapper
- Add error handling with try-catch
- Log actions to console for debugging
- Use `encodeURIComponent()` for bookmarklet generation
- Test in browser console first
- Use descriptive variable names

### ❌ DON'T:
- Use template literals (backticks with `${}`) - use string concatenation
- Use arrow functions in IIFE wrapper - use `function()`
- Use `import`/`export` statements
- Assume elements exist - check `null`/`undefined`
- Make synchronous blocking operations
- Use `alert()` in production (use `console.log` instead)

---

## Testing Your Bookmarklet

1. **Open browser console** (F12)
2. **Paste your code** (without `javascript:` prefix)
3. **Run and test**
4. **Check for errors**
5. **Only then** build bookmarklet with `tools/build-bookmarklet.js`

### Using the Web Builder

Open `tools/bookmarklet-builder.html` in your browser:
- Write code in the editor
- Click "Test Code" to execute
- Click "Build Bookmarklet" to generate
- Drag the link to your bookmarks bar

---

## Resources

- [MDN Web Docs](https://developer.mozilla.org/)
- [Bookmarklet Wiki](https://en.wikipedia.org/wiki/Bookmarklet)
- [Reddit r/bookmarklets](https://www.reddit.com/r/bookmarklets/)
- [100+ Useful Bookmarklets](https://www.hongkiat.com/blog/100-useful-bookmarklets-for-better-productivity-ultimate-list/)

---

**Last Updated:** 2026-01-08
**Contributors:** ozand
