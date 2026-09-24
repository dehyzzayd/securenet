// SecureNet — contenu du site (FR). Copie réelle, sans lorem ipsum.
// NB placeholders: les chiffres et les chantiers ci-dessous sont des exemples
// à confirmer par le client (voir README → « Contenu à personnaliser »).

export const brand = {
  name: 'SecureNet',
  baseline: 'Sécurité & vidéosurveillance',
  since: 2013,
  region: 'Grand Casablanca',
  phone: '+212 5 23 00 00 00',
  whatsapp: '+212 6 00 00 00 00',
  email: 'contact@securenet.ma',
  address: 'Zone Industrielle — Mohammedia, Maroc',
  hours: 'Lun – Ven · 8h – 19h · Astreinte 7j/7',
};

export const stats = [
  { value: 12, plus: false, unit: 'ans', label: 'sur le terrain' },
  { value: 450, plus: true, unit: '', label: 'caméras installées' },
  { value: 180, plus: true, unit: '', label: 'sites sécurisés' },
];

export const figures = {
  headlineNumber: 12,
  headlineUnit: 'ans',
  since: 2013,
  rows: [
    { value: 450, plus: true, unit: '', label: 'caméras posées & configurées' },
    { value: 180, plus: true, unit: '', label: 'sites protégés au Maroc' },
    { value: 48, plus: false, unit: 'h', label: 'délai d’intervention moyen' },
  ],
};

export type Service = {
  n: string; slug: string; category: string; title: string;
  excerpt: string; points: string[];
};

export const services: Service[] = [
  {
    n: '01', slug: 'videosurveillance', category: 'Le cœur du métier',
    title: 'Vidéosurveillance',
    excerpt:
      'Caméras IP haute définition, vision nocturne et analyse d’image. Nous concevons le plan de couverture, posons le matériel et paramétrons la supervision à distance sur mobile.',
    points: ['Caméras dôme, tube & PTZ', 'Vision nocturne infrarouge', 'Accès mobile sécurisé', 'Enregistreur NVR sur mesure'],
  },
  {
    n: '02', slug: 'controle-acces', category: 'Maîtriser les entrées',
    title: 'Contrôle d’accès',
    excerpt:
      'Badges, digicodes, interphonie vidéo et gâches électriques. Chaque porte s’ouvre à la bonne personne, au bon moment, avec un historique complet des passages.',
    points: ['Badges & lecteurs', 'Interphonie vidéo', 'Gestion des droits', 'Journal des accès'],
  },
  {
    n: '03', slug: 'alarme-intrusion', category: 'Détecter & dissuader',
    title: 'Alarme & intrusion',
    excerpt:
      'Détecteurs de mouvement, d’ouverture et sirènes reliés à une centrale connectée. La levée de doute vidéo confirme l’alerte avant tout déclenchement inutile.',
    points: ['Détection volumétrique', 'Levée de doute vidéo', 'Centrale connectée', 'Alerte temps réel'],
  },
  {
    n: '04', slug: 'reseau-infrastructure', category: 'Quand tout est à construire',
    title: 'Réseau & infrastructure',
    excerpt:
      'Un bâtiment sans réseau ? Nous tirons le câblage, montons la baie, installons switchs et Wi-Fi. Une infrastructure propre, documentée, prête pour la vidéosurveillance.',
    points: ['Câblage cuivre & fibre', 'Baie de brassage', 'Switchs PoE', 'Couverture Wi-Fi'],
  },
  {
    n: '05', slug: 'telesurveillance-maintenance', category: 'Dans la durée',
    title: 'Télésurveillance & maintenance',
    excerpt:
      'Supervision continue, mises à jour et maintenance préventive. En cas de panne, nous intervenons vite — parce qu’un système de sécurité ne doit jamais s’arrêter.',
    points: ['Supervision à distance', 'Maintenance préventive', 'Intervention prioritaire', 'Contrat annuel'],
  },
  {
    n: '06', slug: 'etude-conseil', category: 'Avant de poser',
    title: 'Étude & conseil',
    excerpt:
      'Audit du site, repérage des angles morts, plan de couverture et dimensionnement. Une étude claire, chiffrée, avant la moindre installation.',
    points: ['Audit sur site', 'Plan de couverture', 'Dimensionnement', 'Devis détaillé'],
  },
];

export type Project = {
  n: string; slug: string; tag: string; title: string; city: string;
  client: string; scope: string; text: string;
};

