const fs = require("fs");
const path = require("path");

const root = process.cwd();

function visibleWordCount(html) {
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ");
  return (text.match(/[A-Za-z0-9]+(?:[-'][A-Za-z0-9]+)*/g) || []).length;
}

const files = fs.readdirSync(root).filter(f => f.endsWith(".html")).sort();

console.log("=== Visible Word Counts of HTML Files ===");
for (const file of files) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  const count = visibleWordCount(html);
  const hasAppendix = html.includes("LONGFORM_APPENDIX_START");
  const countWithoutAppendix = visibleWordCount(
    html.replace(/\n?\s*<!-- LONGFORM_APPENDIX_START -->[\s\S]*?<!-- LONGFORM_APPENDIX_END -->\n?/g, "")
  );
  console.log(`${file.padEnd(45)} | Total: ${String(count).padStart(5)} | Without Appendix: ${String(countWithoutAppendix).padStart(5)} | Has Appendix: ${hasAppendix}`);
}
