export interface PracticeCategory {
  id: string;
  title: string;
  description: string;
  items: {
    id: string;
    title: string;
    language?: 'fr' | 'en';
    difficulty: 'Facile' | 'Moyen' | 'Difficile';
    content: string;
  }[];
}

export const PRACTICE_CATEGORIES: PracticeCategory[] = [
  {
    id: 'literature',
    title: 'Littérature & Grandes Pensées',
    description: 'Textes inspirants, classiques littéraires et philosophie.',
    items: [
      {
        id: 'lit-1',
        title: 'Le Petit Prince — Antoine de Saint-Exupéry',
        language: 'fr',
        difficulty: 'Facile',
        content: 'On ne voit bien qu\'avec le coeur. L\'essentiel est invisible pour les yeux. C\'est le temps que tu as perdu pour ta rose qui fait ta rose si importante. Les hommes ont oublie cette verite.',
      },
      {
        id: 'lit-2',
        title: 'Les Misérables — Victor Hugo',
        language: 'fr',
        difficulty: 'Moyen',
        content: 'La vie, le malheur, l\'isolement, l\'abandon, la pauvrete, sont des champs de bataille qui ont leurs heros; heros obscurs plus grands parfois que les heros illustres.',
      },
      {
        id: 'lit-3',
        title: 'L\'Art de la Guerre — Sun Tzu',
        language: 'fr',
        difficulty: 'Moyen',
        content: 'Connais ton ennemi et connais-toi toi-meme, et tu seras invincible dans cent batailles. L\'art supreme de la guerre consiste a soumettre l\'ennemi sans livrer combat.',
      },
      {
        id: 'lit-4',
        title: 'Walden — Henry David Thoreau',
        language: 'en',
        difficulty: 'Moyen',
        content: 'I went to the woods because I wished to live deliberately, to front only the essential facts of life, and see if I could not learn what it had to teach, and not, when I came to die, discover that I had not lived.',
      },
    ],
  },
  {
    id: 'programming',
    title: 'Code & Développement',
    description: 'Fragments de code réels avec accolades, flèches, crochets et opérateurs.',
    items: [
      {
        id: 'code-ts',
        title: 'TypeScript / React Hook',
        language: 'en',
        difficulty: 'Moyen',
        content: 'const [count, setCount] = useState<number>(0);\nconst handleClick = (event: MouseEvent) => {\n  event.preventDefault();\n  setCount((prev) => prev + 1);\n};',
      },
      {
        id: 'code-py',
        title: 'Python Data Processing',
        language: 'en',
        difficulty: 'Facile',
        content: 'def calculate_speed(wpm: float, accuracy: float) -> dict:\n    score = wpm * (accuracy / 100.0)\n    return {"wpm": round(wpm, 1), "score": round(score, 2)}',
      },
      {
        id: 'code-sql',
        title: 'SQL Analytics Query',
        language: 'en',
        difficulty: 'Moyen',
        content: 'SELECT user_id, AVG(wpm) AS average_wpm, MAX(accuracy) AS best_accuracy\nFROM typing_results\nWHERE created_at >= NOW() - INTERVAL \'30 days\'\nGROUP BY user_id\nHAVING COUNT(*) > 5\nORDER BY average_wpm DESC;',
      },
      {
        id: 'code-rust',
        title: 'Rust Memory Safe Struct',
        language: 'en',
        difficulty: 'Difficile',
        content: "pub fn process_keystrokes<T: AsRef<str>>(input: T) -> Result<usize, &'static str> {\n    let len = input.as_ref().chars().count();\n    if len == 0 { Err(\"empty input\") } else { Ok(len) }\n}",
      },
    ],
  },
  {
    id: 'numbers',
    title: 'Chiffres & Données Numériques',
    description: 'Dates, devises, pourcentages, codes postaux et numéros.',
    items: [
      {
        id: 'num-1',
        title: 'Statistiques & Pourcentages',
        language: 'fr',
        difficulty: 'Moyen',
        content: 'En 2026, plus de 78% des professionnels tapent a plus de 45 WPM. Le projet compte 1492 inscrits, 365 jours d\'activite et 99.4% de disponibilite.',
      },
      {
        id: 'num-2',
        title: 'Données Financières Fictives',
        language: 'fr',
        difficulty: 'Difficile',
        content: 'Devis n 84920: Total HT 1450.50 EUR, TVA 20% soit 290.10 EUR, Total TTC 1740.60 EUR. Echeance au 15/12/2026 via virement RIB 30004 00001 12345678901 22.',
      },
    ],
  },
  {
    id: 'punctuation',
    title: 'Ponctuation & Symboles Intensifs',
    description: 'Guillemets, tirets, points d\'interrogation et parenthèses imbriquées.',
    items: [
      {
        id: 'punct-1',
        title: 'Dialogue & Ponctuation Complexe',
        language: 'fr',
        difficulty: 'Moyen',
        content: '« Attention ! » cria-t-il, « Est-ce bien vrai ? (Je n\'en crois pas mes yeux). Oui, en effet : tout fonctionne a merveille ; n\'oublions rien. »',
      },
      {
        id: 'punct-2',
        title: 'Mélange de Symboles et Caractères',
        language: 'en',
        difficulty: 'Difficile',
        content: 'Regex: ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$ (test: user_99@sample-domain.org [status: 200 OK]).',
      },
    ],
  },
];
