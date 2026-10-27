

export default async function handler(req, res) {
  console.log(`API Key exists? ${process.env.DEEPSEEK_KEY} `, !!process.env.DEEPSEEK_KEY);
  console.log(req.body);
  console.log(req);
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée." });
  }

  const body = typeof req.body === "string"
    ? JSON.parse(req.body)
    : req.body;

    console.log(body);
    console.log(body.message)
    let prompt=body.message;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt manquant." });
  }

  try {
    const response = await fetch(process.env.DEEPSEEK_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DEEPSEEK_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.DEEPSEEK_MODEL || "deepseek-chat",
        messages: body.message,
        max_tokens: 250,
      }),
    });

  
    if (!response.ok) {
      const errorText = await response.text();
      console.error("DeepSeek error:", response.status, errorText);

      return res.status(response.status).json({
        error: "Erreur API DeepSeek",
        details: errorText,
      });
    }

    const data = await response.json();

    return res.status(200).json({
      reply: data.choices?.[0]?.message?.content ?? "",
      tokens: data.usage?.total_tokens ?? 0,
    });

  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({
      error: "Erreur serveur",
      details: error.message,
    });
  }
}

