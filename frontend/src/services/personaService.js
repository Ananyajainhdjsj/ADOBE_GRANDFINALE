// Service to fetch relevant snippets for Persona Analyzer
export async function fetchRelevantSnippets({ pdfId, selection, context, topK = 5 }) {
  const response = await fetch('/api/persona/snippets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      pdf_id: pdfId,
      selection,
      context,
      top_k: topK,
    }),
  });
  if (!response.ok) throw new Error('Failed to fetch snippets');
  return response.json();
}
