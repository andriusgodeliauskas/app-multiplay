# App Multiplay

Tai yra „App Multiplay“ projektas – mokomoji ir pramoginė programėlė, sukurta su React Native (Expo).

## Funkcionalumas (Features)

*   **Matematikos žaidimas:** Vartotojai sprendžia matematinius uždavinius ("Learn & Earn").
*   **Monstrų kambarys:** Uždirbtus pinigus galima leisti perkant ir atrakinant įvairius monstrus.
*   **Ekonomika:** Monetų kaupimas sprendžiant uždavinius.
*   **Nustatymai:**
    *   Foninė muzika su įjungimo/išjungimo galimybe.
    *   Kalbų palaikymas (LT/EN).
*   **Technologijos:**
    *   React Native / Expo
    *   React Navigation (Material Top Tabs)
    *   AsyncStorage (duomenų saugojimui)
    *   Expo AV (garsui)

## GitHub Saugykla

Projekto failai siunčiami į: [https://github.com/andriusgodeliauskas/app-multiplay](https://github.com/andriusgodeliauskas/app-multiplay)

### Failų siuntimas (komandos)

Jei norite rankiniu būdu atnaujinti saugyklą:

1.  **Pridėti visus pakeitimus:**
    ```bash
    git add .
    ```

2.  **Užfiksuoti pakeitimus:**
    ```bash
    git commit -m "Atnaujintas projektas"
    ```

3.  **Išsiųsti į GitHub:**
    ```bash
    git push origin main
    ```

## Paleidimas (Development)

1.  Įdiekite priklausomybes:
    ```bash
    npm install
    ```

2.  Paleiskite projektą (Expo):
    ```bash
    npx expo start
    ```