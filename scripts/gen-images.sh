#!/bin/zsh
# Generate SecureNet service/site imagery locally with FLUX schnell (offline, no credits).
set -e
cd /Users/mac/securenet
OUT=public/media/services
mkdir -p "$OUT"
MODEL="dhairyashil/FLUX.1-schnell-mflux-4bit"
NEG="text, watermark, logo, letters, caption, distorted, deformed, blurry, cartoon, illustration, cctv timestamp overlay, ugly, low quality"
STEPS=4

gen () {
  local name="$1" w="$2" h="$3" seed="$4" prompt="$5"
  if [ -f "$OUT/$name.png" ]; then echo "skip $name"; return; fi
  echo ">>> generating $name (${w}x${h})"
  uvx --from mflux mflux-generate \
    --model "$MODEL" --base-model schnell \
    --steps $STEPS --seed $seed --width $w --height $h --no-metadata \
    --negative-prompt "$NEG" \
    --output "$OUT/$name.png" \
    --prompt "$prompt" 2>&1 | tail -2
}

gen videosurveillance 1024 768 11 "professional documentary photograph of a modern white IP dome CCTV security camera mounted on a concrete building corner, clear sky background, sharp focus on the camera, shallow depth of field, warm slightly desaturated cinematic color grade, high detail, realistic photo"
gen controle-acces 1024 768 12 "close-up realistic photograph of a hand presenting an RFID access badge to a wall-mounted electronic card reader beside a glass office door, modern interior, warm directional light, shallow depth of field, high detail"
gen alarme-intrusion 1024 768 13 "realistic photograph of a white wall-mounted PIR motion detection sensor and a modern intrusion alarm keypad panel in a clean home hallway, soft warm ambient light, shallow depth of field, high detail"
gen reseau-infrastructure 1024 768 14 "realistic photograph of a tidy network server rack with organized ethernet patch cables and a network switch showing green status LEDs, data closet, technician working, cinematic warm light, high detail"
gen telesurveillance 1024 768 15 "realistic cinematic photograph of a security monitoring control room with a wall of screens showing multiple CCTV camera feeds, dim blue lighting with warm accents, over the shoulder view, professional"
gen etude-conseil 1024 768 16 "realistic photograph of a security technician in a work uniform holding a tablet displaying a building floor plan while standing on a commercial site, golden hour light, shallow depth of field, professional documentary style"
gen positioning 864 1088 17 "realistic photograph of a professional installer in a branded work uniform mounting a CCTV security camera on a ceiling using a cordless drill, focused expression, warm cinematic lighting, shallow depth of field, high detail"
gen partners 1024 720 18 "wide realistic architectural photograph of a modern commercial office building exterior at blue hour, small security cameras visible on the facade, warmly lit windows, cinematic, professional real estate photography"

echo "ALL DONE"
ls -la "$OUT"
