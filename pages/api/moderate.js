export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Vibra Chat"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a moderation AI. Respond only with SAFE or UNSAFE."
          },
          {
            role: "user",
            content: `Is this message safe for a public chat? "${message}"`
          }
        ]
      })
    });

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content || "SAFE";

    const flagged = result.toUpperCase().includes("UNSAFE");

    res.status(200).json({ flagged });

  } catch (error) {
    res.status(500).json({ error: "Moderation failed" });
  }
}
