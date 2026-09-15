// Renders the "## Heading" Markdown-ish structure our health-info prompts
// (symptom checker, medicine info) are instructed to return, without pulling
// in a full Markdown library for a handful of headings and paragraphs.
export default function FormattedAIResponse({ text }: { text: string }) {
  const blocks = text
    .split(/\n(?=##\s)/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <div className="space-y-4">
      {blocks.map((block, i) => {
        const headingMatch = block.match(/^##\s+(.+)/);
        if (headingMatch) {
          const heading = headingMatch[1].trim();
          const body = block.slice(headingMatch[0].length).trim();
          return (
            <div key={i}>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">{heading}</h3>
              {body && <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{body}</p>}
            </div>
          );
        }
        return (
          <p key={i} className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {block}
          </p>
        );
      })}
    </div>
  );
}
