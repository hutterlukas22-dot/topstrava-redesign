# Videá do hero slideru

Sem patria exporty Instagram reels. Slider ich hľadá presne pod týmito názvami:

    reel-1.mp4
    reel-2.mp4
    reel-3.mp4
    reel-4.mp4
    reel-5.mp4

Kým súbor neexistuje, slide zobrazí svoj poster a prepne sa po 5 sekundách,
takže stránka funguje aj bez videí.

## Odporúčaný formát

| | |
|---|---|
| Pomer strán | 9:16 (na výšku) |
| Rozlíšenie | 720 × 1280 stačí, 1080 × 1920 max |
| Kodek | H.264 (MP4), profil High, AAC zvuk |
| Dĺžka | 8–20 s |
| Veľkosť | **do 3 MB na klip** |

Veľkosť je dôležitá: videá sa načítavajú v hero sekcii, takže priamo
ovplyvňujú rýchlosť prvého zobrazenia stránky.

Ak máte ffmpeg, prevod z originálu:

    ffmpeg -i original.mp4 -vf "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280" \
           -c:v libx264 -crf 28 -preset slow -c:a aac -b:a 96k -movflags +faststart reel-1.mp4

`-movflags +faststart` presunie metadáta na začiatok súboru, aby sa video
dalo prehrávať skôr, než sa stiahne celé.

## Zmena titulkov a počtu klipov

Zoznam je v `src/layout.js` v konštante `reels` — súbor, poster, titulok
a štítok. Po úprave spustite `node build.js`.
