export async function translateToUrduApi(text: string): Promise<string> {
  try {
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });

    const data = await res.json();
    return data.translated || "⚠️ Failed to translate.";
  } catch (err) {
    console.error("Frontend Translate Error:", err);
    return "⚠️ Failed to translate.";
  }
}
