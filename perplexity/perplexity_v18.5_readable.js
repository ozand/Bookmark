javascript: (function () {
    const d = document;
    const w = m => new Promise(r => setTimeout(r, m));

    // Markdown converter - converts HTML to Markdown
    const md = n => {
        if (3 == n.nodeType) return n.textContent.replace(/\s+/g, " ");
        if (1 !== n.nodeType) return "";

        let t = n.tagName.toLowerCase(), c = "";
        Array.from(n.childNodes).forEach(k => c += md(k));

        if (["p", "div", "h1", "h2", "h3", "h4"].includes(t))
            c = "\n\n" + c + "\n\n";
        if ("li" == t) c = "\n- " + c.trim();
        if ("strong" == t || "b" == t) return " **" + c.trim() + "** ";
        if ("em" == t || "i" == t) return " *" + c.trim() + "* ";
        if ("a" == t) return " [" + c.trim() + "](" + n.href + ") ";
        if ("img" == t) return "\n![img](" + n.src + ")\n";
        if ("code" == t) return " `" + c + "` ";
        if ("pre" == t) return "\n```\n" + n.innerText + "\n```\n";
        if (t.startsWith("h")) return "\n" + "#".repeat(parseInt(t[1])) + " " + c.trim() + "\n\n";
        return c;
    };

    async function x() {
        let o = "# Perplexity Report v18.5\n\n";

        // METADATA
        o += "## Metadata\n";
        o += "- **Date**: " + new Date().toISOString() + "\n";
        o += "- **URL**: " + window.location.href + "\n";
        o += "- **Title**: " + document.title + "\n\n---\n\n";

        // PROMPT
        try {
            let h = d.querySelector("h1");
            if (h) o += "## Prompt\n" + h.innerText.trim() + "\n\n---\n\n";
        } catch (e) {}

        // PER-MESSAGE REASONING (NEW IN v18.2)
        try {
            let reasoningButtons = Array.from(d.querySelectorAll("button"))
                .filter(x => /\d+\s+steps\s+completed/i.test(x.innerText));

            if (reasoningButtons.length > 0) {
                o += "## Per-Message Reasoning\n";

                for (let i = 0; i < reasoningButtons.length; i++) {
                    let btn = reasoningButtons[i];
                    let stepCount = btn.innerText.match(/\d+/)[0];

                    // Click to expand reasoning
                    btn.click();
                    await w(3000); // Wait 3 seconds for content to load

                    // Find reasoning steps using v17 approach
                    let buttonParent = btn.closest('[id^="radix"]');
                    let stepsFound = false;

                    if (buttonParent) {
                        // Look for .group/goal elements (reasoning steps)
                        let goalSelectors = ['.group\\/goal', '[class*="group"][class*="goal"]', '[class*="reasoning"]'];
                        let gs = null;

                        // Try each selector
                        for (let sel of goalSelectors) {
                            try {
                                gs = buttonParent.querySelectorAll(sel);
                                if (gs && gs.length > 0) break;
                            } catch (e) {}
                        }

                        if (gs && gs.length > 0) {
                            o += "### Message " + (i + 1) + " (" + stepCount + " steps)\n\n";

                            gs.forEach((g, stepIndex) => {
                                // Get step description
                                let t = g.querySelector(".pr-sm, [class*='pr-sm'], [class*='text'], p");
                                if (t && t.innerText.trim() !== "Finished" && t.innerText.trim().length > 0) {
                                    o += "#### Step " + (stepIndex + 1) + "\n";
                                    o += t.innerText.trim() + "\n\n";

                                    // Get search queries
                                    let sq = Array.from(g.querySelectorAll(".bg-subtler, [class*='subtler'], [class*='query']"));
                                    if (sq.length > 0) {
                                        let qt = sq.map(el => el.innerText.replace(/search/gi, "").trim()).filter(t => t.length > 0);
                                        if (qt.length > 0) {
                                            o += "> **Queries:** " + qt.join(", ") + "\n\n";
                                        }
                                    }

                                    // Get source links
                                    let l = Array.from(g.querySelectorAll("a"));
                                    if (l.length > 0) {
                                        l.forEach(link => {
                                            if (link.href && !link.href.includes("perplexity")) {
                                                let linkText = link.innerText.replace(/\n/g, " ").trim();
                                                if (linkText.length > 0) {
                                                    o += "- [" + linkText + "](" + link.href + ")\n";
                                                }
                                            }
                                        });
                                        o += "\n";
                                    }
                                }
                            });

                            stepsFound = true;
                            o += "\n";
                        }
                    }

                    if (!stepsFound) {
                        o += "### Message " + (i + 1) + " (" + stepCount + " steps)\n\n";
                        o += "> Unable to extract reasoning steps\n\n";
                    }

                    // Optional: collapse back
                    // btn.click();
                    // await w(500);
                }

                o += "---\n\n";
            }
        } catch (e) {
            console.log("Error extracting reasoning:", e);
            o += "> Error extracting per-message reasoning\n";
        }
        // ANSWER (with artifact filtering)
        try {
            let c = d.querySelectorAll('[id^="markdown-content"]');
            if (c.length) {
                o += "## Answer\n";

                // Filter out artifacts
                const artifacts = ["Chart", "Code Interpreter Graph", "Code Interpreter", "Programming, Chart"];

                c.forEach(z => {
                    let text = md(z);
                    // Remove artifact lines
                    text = text.split('\n')
                        .filter(line => {
                            const trimmed = line.trim();
                            return !artifacts.some(a => trimmed === a);
                        })
                        .join('\n');

                    // Clean up multiple empty lines
                    text = text.replace(/\n{3,}/g, '\n\n');

                    o += text;
                });
                o += "\n---\n\n";
            }
        } catch (e) {}

        // PER-MESSAGE SOURCES (from v18.1)
        try {
            let sourceButtons = Array.from(d.querySelectorAll("button"))
                .filter(x => /\d+\s+sources/i.test(x.innerText));

            if (sourceButtons.length > 0) {
                o += "## Per-Message Sources\n";

                for (let i = 0; i < sourceButtons.length; i++) {
                    let btn = sourceButtons[i];
                    let sourceCount = btn.innerText.match(/\d+/)[0];
                    o += "### Message " + (i + 1) + " (" + sourceCount + " sources)\n";

                    btn.click();
                    await w(2000);

                    let sl = d.querySelectorAll("div.h-full a");
                    if (sl.length) {
                        let u = new Set();
                        sl.forEach(l => {
                            if (l.href && !l.href.includes("perplexity") && !u.has(l.href)) {
                                u.add(l.href);
                                o += "* [" + l.innerText.split("\n")[0] + "](" + l.href + ")\n";
                            }
                        });
                    }

                    let cls = d.querySelector('button[data-testid="close-modal"]') || d.querySelector('button[aria-label="Close"]');
                    if (cls) {
                        cls.click();
                        await w(1000);
                    }

                    o += "\n";
                }

                o += "---\n\n";
            }
        } catch (e) {
            o += "> Error extracting per-message sources\n";
        }

        // SIDEBAR SOURCES (legacy)
        try {
            let sb = Array.from(d.querySelectorAll("button")).find(x => /\d+\s+sources/i.test(x.innerText));
            if (sb) {
                sb.click();
                await w(2000);
                let sl = d.querySelectorAll("div.h-full a");
                if (sl.length) {
                    o += "## All Sources (Combined)\n";
                    let u = new Set();
                    sl.forEach(l => {
                        if (l.href && !l.href.includes("perplexity") && !u.has(l.href)) {
                            u.add(l.href);
                            o += "* [" + l.innerText.split("\n")[0] + "](" + l.href + ")\n";
                        }
                    });
                    o += "\n---\n\n";
                }
                let cls = d.querySelector('button[data-testid="close-modal"]') || d.querySelector('button[aria-label="Close"]');
                if (cls) {
                    cls.click();
                    await w(1000);
                } else {
                    console.log("Close btn missing");
                }
            }
        } catch (e) {
            o += "> Error Sidebar\n";
        }

        // IMAGES
        try {
            let ti = Array.from(d.querySelectorAll("button[role='tab'], div[role='tab']"))
                .find(t => /Images|Media/i.test(t.innerText) || t.querySelector('use[xlink\\:href*="icon-image"]'));
            if (ti) {
                o += "## Images\n";
                ti.click();
                await w(2500);

                // Wait for images to load with better checking
                let attempts = 0;
                let maxAttempts = 20;
                while (attempts < maxAttempts) {
                    let loadedCount = Array.from(d.querySelectorAll("img[src*='http']"))
                        .filter(img => img.complete && img.naturalWidth > 0).length;
                    if (loadedCount > 0) break;
                    await w(500);
                    attempts++;
                }

                let im = d.querySelectorAll("img");
                let us = new Set();
                im.forEach(m => {
                    if (m.src && !m.src.includes("favicon") && m.naturalWidth > 100 && !us.has(m.src)) {
                        us.add(m.src);
                        o += "![ref](" + m.src + ")\n";
                    }
                });
            }
        } catch (e) {}

        // RELATED QUESTIONS
        try {
            // Try to find related questions section
            const relatedSelectors = [
                '[data-testid="related-questions"]',
                '.related-questions',
                '[class*="related"]',
                '[class*="follow-up"]',
                '[class*="followup"]'
            ];

            for (const selector of relatedSelectors) {
                const rq = d.querySelector(selector);
                if (rq) {
                    const questions = rq.querySelectorAll('a, button, [role="button"]');
                    if (questions.length > 0) {
                        o += "\n---\n\n## Related Questions\n";
                        questions.forEach((q, i) => {
                            const text = q.innerText.trim();
                            if (text && text.length > 10) {
                                o += (i + 1) + ". " + text + "\n";
                            }
                        });
                        o += "\n---\n\n";
                        break;
                    }
                }
            }
        } catch (e) {}

        // DOWNLOAD
        let bl = new Blob([o.replace(/\n{3,}/g, "\n\n")], { type: "text/markdown" }),
            el = d.createElement("a");
        el.href = URL.createObjectURL(bl);
        el.download = "perplexity_v18.2_" + new Date().toISOString().slice(0, 10) + ".md";
        d.body.appendChild(el);
        el.click();
        d.body.removeChild(el);
    }

    x();
})();
