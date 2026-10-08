export interface ConfusedPair {
  expected: string;
  actual: string;
  count: number;
}

// French and English word banks enriched for specific letter pairs
const TARGETED_WORDS_FR: Record<string, string[]> = {
  r: ['rare', 'train', 'route', 'rapide', 'porte', 'arriver', 'erreur', 'courir', 'regard', 'traverser'],
  t: ['tout', 'temps', 'terre', 'trajet', 'porte', 'attendre', 'total', 'partir', 'trouver', 'titre'],
  e: ['elle', 'terre', 'effet', 'entrer', 'semble', 'penser', 'reste', 'texte', 'geste', 'fenetre'],
  p: ['pour', 'place', 'partir', 'point', 'papier', 'espoir', 'simple', 'espace', 'propre', 'page'],
  o: ['ordre', 'autre', 'forme', 'porte', 'monde', 'point', 'ombre', 'chose', 'route', 'corps'],
  a: ['avec', 'arbre', 'avant', 'parler', 'grand', 'matin', 'table', 'clavier', 'phrase', 'travail'],
  s: ['sans', 'sous', 'seul', 'sens', 'simple', 'passe', 'reste', 'aussi', 'temps', 'style'],
  d: ['dans', 'donc', 'dire', 'deux', 'droit', 'ordre', 'monde', 'garder', 'doigt', 'demain'],
  f: ['faire', 'force', 'forme', 'femme', 'effet', 'facile', 'finir', 'fond', 'frapper', 'futur'],
  j: ['jour', 'jamais', 'jeune', 'jeu', 'jardin', 'juste', 'joie', 'trajet', 'projet', 'objet'],
  k: ['kilo', 'koala', 'kayak', 'kaki', 'karma', 'kiosque', 'klaxon', 'karate', 'nickel', 'bifteck'],
  l: ['lire', 'ligne', 'livre', 'lumiere', 'seul', 'ville', 'place', 'lent', 'large', 'facile'],
  m: ['main', 'mot', 'monde', 'meme', 'moment', 'maison', 'merci', 'mouvement', 'memoire', 'forme'],
  c: ['comme', 'ceci', 'cours', 'ciel', 'corps', 'croire', 'action', 'classe', 'chose', 'clair'],
  v: ['voir', 'venir', 'vitesse', 'vrai', 'voie', 'vers', 'vivre', 'souvent', 'ville', 'nouveau'],
  b: ['bien', 'beau', 'boite', 'base', 'bras', 'bonjour', 'besoin', 'libre', 'bouton', 'bureau'],
  n: ['non', 'nom', 'nuit', 'nature', 'donner', 'bon', 'sens', 'temps', 'ligne', 'rien'],
};

export function calculateAnimalRank(wpm: number, accuracy: number): {
  rank: 'tortoise' | 'hare' | 'fox' | 'leopard' | 'eagle';
  label: string;
  emoji: string;
  description: string;
} {
  // Accuracy penalty: if accuracy is low, level is downgraded
  const effectiveScore = accuracy < 90 ? wpm * 0.7 : accuracy < 95 ? wpm * 0.85 : wpm;

  if (effectiveScore >= 85 && accuracy >= 96) {
    return {
      rank: 'eagle',
      label: 'Aigle Maître',
      emoji: '🦅',
      description: 'Frappe réflexe supérieure, fluidité totale et précision chirurgicale.',
    };
  }
  if (effectiveScore >= 65 && accuracy >= 94) {
    return {
      rank: 'leopard',
      label: 'Léopard Expert',
      emoji: '🐆',
      description: 'Vitesse de pointe impressionnante avec une excellente régularité.',
    };
  }
  if (effectiveScore >= 45 && accuracy >= 92) {
    return {
      rank: 'fox',
      label: 'Renard Agile',
      emoji: '🦊',
      description: 'Frappe assurée, mémoire musculaire solide sur l\'ensemble du clavier.',
    };
  }
  if (effectiveScore >= 25 && accuracy >= 88) {
    return {
      rank: 'hare',
      label: 'Lièvre Rapide',
      emoji: '🐇',
      description: 'Bonne dynamique, automatisation progressive sans regarder les touches.',
    };
  }
  return {
    rank: 'tortoise',
    label: 'Tortue Débutante',
    emoji: '🐢',
    description: 'Phase de découverte, acquisition des repères et précision prioritaire.',
  };
}

export function calculateCertificateTier(wpm: number, accuracy: number): 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Master' | null {
  if (wpm >= 90 && accuracy >= 98) return 'Master';
  if (wpm >= 75 && accuracy >= 97) return 'Diamond';
  if (wpm >= 60 && accuracy >= 96) return 'Platinum';
  if (wpm >= 45 && accuracy >= 94) return 'Gold';
  if (wpm >= 30 && accuracy >= 90) return 'Silver';
  if (wpm >= 20 && accuracy >= 85) return 'Bronze';
  return null;
}

// Generate tailored drill text targeting specific weak keys
export function generateWeakKeyDrill(weakKeys: string[]): string {
  if (!weakKeys || weakKeys.length === 0) {
    return 'les dix doigts restent souples sur la ligne de repos pour maintenir une frappe fluide';
  }

  const primaryKey = weakKeys[0].toLowerCase();
  const secondaryKey = weakKeys[1] ? weakKeys[1].toLowerCase() : primaryKey;

  const wordsA = TARGETED_WORDS_FR[primaryKey] || [primaryKey.repeat(3), `${primaryKey}a${primaryKey}`];
  const wordsB = TARGETED_WORDS_FR[secondaryKey] || [secondaryKey.repeat(3), `${secondaryKey}e${secondaryKey}`];

  // Alternation pattern: word, repetition, combination
  const selectedA = wordsA.slice(0, 4);
  const selectedB = wordsB.slice(0, 4);

  const combined = [
    ...selectedA,
    `${primaryKey}${secondaryKey}${primaryKey}`,
    ...selectedB,
    `${secondaryKey}${primaryKey}${secondaryKey}`,
    selectedA[0],
    selectedB[0],
    'et',
    'en',
    'avec',
  ];

  return combined.join(' ');
}
