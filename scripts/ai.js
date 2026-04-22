export async function askAI(prompt) {
  try {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    });

    const data = await res.json();

    return data.reply;

  } catch (err) {
    return "AI not connected yet";
  }
}