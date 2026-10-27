import { DEEPSEEK_BASE_URL, DEEPSEEK_MODEL } from "./constantes";


export async function getDeepResponse(message) {
  console.log("avant le retour de deepseek");
  console.log(JSON.stringify({message}));
  const response = await fetch("/api/deepseek", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({message})
  });

  return response.json();
}
