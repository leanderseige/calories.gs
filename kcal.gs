// Funktion zur Ermittlung der Kalorien mithilfe von ChatGPT/OpenAI mit Retry und Cache
function getCaloriesWithCache(foodName) {
  const apiKey = "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"; // OpenAI API-Key hier einfügen
  const url = "https://api.openai.com/v1/chat/completions";
  const cache = CacheService.getScriptCache(); // Cache-Instanz erstellen
  const cachedCalories = cache.get(foodName); // Antwort aus dem Cache abrufen

  if (cachedCalories) {
    console.log(`Cache-Treffer für "${foodName}": ${cachedCalories}`);
    return parseInt(cachedCalories, 10); // Antwort aus Cache zurückgeben
  }

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

      // Antwort im Cache speichern (für 1 Stunde = 3600 Sekunden)
      cache.put(foodName, calories.toString(), 3600);
      console.log(`Antwort für "${foodName}" im Cache gespeichert: ${calories}`);

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
  return 0; // return 0 as indirect error message
}

// Benutzerdefinierte Funktion für Google Sheets
function CALORIES(SPEISE) {
  const result = getCaloriesWithCache(SPEISE);
  if (typeof result === "number") {
    return result; // Gibt die Kalorienzahl zurück
  } else {
    return `Fehler: ${result}`; // Gibt eine Fehlermeldung zurück
  }
}
