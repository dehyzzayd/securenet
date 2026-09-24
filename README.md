# SecureNet — site vitrine full-stack

Site vitrine haut de gamme pour **SecureNet**, installateur de vidéosurveillance,
contrôle d'accès, alarme et réseaux. Design « Heritage Prestige » (navy royal /
or ambré, type extended, scroll cinématique), en **français**.

Stack : **Astro 5** (SSR, `@astrojs/node`) · TypeScript · GSAP + Lenis · Leaflet
(carte) · Drizzle ORM + libSQL (SQLite) · Zod · Resend (optionnel).

---

## Démarrage rapide

```bash
cp .env.example .env        # variables (voir plus bas)
npm install
npm run db:push             # crée les tables SQLite (data/securenet.db)
npm run dev                 # → http://localhost:3040
```

> Les tables sont aussi créées automatiquement au premier appel API
> (`ensureSchema`), donc `db:push` est surtout utile pour initialiser à froid.

### Build / production

```bash
npm run build               # compile client + serveur (dist/)
npm run preview             # sert dist/server/entry.mjs (Node standalone)
```

Déployable sur tout hôte Node (Railway, Fly, VPS…). Pour Vercel/Netlify,
remplacer l'adapter `@astrojs/node` par l'adapter correspondant dans
`astro.config.mjs`.

---

## Variables d'environnement (`.env`)

| Variable | Rôle |
|---|---|
| `DATABASE_URL` | Base libSQL. Défaut : `file:./data/securenet.db`. Pour Postgres/Turso, changer l'URL. |
| `RESEND_API_KEY` | Clé Resend pour l'envoi d'e-mails. **Vide → les e-mails sont journalisés en console** (parfait en dev). |
| `MAIL_TO` | Adresse qui reçoit les demandes de contact. |
| `MAIL_FROM` | Expéditeur des e-mails (domaine vérifié chez Resend). |
| `ADMIN_PASSWORD` | Mot de passe de `/admin`. **À changer avant mise en ligne.** |
| `SESSION_SECRET` | Secret HMAC des sessions admin. Mettre une longue chaîne aléatoire. |
| `SITE_URL` | URL publique (SEO, cookies `Secure` en https). |

---

## Ce qui est livré

- **Page d'accueil** (`/`) avec toute la narration Heritage : hero, positionnement +
  carte de signature, chiffres clés (odomètres), **deck d'expertises** (cartes
  empilées animées), **chantiers de référence** (récit épinglé), **carte des zones
  d'intervention** (Leaflet), secteurs clients, révélation « Sur le terrain »
  (texte-masque), engagement, **dossier à télécharger** (mockup 3D), **contact**.
- **Backend** :
  - `POST /api/contact` — validation Zod, honeypot, rate-limit (5 / 10 min / IP),
    insertion `leads`, e-mail équipe + accusé de réception automatique.
  - `POST /api/download` — journalise le lead dans `downloads`, renvoie le PDF.
  - **Admin** `/admin` (protégé par mot de passe, cookie signé 7 j) : tableau des
    demandes, filtres par statut, mise à jour de statut, **export CSV**.
- **Mentions légales** (`/mentions-legales`) — squelette RGPD à compléter.
- **SEO** : `<title>`/description, Open Graph, JSON-LD `SecurityService`, favicon.
- **Accessibilité** : lien d'évitement, focus visibles, `prefers-reduced-motion`
  (désactive scroll lissé, épinglages et odomètres).

---

## Identité & médias

- **Logo** : construit à la main en SVG (`src/components/Logo.astro`) — périmètre
  chamfreiné + ouverture d'objectif + nœud réseau. Aucune image générée.
- **Illustrations blueprint** : SVG dessinés à la main (`public/media/blueprint/`).
- **Photos de services** : générées **en local** avec FLUX schnell (offline) via
  `scripts/gen-images.sh` → `public/media/services/*.png`.
  Pour les régénérer ou changer les prompts : `zsh scripts/gen-images.sh`.
  Remplacez-les par de vraies photos du client quand elles sont disponibles
  (mêmes noms de fichiers).
- **Dossier PDF** : `public/docs/dossier-securenet.pdf` est un **exemple** généré
  par `scripts/make-brochure.mjs`. À remplacer par la vraie plaquette.

---

## ⚠️ Contenu à personnaliser (placeholders)

Centralisé dans **`src/lib/data.ts`**. À confirmer / remplacer par le client :

- Coordonnées (`brand`) : téléphone, e-mail, adresse, horaires, ville, année.
- Chiffres (`stats`, `figures`) : ans d'expérience, nb de caméras / sites, délais.
- Chantiers (`projects`) : exemples **anonymisés** — remplacer par de vrais cas
  (avec accord client). Ne jamais inventer de logo ou de référence réelle.
- Zones (`zones`) : villes + coordonnées de la zone d'intervention réelle.
- Mentions légales : SIREN, forme juridique, hébergeur.

---

## Structure

```
src/
  layouts/Base.astro        # <head>, SEO, JSON-LD, rails, header/footer, script
  components/               # Logo, Title, Header, Footer
  sections/                 # Hero, Positioning, KeyFigures, ServiceDeck, Story,
                            # Zones, Partners, Reveal, Pillar, Download, Contact
  scripts/main.ts           # Lenis + GSAP : reveals, odomètres, deck, story,
                            # masque, carte lazy, book 3D, formulaires, menu
  styles/                   # tokens.css, base.css, components.css
  lib/                      # data.ts, db.ts, schema.ts, mail.ts, auth.ts, rate-limit.ts
  pages/                    # index, mentions-legales, admin/*, api/*
scripts/                    # db-push, make-brochure, gen-images
public/                     # fonts (self-host), media (blueprint, services), docs
```

## Admin

`/admin` → connexion avec `ADMIN_PASSWORD`. Tableau des demandes, changement de
statut (Nouveau → Contacté → Qualifié → Gagné / Perdu), export CSV
(`/api/admin/export.csv`). Déconnexion via le bouton latéral.

---

_Design : Heritage Prestige. Aucune donnée, logo ou photo tierce réutilisée._