export const projects: Project[] = [
  {
    n: '01', slug: 'commerce-centre-ville', tag: 'Commerce',
    title: 'Boutique de centre-ville', city: 'Casablanca', client: 'Commerce indépendant',
    scope: '14 caméras · contrôle d’accès',
    text: 'Protection d’un commerce sur deux niveaux : couverture des vitrines, de la réserve et de la caisse, avec accès mobile pour le gérant et enregistrement 30 jours.',
  },
  {
    n: '02', slug: 'copropriete-residentielle', tag: 'Copropriété',
    title: 'Résidence collective', city: 'Mohammedia', client: 'Syndic de copropriété',
    scope: 'Vidéophonie · 9 caméras',
    text: 'Sécurisation des halls, du parking et des locaux poubelles. Interphonie vidéo par appartement et supervision confiée au conseil syndical.',
  },
  {
    n: '03', slug: 'entrepot-logistique', tag: 'Logistique',
    title: 'Entrepôt logistique', city: 'Mohammedia', client: 'Prestataire logistique',
    scope: '26 caméras · réseau complet',
    text: 'Bâtiment neuf livré sans réseau : câblage complet, baie de brassage, Wi-Fi de quais puis déploiement de 26 caméras couvrant quais, allées et périmètre.',
  },
  {
    n: '04', slug: 'site-industriel', tag: 'Industrie',
    title: 'Site de production', city: 'Aïn Sebaâ', client: 'Industriel',
    scope: 'Détection périmétrique',
    text: 'Protection périmétrique d’un site sensible : caméras thermiques, détection d’intrusion sur clôture et levée de doute depuis le poste de garde.',
  },
  {
    n: '05', slug: 'cabinet-medical', tag: 'Santé',
    title: 'Cabinet médical', city: 'Rabat', client: 'Profession libérale',
    scope: 'Alarme · contrôle d’accès',
    text: 'Contrôle d’accès à la zone de soins, alarme reliée à la centrale et discrétion totale : la sécurité au service de la confidentialité des patients.',
  },
  {
    n: '06', slug: 'concession-automobile', tag: 'Automobile',
    title: 'Concession automobile', city: 'Casablanca', client: 'Concessionnaire',
    scope: 'Supervision 24/7',
    text: 'Surveillance du parc extérieur et du showroom, avec caméras PTZ pilotables et télésurveillance de nuit pour dissuader les intrusions.',
  },
];

export type Zone = { name: string; lat: number; lng: number; projects: string };

export const zones: Zone[] = [
  { name: 'Mohammedia', lat: 33.6864, lng: -7.383, projects: 'Copropriétés · industrie · commerces' },
  { name: 'Casablanca', lat: 33.5731, lng: -7.5898, projects: 'Commerces · concessions · bureaux' },
  { name: 'Aïn Sebaâ', lat: 33.6103, lng: -7.5271, projects: 'Sites industriels · logistique' },
  { name: 'Bouznika', lat: 33.7889, lng: -7.1597, projects: 'Résidentiel · copropriétés' },
  { name: 'Benslimane', lat: 33.6109, lng: -7.1206, projects: 'Industrie · entrepôts' },
  { name: 'Rabat', lat: 34.0209, lng: -6.8417, projects: 'Cabinets · bureaux' },
  { name: 'Salé', lat: 34.0531, lng: -6.7985, projects: 'Commerces · copropriétés' },
];

export const sectors = [
  'Commerces & retail', 'Copropriétés', 'Industrie & logistique',
  'Collectivités', 'Santé & professions libérales', 'Hôtellerie & restauration',
  'Concessions automobiles', 'Bureaux & tertiaire',
];

// Choix pour le formulaire de contact
export const profileOptions = [
  'Commerce / retail', 'Copropriété / syndic', 'Entreprise / industrie',
  'Collectivité / public', 'Profession libérale', 'Particulier',
];
export const needOptions = [
  'Vidéosurveillance', 'Contrôle d’accès', 'Alarme intrusion',
  'Réseau & câblage', 'Télésurveillance / maintenance', 'Étude & conseil', 'Autre',
];

export const commitments = [
  'Étude et devis gratuits, sans engagement.',
  'Matériel de marque, garanti et évolutif.',
  'Installateurs salariés, jamais de sous-traitance cachée.',
  'Réponse sous 48 h ouvrées, astreinte 7j/7.',
];
