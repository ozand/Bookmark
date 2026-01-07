#!/usr/bin/env node
/**
 * Reorder sections for v18.6
 * Moves Per-Message Sources to the very end (INSIDE function x(), BEFORE its call)
 */

const fs = require('fs');

const inputFile = 'perplexity/perplexity_v18.5_readable.js';
const outputFile = 'perplexity/perplexity_v18.6_readable.js';

const content = fs.readFileSync(inputFile, 'utf8');
const lines = content.split('\n');

// Find section boundaries
const sections = {
    reasoningEnd: null,
    answer: null,
    perMessageSources: null,
    sidebarSources: null,
    images: null,
    relatedQuestions: null,
    downloadStart: null,
    xCall: null,
    iifeClose: null
};

// Find line numbers for each section
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('// PER-MESSAGE REASONING')) {
        sections.reasoningEnd = i - 1;
    } else if (lines[i].includes('// ANSWER')) {
        sections.answer = i;
    } else if (lines[i].includes('// PER-MESSAGE SOURCES')) {
        sections.perMessageSources = i;
    } else if (lines[i].includes('// SIDEBAR SOURCES')) {
        sections.sidebarSources = i;
    } else if (lines[i].includes('// IMAGES')) {
        sections.images = i;
    } else if (lines[i].includes('// RELATED QUESTIONS')) {
        sections.relatedQuestions = i;
    } else if (lines[i].includes('// DOWNLOAD')) {
        sections.downloadStart = i;
    } else if (lines[i].includes('x();')) {
        sections.xCall = i;
    } else if (lines[i].trim() === '})();') {
        sections.iifeClose = i;
        break;
    }
}

sections.reasoningEnd = sections.answer - 1;

console.log('Section boundaries:', sections);

// Extract sections
const part1 = lines.slice(0, sections.reasoningEnd); // Through reasoning
const answerSection = lines.slice(sections.answer, sections.perMessageSources); // Answer
const perMessageSources = lines.slice(sections.perMessageSources, sections.sidebarSources); // Per-message sources
const sidebarSources = lines.slice(sections.sidebarSources, sections.images); // All sources
const imagesSection = lines.slice(sections.images, sections.xCall); // Images through end of download
const xCallAndIife = lines.slice(sections.xCall); // x(); })();

// Reorder: Part1 + Answer + All Sources + Images... + Per-Message Sources (inside x()) + closing brace + x(); })();
const reordered = [
    ...part1,
    ...answerSection,
    ...sidebarSources,  // All Sources
    ...imagesSection,   // Images, Related Questions, Download
    ...perMessageSources,  // Per-Message Sources INSIDE function x()
    '}',                // Closing brace of function x()
    ...xCallAndIife      // x(); })();
];

// Update version number
for (let i = 0; i < reordered.length; i++) {
    if (reordered[i] && reordered[i].includes('Perplexity Report v18.5')) {
        reordered[i] = reordered[i].replace('v18.5', 'v18.6');
    }
    if (reordered[i] && reordered[i].includes('// PER-MESSAGE SOURCES (from v18.1)')) {
        reordered[i] = reordered[i].replace('// PER-MESSAGE SOURCES (from v18.1)', '// PER-MESSAGE SOURCES (moved to end in v18.6)');
    }
}

fs.writeFileSync(outputFile, reordered.join('\n'));
console.log('✅ Reordered:', outputFile);
console.log('\nNew order:');
console.log('1. Metadata, Prompt, Reasoning');
console.log('2. Answer');
console.log('3. All Sources (Combined)');
console.log('4. Images, Related Questions, Download');
console.log('5. Per-Message Sources ← AT THE VERY END (before x();)');
console.log('6. x(); })();');
console.log('\nLine count:', reordered.length);
