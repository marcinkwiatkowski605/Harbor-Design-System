# Tech Writing Two — Reference

Source: https://developers.google.com/tech-writing/two

## Kluczowe zasady

### Samoedycja
- Przyjmij i przestrzegaj jednego przewodnika stylu (np. Google Developer Documentation Style Guide)
- Pisz w drugiej osobie: zwracaj się do czytelnika "you", nie "we" lub "one"
- Warunki przed instrukcjami: "If you want X, do Y" (nie: "Do Y if you want X")
- Przed oddaniem dokumentu: odczekaj, wróć ze świeżym spojrzeniem, przeczytaj na głos
- Zmiana formatu (druk, zmiana czcionki) pomaga wychwycić błędy niewidoczne na ekranie
- Peer review: recenzent nie musi znać tematu, wystarczy znajomość przewodnika stylu

### Duże dokumenty
- Krótkie dokumenty sprawdzają się lepiej dla nowych odbiorców (how-to, overview, conceptual guide)
- Długie dokumenty sprawdzają się dla doświadczonych (tutorials, best practices, reference)
- Wprowadzenie dokumentu musi zawierać: (1) co dokument obejmuje, (2) wymagana wiedza wstępna, (3) czego dokument NIE obejmuje
- Zweryfikuj pod koniec pisania czy treść odpowiada temu co obiecuje wprowadzenie
- Nagłówki: opisuj aktywność czytelnika ("Configure the token pipeline") nie terminologię ("Token pipeline configuration")
- Pod każdym nagłówkiem umieszczaj krótkie zdanie kontekstu zanim pojawi się podnagłówek
- Treść: stopniowe ujawnianie — od prostego do złożonego; przeplataj koncepcje z ćwiczeniami

### Ilustracje i diagramy
- Tylko *instruktywne* grafiki pomagają w nauce; dekoracyjne grafiki nie
- Podpis pod diagramem: krótki (kilka słów), wyjaśnia co czytelnik powinien z niego wynieść
- Max. jedna porcja informacji (≈jeden akapit lub ≤5 bullet points) na jeden diagram
- Złożone systemy: dziel na podsystemy, osobny diagram na każdy
- Wskazówki wizualne (kółka, strzałki, callouts) kierują uwagę lepiej niż długi tekst
- Kolory: zapewnij wystarczający kontrast; nie przekazuj informacji wyłącznie przez kolor
- Format eksportu: SVG (skalowalny, dobra jakość)
- Pytania rewizyjne: Jak uprościć? Czy podzielić? Czy tekst jest czytelny na tle?

### Kod przykładowy
- Dobry przykładowy kod jest: **poprawny, zwięzły, zrozumiały, reużywalny, sekwencjonowany złożonością**
- Poprawność: musi się budować bez błędów, wykonywać to co deklaruje, być gotowy produkcyjnie (bez podatności)
- Komentarze: wyjaśniaj *dlaczego*, nie *co*; pomijaj oczywiste; dla zaawansowanych wyjaśniaj nieoczekiwane decyzje projektowe
- Identyfikatory: opisowe nazwy klas, metod, zmiennych; bez kryptycznych skrótów
- Sekwencja: zacznij od najprostszego przykładu → średni → zaawansowany
- Każdy przykład kodu: podaj instrukcje setup, zależności, oczekiwany output
- Testy jednostkowe ≠ przykładowy kod: testy weryfikują działanie, przykłady edukują

### Użycie LLM w pisaniu dokumentacji
- Nadaj LLM rolę: "Jesteś doświadczonym technical writerem piszącym dokumentację design systemu"
- Określ odbiorcę, typ dokumentu, cel i styl przed generowaniem
- Ogranicz zakres: "Używaj tylko informacji z poniższego tekstu:"
- Iteruj: ulepszaj prompt stopniowo; gdy edytowanie odpowiedzi jest szybsze niż ulepszanie promptu — edytuj
- Zawsze weryfikuj wygenerowaną treść pod kątem błędów i niespójności
- LLM przydatny do: first draft, reorganizacja, copy-editing, konwersja formatu, streszczenia

## Wzorce do stosowania

| Przed | Po |
|---|---|
| "We recommend configuring..." | "Configure the token..." |
| "Click Submit if you want to save." | "To save, click Submit." |
| Nagłówek: "Token Pipeline" | Nagłówek: "Configure the token pipeline" |
| Jeden wielki diagram całego systemu | Osobne diagramy: tokens → components → themes |

## Wzorce do unikania

- Zwracanie się do czytelnika przez "we" lub "one"
- Warunek po instrukcji: "Do X if you want Y"
- Podnagłówek bezpośrednio pod nagłówkiem bez zdania kontekstu
- Przykładowy kod który się nie kompiluje lub nie robi tego co mówi
- Komentarze wyjaśniające oczywiste rzeczy ("// set x to 5")
- Dekoracyjne grafiki bez wartości informacyjnej

## Zastosowanie w DS

- **Struktura strony komponentu**: wprowadzenie (co to jest, kiedy używać, czego NIE robi) → props → warianty → kod przykładowy (podstawowy → z opcjami → zaawansowany)
- **Kod przykładowy tokenów/komponentów**: importy, setup, oczekiwany output — zawsze kompletny i działający
- **Diagramy relacji tokenów**: osobny diagram per poziom (primitive → semantic → component)
- **Nagłówki sekcji**: opisuj co czytelnik robi ("Use the Button component") nie co to jest ("Button component")
- **LLM do draftu**: podaj istniejący komponent jako kontekst + role "DS technical writer"
