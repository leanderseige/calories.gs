// Funktion zur Ermittlung der Kalorien mithilfe von ChatGPT/OpenAI
function getCalories(foodName) {
  const apiKey = "YOUR OPENAI API KEY"; // OpenAI API-Key hier einfügen
  const url = "https://api.openai.com/v1/chat/completions";

  const prompt = `Wie viele Kalorien hat "${foodName}"? Gib nur die Kalorienzahl zurück. Gib immer genau eine Zahl zurück. Wenn die Kalorien stark schwanken können, gib einen Mittelwert. Wichtig ist, stets genau eine und nur eine Zahl zurückzugeben.`;
  
  const payload = {
    "model": "gpt-4", // "gpt-3.5-turbo" funktioniert auch
    "messages": [{"role": "user", "content": prompt}],
    "max_tokens": 50
  };

  const options = {
    "method": "POST",
    "contentType": "application/json",
    "headers": {
      "Authorization": `Bearer ${apiKey}`
    },
    "payload": JSON.stringify(payload)
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    const json = JSON.parse(response.getContentText());
    return json.choices[0].message.content.trim(); // Gibt nur die Kalorienzahl zurück
  } catch (e) {
    return `Fehler: ${e.message}`;
  }
}

// Benutzerdefinierte Funktion für Google Sheets
function CALORIES(SPEISE) {
  return parseInt(getCalories(SPEISE));
}
