# Pigie (Web starter kit)

## Instalacja

Wymagana jest instalacja [Node.js](https://nodejs.org/).

Następnie konieczne jest zainstalowanie modułu Gulp (Jesli nie posiadasz)

```
npm install -g gulp
```
_-g flaga ta okresla ze moduł jest instalowany globalnie_

Po sklonowaniu repozytorium konieczne jest zainstalowanie wymaganych modułów
```
cd <folder_projektu>
npm install
```

Aby uruchomić serwer i proces budowy projektu
```
gulp
```

## Cechy framworka
- Browserify
- Gulp
- [Nunjucks Templates](https://mozilla.github.io/nunjucks/)
- SASS/SCSS
    - [Jeet Grid System](http://jeet.gs)
    - [Include Media](http://include-media.com/)

## Struktura katalogów

- **/_build (Niewersjonowany)** - Folder zawierający zbudowany projekt
- **/fonts** - Folder dla czcionek
- **/gulp** - Zawiera pliki opisujące zadania dla Gul\'a
- **/images** - Folder dla obrazków wykorzystywanych w szablonach

    - **/placeholders** - Folder dla obrazków tymczasowych (placeholderów)
- **/media** - Inne pliki takie jak dokumenty, wideo i inne wykorzystywane w szablonach
- **/node_modules (Niewersjonowany)** - Folder przechowujący moduly pobrane z NPM'a
- **/scripts** - Pliki skryptów
- **/styles** - Pliki styli
    - **/base** - Style bazowe
    - **/compontents** - Style poszczególnych powtarzalnych bloków/elementów/widgetów
    - **/layout** -  Style układu strony (bloków grupujących) takich jak naglowek, stopka, kontener treści (tylko style definiujące układ)
    - **/pages** - Style dla konkretnych podstron (elementów na podstronach które są unikalne tylko dla niej)
    - **/utils** - Pliki SCSS definiujące zmienne, funkcje pomocnicze.
- **/templates** - Folder z szablonami stron
- **/tools** - Narzędzia skrypty itd.
