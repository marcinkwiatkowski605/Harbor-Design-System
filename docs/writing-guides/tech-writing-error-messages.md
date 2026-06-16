# Writing Helpful Error Messages — Reference

Source: https://developers.google.com/tech-writing/error-messages

## Kluczowe zasady

### Fundamentalna zasada
Dobry komunikat o błędzie odpowiada na dwa pytania:
1. **Co poszło nie tak?** (przyczyna)
2. **Jak użytkownik to naprawia?** (rozwiązanie)

Komunikat który nie odpowiada na oba pytania → zły komunikat.

### Wyjaśnianie problemu
- Identyfikuj konkretną przyczynę błędu, nie tylko symptom
  - "Error occurred" ❌ — nie mówi co się stało
  - "The `color` token value `#ZZZ` is not a valid hex color." ✅
- Wskazuj nieprawidłowe wejście użytkownika gdy to ono jest przyczyną
  - Podaj co zostało podane i dlaczego jest nieprawidłowe
- Określaj wymagania i ograniczenia
  - "Token names must start with a letter and contain only letters, numbers, and hyphens."

### Wyjaśnianie rozwiązania
- Powiedz użytkownikowi co konkretnie zrobić
  - "Check the API documentation" ❌
  - "Set `variant` to one of: primary, secondary, ghost, danger." ✅
- Podaj przykład poprawnej wartości gdy to możliwe
- Nie zmuszaj użytkownika do domyślania się rozwiązania

### Pisanie jasno
- **Zwięzłość**: usuń wszystkie słowa które nie wnoszą informacji
  - "An error has occurred in the system" → "The token value is invalid."
- **Brak podwójnych negatywów**: "not invalid" → "valid"; "not disabled" → "enabled"
- **Spójność terminologii**: używaj tych samych nazw co w dokumentacji i UI
- **Format**: dla złożonych błędów używaj list; jedna linia dla prostych błędów
- **Ton**: pomocowy, nie oskarżycielski
  - "You forgot to specify..." ❌
  - "Specify the required `name` prop." ✅
- **Brak żargonu technicznego** (o ile nie piszesz dla deweloperów)

### Złe komunikaty o błędach — wzorce do rozpoznania
- Nieokreślona przyczyna: "Something went wrong", "Invalid value", "Error"
- Brak wskazówki jak naprawić: "Authentication failed" (co zrobić?)
- Nieprecyzyjne informacje: "The value is too long" (jaki limit?)
- Mylący język lub podwójne negatywy
- Nieznane następne kroki: komunikat który nie mówi co dalej

## Wzorce do stosowania (before → after)

| Przed | Po |
|---|---|
| "Invalid token value." | "The token `brand.color.primary` has an invalid value `#ZZZ`. Use a valid hex color (e.g., `#0057FF`)." |
| "Error in configuration." | "The `borderRadius` token is missing. Add it to your `tokens.json` file." |
| "Authentication failed." | "Your API key is invalid or expired. Generate a new key at [link]." |
| "The value is not valid." | "The `spacing` value must be a number in pixels (e.g., `16`). Received: `medium`." |
| "You provided wrong input." | "The `size` prop accepts: `sm`, `md`, `lg`. Received: `large`." |

## Wzorce do unikania

- Generyczne: "Error", "Something went wrong", "Invalid input"
- Oskarżycielskie: "You forgot to...", "You provided..."
- Bez rozwiązania: błąd bez wskazówki co zrobić
- Nieprecyzyjne: brak wartości którą podano, brak oczekiwanej wartości
- Podwójne negatywy: "not an invalid value"
- Żargon nieznany odbiorcy

## Zastosowanie w DS

- **Walidacja tokenów**: "Token `{name}` has value `{value}` which is not a valid {type}. Expected: {format}."
- **Brakujące props**: "The `{component}` component requires the `{prop}` prop. Add `{prop}=\"{example}\"` to your usage."
- **Nieprawidłowe warianty**: "`{value}` is not a valid variant for `{component}`. Use one of: {list}."
- **Błędy TypeScript**: komunikaty w typach powinny wyjaśniać przyczynę i podawać poprawną strukturę
- **Deprecated API**: "The `{prop}` prop is deprecated and will be removed in v{version}. Use `{replacement}` instead."
- **Błędy build-time (np. Style Dictionary)**: podaj plik, linię, token i konkretny problem
