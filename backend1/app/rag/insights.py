import os
import google.generativeai as genai
from sentence_transformers import SentenceTransformer
from .retrieve import search
import json

genai.configure(api_key=os.environ.get("GEMINI_API_KEY", "AIzaSyDevLzJIM-I20i3OBTCE4ZINUBfwRzNuE8"))
embed_model = SentenceTransformer("all-MiniLM-L6-v2")

PROMPT = """
You are a careful research assistant. Given ONLY the following passages from a PDF, extract insights for each category below. Do not use any outside knowledge. If a category is not present, return an empty list for it. Be concise and specific. Do not hallucinate or invent facts.

User highlighted this text:
"{highlight}"

Related passages:
{related}

Extract and return JSON in this schema:
{{
    "key_takeaways": ["..."],
    "did_you_know": ["..."],
    "contradictions": ["..."],
    "examples": ["..."],
    "inspirations": ["..."]
}}
Only use information present in the passages above. If nothing is found for a category, return an empty list for it.
"""

def generate_insights(highlight):
    q_emb = embed_model.encode([highlight])[0]
    neighbors = search(q_emb, top_k=5)
    related_texts = [n["text"] for n in neighbors]
    related = "\n\n".join(related_texts)
    prompt = PROMPT.format(highlight=highlight, related=related)
    response = genai.GenerativeModel("gemini-2.5-flash").generate_content(
        prompt
    )
    try:
        result = json.loads(response.text)
    except json.JSONDecodeError:
        text = response.text.strip().split("```")[-1]
        result = json.loads(text)

    # Post-process: filter out hallucinated content (not present in related passages)
    def filter_items(items):
        filtered = []
        for item in items:
            for passage in related_texts:
                if item and item.strip() and item.lower()[:10] in passage.lower():
                    filtered.append(item)
                    break
        return filtered

    for key in ["key_takeaways", "did_you_know", "contradictions", "examples", "inspirations"]:
        if key in result and isinstance(result[key], list):
            # Only keep items that have some overlap with the related passages
            result[key] = filter_items(result[key])
    return result
