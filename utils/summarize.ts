export function generateSummary(text: string): string {
  const lines = text.split(". ");
  return lines.slice(0, 2).join(". ") + ".";
}
