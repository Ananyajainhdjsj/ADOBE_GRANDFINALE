// src/services/searchService.js
export async function searchSnippets(query, k = 5) {
  const response = await fetch('/api/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, k }),
  });
  if (!response.ok) throw new Error('Search failed');
  return response.json();
}
