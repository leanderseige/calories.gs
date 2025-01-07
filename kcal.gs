// Funktion zur Ermittlung der Kalorien mithilfe von ChatGPT/OpenAI mit Retry und Cache
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

  const maxAttempts = 3; // Maximal 3 Versuche
  const initialDelayMs = 3000; // Erste Verzögerung: 3 Sekunden

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = UrlFetchApp.fetch(url, options);
      const json = JSON.parse(response.getContentText());
      const content = json.choices[0].message.content.trim();
      console.log(`Antwort von ChatGPT beim Versuch ${attempt}: ${content}`);

      // Versuch, die Antwort in eine Zahl umzuwandeln
      const calories = parseInt(content, 10);
      if (isNaN(calories)) {
        throw new Error(`Ungültige Kalorienantwort: "${content}"`);
      }

      return calories; // Erfolgreiche Antwort zurückgeben
    } catch (e) {
      if (attempt < maxAttempts) {
        const delayMs = initialDelayMs * attempt; // Erhöhtes Delay bei jedem Versuch
        console.log(`Fehler beim Versuch ${attempt}: ${e.message}. Warte ${delayMs / 1000} Sekunden vor erneutem Versuch.`);
        Utilities.sleep(delayMs); // Verzögerung vor erneutem Versuch
      } else {
        return `Fehler nach ${maxAttempts} Versuchen: ${e.message}`;
      }
    }
  }
}

// Benutzerdefinierte Funktion für Google Sheets
function CALORIES(SPEISE) {
  const result = getCalories(SPEISE);
  if (typeof result === "number") {
    return result; // Gibt die Kalorienzahl zurück
  } else {
    return `Fehler: ${result}`; // Gibt eine Fehlermeldung zurück
  }
}
