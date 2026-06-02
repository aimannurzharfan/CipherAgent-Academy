export const generateGeminiResponse = async (prompt, missionContext) => {
  const res = await fetch("/api/tutor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, missionContext }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `API error ${res.status}`);
  }

  const data = await res.json();
  return data.text;
};
