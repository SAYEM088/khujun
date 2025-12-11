# llmapi.py
 
from llama_cpp import Llama
MODEL_PATH = "../model/tinyllama.gguf"
llm = Llama(
    model_path=MODEL_PATH,
    n_ctx=2048,
    temperature=0.7,
    top_p=0.9,
    n_threads=4
)
def generate_summaries(pois):
    for poi in pois:
        prompt = f"""You are an assistant generating very short, helpful descriptions.
Place:
Name: {poi['name']}
Category: {poi['category']}
Type: {poi['type']}
Distance: {poi['distance_km']} km

Write ONLY 1–2 sentences describing why this place might be useful.
"""
        try:
            result = llm(
                prompt,
                max_tokens=100,
                stop=["###", "\n\n"]
            )
            text = result["choices"][0]["text"].strip()

            if len(text) < 3:
                text = "No additional info available."

            poi["summary"] = text

        except Exception as e:
            poi["summary"] = "Summary not available due to model error."

    return pois
