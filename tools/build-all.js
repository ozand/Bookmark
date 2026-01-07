#!/usr/bin/env node
/**
 * Batch Bookmarklet Builder
 *
 * Builds all bookmarklets in the repository automatically.
 *
 * Usage:
 *   node build-all.js
 *
 * Configuration:
 *   Edit the BOOKMARKLETS array below to add/remove bookmarklets.
 */

const fs = require('fs');
const path = require('path');
const { buildBookmarklet } = require('./build-bookmarklet.js');

// Bookmarklet configuration
// Format: [sourceFile, outputFile, description]
const BOOKMARKLETS = [
    // Perplexity bookmarklets
    ['perplexity/perplexity_v18.5_readable.js', 'perplexity/perplexity_v18.5.js', 'Perplexity v18.5'],
    ['perplexity/perplexity_v18.4_readable.js', 'perplexity/perplexity_v18.4.js', 'Perplexity v18.4'],
    ['perplexity/perplexity_v18.3_readable.js', 'perplexity/perplexity_v18.3.js', 'Perplexity v18.3'],
    ['perplexity/perplexity_v18.2_readable.js', 'perplexity/perplexity_v18.2.js', 'Perplexity v18.2'],
    ['perplexity/perplexity_v18.1_readable.js', 'perplexity/perplexity_v18.1.js', 'Perplexity v18.1'],
    // v18 temporarily disabled - needs investigation
    // ['perplexity/perplexity_v18_readable.js', 'perplexity/perplexity_v18.js', 'Perplexity v18'],

    // Add more bookmarklets here as needed
    // ['scribd.com/scripts_readable.js', 'scribd.com/scripts.js', 'Scribd'],
];

function buildAll() {
    console.log('🏗️  Building all bookmarklets...\n');
    console.log('='.repeat(60) + '\n');

    const results = {
        success: [],
        failed: []
    };

    for (let i = 0; i < BOOKMARKLETS.length; i++) {
        const [source, output, description] = BOOKMARKLETS[i];

        console.log(`\n[${i + 1}/${BOOKMARKLETS.length}] Building: ${description}`);
        console.log('─'.repeat(60));

        // Check if source exists
        if (!fs.existsSync(source)) {
            console.log(`⚠️  Source file not found: ${source}`);
            console.log('   Skipping...\n');
            results.failed.push({ description, reason: 'Source not found' });
            continue;
        }

        // Build bookmarklet
        try {
            buildBookmarklet(source, output);
            results.success.push({ description, source, output });
        } catch (e) {
            console.error(`❌ Build failed for ${description}`);
            console.error(`   Error: ${e.message}\n`);
            results.failed.push({ description, reason: e.message });
        }
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 BUILD SUMMARY');
    console.log('='.repeat(60));

    console.log(`\n✅ Successfully built: ${results.success.length}`);
    results.success.forEach(({ description, output }) => {
        const size = fs.statSync(output).size;
        console.log(`   ✓ ${description}: ${output} (${(size / 1024).toFixed(1)} KB)`);
    });

    if (results.failed.length > 0) {
        console.log(`\n❌ Failed: ${results.failed.length}`);
        results.failed.forEach(({ description, reason }) => {
            console.log(`   ✗ ${description}: ${reason}`);
        });
    }

    console.log('\n' + '='.repeat(60));

    if (results.failed.length === 0) {
        console.log('✨ All bookmarklets built successfully!\n');
        return 0;
    } else {
        console.log(`⚠️  ${results.failed.length} build(s) failed\n`);
        return 1;
    }
}

// Run if called directly
if (require.main === module) {
    const exitCode = buildAll();
    process.exit(exitCode);
}

module.exports = { buildAll };
