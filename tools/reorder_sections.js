#!/usr/bin/env node
/**
 * Reorder sections in v18.4 to create v18.5
 * Moves Answer section before Sources sections
 */

const fs = require('fs');

const inputFile = 'perplexity/perplexity_v18.4_readable.js';
const outputFile = 'perplexity/perplexity_v18.5_readable.js';

const content = fs.readFileSync(inputFile, 'utf8');
const lines = content.split('\n');

// Find section boundaries
const sections = {
    reasoningEnd: null,
    perMessageSources: null,
    sidebarSources: null,
    answer: null,
    images: null
};

// Find line numbers for each section
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('// PER-MESSAGE SOURCES')) {
        sections.perMessageSources = i;
    } else if (lines[i].includes('// SIDEBAR SOURCES')) {
        sections.sidebarSources = i;
    } else if (lines[i].includes('// ANSWER')) {
        sections.answer = i;
    } else if (lines[i].includes('// IMAGES')) {
        sections.images = i;
    }
}

// Find reasoning end (before PER-MESSAGE SOURCES)
sections.reasoningEnd = sections.perMessageSources - 1;

console.log('Section boundaries:', sections);

// Extract sections
const part1 = lines.slice(0, sections.reasoningEnd); // Through reasoning
const answerSection = lines.slice(sections.answer, sections.images); // Answer section
const perMessageSources = lines.slice(sections.perMessageSources, sections.sidebarSources); // Per-message sources
const sidebarSources = lines.slice(sections.sidebarSources, sections.answer); // All sources
const part2 = lines.slice(sections.images); // Images and rest

// Reorder: Part1 + Answer + Per-Message Sources + Sidebar Sources + Part2
const reordered = [
    ...part1,
    ...answerSection,
    ...perMessageSources,
    ...sidebarSources,
    ...part2
];

// Update version number
for (let i = 0; i < reordered.length; i++) {
    if (reordered[i].includes('Perplexity Report v18.4')) {
        reordered[i] = reordered[i].replace('v18.4', 'v18.5');
    }
}

fs.writeFileSync(outputFile, reordered.join('\n'));
console.log('✅ Reordered:', outputFile);
console.log('Part1 (reasoning): lines 0-' + (part1.length - 1));
console.log('Answer: lines', part1.length, '-', (part1.length + answerSection.length - 1));
console.log('Per-Message Sources: lines', (part1.length + answerSection.length), '-', (part1.length + answerSection.length + perMessageSources.length - 1));
console.log('Sidebar Sources: lines', (part1.length + answerSection.length + perMessageSources.length), '-', (part1.length + answerSection.length + perMessageSources.length + sidebarSources.length - 1));
console.log('Images+: lines', (part1.length + answerSection.length + perMessageSources.length + sidebarSources.length), '-', reordered.length - 1);
