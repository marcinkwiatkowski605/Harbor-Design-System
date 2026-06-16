# Tech Writing for Accessibility — Reference

Source: https://developers.google.com/tech-writing/accessibility

## Kluczowe zasady

### Projektowanie dla wszystkich
- Dostępna dokumentacja = czytelna i zrozumiała dla wszystkich, w tym dla osób używających czytników ekranu
- Zasady dostępności stosują się do: design docs, komentarzy w kodzie, UI tekstu, helpów CLI, komunikatów o błędach — nie tylko formalnej dokumentacji
- Sprawdź: czy treść jest zrozumiała bez koloru? bez obrazków? za pomocą samego tekstu?

### Alt text dla obrazków i diagramów
- Każdy obraz informacyjny wymaga alt tekstu
- Alt text opisuje *treść i cel* obrazu, nie jego wygląd ("A diagram showing the token hierarchy from primitive to semantic to component-level" nie "A colorful diagram")
- Dla złożonych diagramów technicznych: alt text + pełny opis tekstowy w treści dokumentu
- Obrazy dekoracyjne: pusty alt (`alt=""`) lub pomiń — czytnik ekranu pominie je
- Długość alt tekstu: tyle ile potrzeba, ale zwięźle; długie opisy → do treści strony

### Kontrast kolorów
- Tekst na tle: min. 4.5:1 (normalna wielkość), 3:1 (duży tekst)
- Nie przekazuj informacji wyłącznie przez kolor (np. "czerwony = błąd" bez ikony lub tekstu)
- Diagramy: wybieraj kolory przyjazne dla daltonistów lub dodawaj wzory/kształty jako drugi kanał informacji

### Język inkluzywny
- Unikaj terminów z historycznym ładunkiem wykluczenia (whitelist/blacklist → allowlist/denylist)
- Unikaj terminów deprecjonujących zdolności ("simple", "easy", "just", "obviously")
- Unikaj kulturowych założeń i idiomów
- Pisz w drugiej osobie ("you") — neutralne płciowo i bezpośrednie
- Przykłady kodu: używaj opisowych, neutralnych kulturowo nazw zmiennych

### Dostępne wizualizacje
- Diagramy: dodawaj tekstowy opis alternatywny w treści (nie tylko alt text)
- Struktura tabeli: zawsze używaj nagłówków kolumn (`<th>`); unikaj tabel do layoutu
- Nie polegaj wyłącznie na pozycji/układzie przestrzennym do przekazania znaczenia
- Zapewnij tekstową wersję treści diagramu (np. jako lista lub tekst opisowy pod diagramem)

### Edycja pod kątem dostępności
- Sprawdź: czy każdy obraz ma alt text?
- Sprawdź: czy informacja przekazana kolorem ma też tekstowy odpowiednik?
- Sprawdź: czy język jest inkluzywny (brak "simple", "easy", "obviously")?
- Sprawdź: czy nagłówki tworzą logiczną hierarchię (H1 → H2 → H3)?
- Sprawdź: czy linki mają opisowy tekst ("See the Button API" nie "Click here")?

## Wzorce do stosowania (before → after)

| Przed | Po |
|---|---|
| "whitelist / blacklist" | "allowlist / denylist" |
| "simple configuration" | "configuration" |
| "just add the token" | "add the token" |
| "obviously, use Button for..." | "use Button for..." |
| Link: "Click here" | Link: "See Button component API" |
| Alt: "image.png" | Alt: "Diagram showing Button variants: primary, secondary, ghost" |

## Wzorce do unikania

- Obrazy bez alt tekstu
- Informacja przekazana tylko przez kolor
- "simple", "easy", "just", "obviously" — zakładają że odbiorca już wie
- "Click here", "Read more" — nieinformacyjne teksty linków
- Tabele używane do layoutu zamiast danych
- Idiomy i metafory kulturowe

## Zastosowanie w DS

- **Każdy diagram tokenów/komponentów**: alt text + tekstowy odpowiednik pod diagramem
- **Przykłady kolorów**: zawsze podawaj wartość hex/token obok próbki koloru
- **Status tokenu (deprecated, experimental)**: oznaczaj tekstem, nie tylko kolorem
- **Linki do Storybook/sandbox**: opisowe teksty ("Open Button in Storybook") nie "here"
- **Sekcja dostępności komponentu**: opisz jak komponent zachowuje się z czytnikiem ekranu, jakie role/atrybuty ARIA eksponuje
- **Unikaj w opisach**: "easy to use", "simply pass", "obviously", "just set"
