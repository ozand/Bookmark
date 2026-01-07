#!/usr/bin/env node
/**
 * Bookmarklet Builder
 *
 * Converts readable JavaScript source code into a minified,
 * URL-encoded bookmarklet ready for browser use.
 *
 * Usage:
 *   node build-bookmarklet.js <source-file> <output-file>
 *
 * Example:
 *   node build-bookmarklet.js perplexity/perplexity_v18.2_readable.js perplexity/perplexity_v18.2.js
 */

const fs = require('fs');
const path = require('path');

function buildBookmarklet(sourceFile, outputFile) {
    console.log('🔨 Building bookmarklet...');

    // Read source file
    let code;
    try {
        code = fs.readFileSync(sourceFile, 'utf8');
        console.log('📖 Source:', sourceFile);
    } catch (e) {
        console.error('❌ Error reading source file:', e.message);
        process.exit(1);
    }

    // Remove 'javascript:' prefix if present
    code = code.replace(/^javascript:/, '');

    // NO minification - keep code as-is
    // encodeURIComponent will handle newlines and special characters correctly

    // Trim leading/trailing whitespace
    code = code.trim();

    // Wrap in IIFE if not already wrapped
    if (!code.startsWith('(function')) {
        code = '(function(){' + code + '})();';
    }

    // Create bookmarklet with encodeURIComponent
    // This is the key improvement: use standard API instead of manual encoding
    const bookmarklet = 'javascript:' + encodeURIComponent(code);

    // Write output
    try {
        fs.writeFileSync(outputFile, bookmarklet);
        console.log('✅ Output:', outputFile);
        console.log('📊 Stats:');
        console.log('   Source size:', fs.statSync(sourceFile).size, 'bytes');
        console.log('   Output size:', bookmarklet.length, 'bytes');
        console.log('   Compression:', Math.round((1 - bookmarklet.length / fs.statSync(sourceFile).size) * 100), '%');
    } catch (e) {
        console.error('❌ Error writing output file:', e.message);
        process.exit(1);
    }

    // Validate syntax
    console.log('\n🔍 Validating syntax...');
    try {
        const decoded = decodeURIComponent(bookmarklet.replace(/^javascript:/, ''));
        new Function(decoded);
        console.log('✅ Syntax is valid!');
    } catch (e) {
        console.error('❌ Syntax error:', e.message);
        process.exit(1);
    }

    // Check for template literals (should not exist in bookmarklets)
    console.log('\n🔍 Checking for template literals...');
    const templateLiteralPattern = /(?<!\\)`/g;
    const matches = code.match(templateLiteralPattern);
    if (matches && matches.length > 0) {
        console.warn('⚠️  Warning: Found', matches.length, 'backtick(s)');
        console.warn('   Note: Backticks inside string literals (for Markdown) are OK');
    } else {
        console.log('✅ No template literals found');
    }

    console.log('\n✨ Build complete!\n');
}

// CLI interface
if (require.main === module) {
    const args = process.argv.slice(2);

    if (args.length < 2) {
        console.log('Usage: node build-bookmarklet.js <source-file> <output-file>');
        console.log('');
        console.log('Example:');
        console.log('  node build-bookmarklet.js perplexity/perplexity_v18.2_readable.js perplexity/perplexity_v18.2.js');
        process.exit(1);
    }

    const [sourceFile, outputFile] = args;

    if (!fs.existsSync(sourceFile)) {
        console.error('❌ Source file not found:', sourceFile);
        process.exit(1);
    }

    buildBookmarklet(sourceFile, outputFile);
}

module.exports = { buildBookmarklet };
