export interface Platform {
  name: string;
  slug: string;
  logo: string;
  type: "stream" | "rent" | "buy";
  quality: string;
  price?: string;
  link: string;
}

export interface Title {
  id: string;
  tmdbId: number;
  type: "movie" | "series";
  title: string;
  titleOriginal: string;
  year: string;
  rating: number;
  voteCount: number;
  popularity?: number;
  overview: string;
  posterPath: string;
  backdropPath: string;
  genres: string[];
  runtime?: number;
  seasons?: number;
  director?: string;
  cast: string[];
  platforms: Platform[];
  trendScore?: number;
}

export const PLATFORMS_CATALOG = [
  { name: "Netflix", slug: "netflix", color: "#E50914" },
  { name: "Amazon Prime Video", slug: "amazon", color: "#00A8E1" },
  { name: "Disney+", slug: "disney", color: "#113CCF" },
  { name: "HBO Max", slug: "hbo", color: "#B535F6" },
  { name: "Paramount+", slug: "paramount", color: "#0064FF" },
  { name: "Apple TV+", slug: "apple", color: "#555555" },
  { name: "Star+", slug: "star", color: "#C724B1" },
  { name: "Mubi", slug: "mubi", color: "#001489" },
  { name: "Crunchyroll", slug: "crunchyroll", color: "#F47521" },
];

const platformLogo = (slug: string) => {
  const logos: Record<string, string> = {
    netflix: "N",
    amazon: "P",
    disney: "D+",
    hbo: "MAX",
    paramount: "P+",
    apple: "TV+",
    star: "S+",
    mubi: "M",
    crunchyroll: "CR",
  };
  return logos[slug] || slug[0].toUpperCase();
};

export const MOCK_TITLES: Title[] = [
  {
    id: "1",
    tmdbId: 1396,
    type: "series",
    title: "Breaking Bad",
    titleOriginal: "Breaking Bad",
    year: "2008–2013",
    rating: 9.5,
    voteCount: 18420,
    overview:
      "Un profesor de química de secundaria diagnosticado con cáncer de pulmón terminal se asocia con un exalumno para fabricar y vender metanfetamina para asegurar el futuro financiero de su familia.",
    posterPath: "https://image.tmdb.org/t/p/w500/ztkUQFLlC19CCMYHW73WJnCYSXS.jpg",
    backdropPath: "https://image.tmdb.org/t/p/original/gc8PfyTqzqltKMEWGWGBPFIOdqv.jpg",
    genres: ["Drama", "Thriller", "Crimen"],
    seasons: 5,
    director: "Vince Gilligan",
    cast: ["Bryan Cranston", "Aaron Paul", "Anna Gunn", "Dean Norris"],
    platforms: [
      { name: "Netflix", slug: "netflix", logo: platformLogo("netflix"), type: "stream", quality: "4K HDR", link: "#" },
      { name: "Amazon Prime Video", slug: "amazon", logo: platformLogo("amazon"), type: "rent", quality: "HD", price: "$1.299", link: "#" },
    ],
    trendScore: 92,
  },
  {
    id: "2",
    tmdbId: 76479,
    type: "series",
    title: "The Boys",
    titleOriginal: "The Boys",
    year: "2019–",
    rating: 8.7,
    voteCount: 12560,
    overview:
      "Un grupo de vigilantes se propone acabar con superhéroes corruptos que abusan de sus superpoderes en lugar de utilizarlos para hacer el bien.",
    posterPath: "https://image.tmdb.org/t/p/w500/2zmTngn1tYC1AvfnrFLhxeD82hz.jpg",
    backdropPath: "https://image.tmdb.org/t/p/original/7TXaLCFJMWY4v0V3oNYjrhMWdKU.jpg",
    genres: ["Acción", "Comedia", "Crimen"],
    seasons: 4,
    director: "Eric Kripke",
    cast: ["Karl Urban", "Jack Quaid", "Antony Starr", "Erin Moriarty"],
    platforms: [
      { name: "Amazon Prime Video", slug: "amazon", logo: platformLogo("amazon"), type: "stream", quality: "4K HDR", link: "#" },
    ],
    trendScore: 88,
  },
  {
    id: "3",
    tmdbId: 572802,
    type: "movie",
    title: "Aquaman y el Reino Perdido",
    titleOriginal: "Aquaman and the Lost Kingdom",
    year: "2023",
    rating: 6.3,
    voteCount: 8700,
    overview:
      "Arthur Curry debe forjar una alianza incómoda con su hermano Orm para proteger Atlantis de una antigua amenaza.",
    posterPath: "https://image.tmdb.org/t/p/w500/8xV47NDrjdZDpkVcCFqkdHa3T0C.jpg",
    backdropPath: "https://image.tmdb.org/t/p/original/jXJxMcVoEuXzym3vFnjqDW4ifo6.jpg",
    genres: ["Acción", "Aventura", "Fantasía"],
    runtime: 124,
    director: "James Wan",
    cast: ["Jason Momoa", "Patrick Wilson", "Yahya Abdul-Mateen II"],
    platforms: [
      { name: "HBO Max", slug: "hbo", logo: platformLogo("hbo"), type: "stream", quality: "4K", link: "#" },
      { name: "Apple TV+", slug: "apple", logo: platformLogo("apple"), type: "buy", quality: "4K", price: "$3.499", link: "#" },
    ],
  },
  {
    id: "4",
    tmdbId: 100088,
    type: "series",
    title: "The Last of Us",
    titleOriginal: "The Last of Us",
    year: "2023–",
    rating: 8.8,
    voteCount: 15320,
    overview:
      "Joel, un sobreviviente curtido, es contratado para sacar de contrabando a Ellie, una chica de 14 años, fuera de una zona de cuarentena opresiva. Lo que comienza como un trabajo pequeño pronto se convierte en un viaje brutal a través del país.",
    posterPath: "https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg",
    backdropPath: "https://image.tmdb.org/t/p/original/uDgy6hyPd82kOHh6I95FLtLnj6p.jpg",
    genres: ["Drama", "Sci-Fi", "Acción"],
    seasons: 2,
    director: "Craig Mazin",
    cast: ["Pedro Pascal", "Bella Ramsey", "Gabriel Luna"],
    platforms: [
      { name: "HBO Max", slug: "hbo", logo: platformLogo("hbo"), type: "stream", quality: "4K HDR", link: "#" },
    ],
    trendScore: 95,
  },
  {
    id: "5",
    tmdbId: 823464,
    type: "movie",
    title: "Godzilla x Kong: El Nuevo Imperio",
    titleOriginal: "Godzilla x Kong: The New Empire",
    year: "2024",
    rating: 7.1,
    voteCount: 6200,
    overview:
      "Una exploración de la historia de estos titanes y sus orígenes, así como los misterios de Skull Island y más allá.",
    posterPath: "https://image.tmdb.org/t/p/w500/z1p34vh7dEOnLDmyCrlUVLuoDzd.jpg",
    backdropPath: "https://image.tmdb.org/t/p/original/veIyxxi5Gs8gvztLEW1Ysb8rrzs.jpg",
    genres: ["Acción", "Aventura", "Sci-Fi"],
    runtime: 115,
    director: "Adam Wingard",
    cast: ["Rebecca Hall", "Brian Tyree Henry", "Dan Stevens"],
    platforms: [
      { name: "HBO Max", slug: "hbo", logo: platformLogo("hbo"), type: "stream", quality: "4K", link: "#" },
      { name: "Amazon Prime Video", slug: "amazon", logo: platformLogo("amazon"), type: "rent", quality: "HD", price: "$1.499", link: "#" },
    ],
    trendScore: 78,
  },
  {
    id: "6",
    tmdbId: 37854,
    type: "series",
    title: "One Piece",
    titleOriginal: "One Piece",
    year: "1999–",
    rating: 8.9,
    voteCount: 21300,
    overview:
      "Monkey D. Luffy zarpa con su tripulación de piratas del Sombrero de Paja en busca del tesoro definitivo conocido como One Piece.",
    posterPath: "https://image.tmdb.org/t/p/w500/cMD9Ygz11zjJzAovURpO75Qg7rT.jpg",
    backdropPath: "https://image.tmdb.org/t/p/original/2rmK7mnchw9Xr3XdiTFSxTTLXqv.jpg",
    genres: ["Animación", "Aventura", "Comedia"],
    seasons: 21,
    cast: ["Mayumi Tanaka", "Kazuya Nakai", "Akemi Okamura"],
    platforms: [
      { name: "Crunchyroll", slug: "crunchyroll", logo: platformLogo("crunchyroll"), type: "stream", quality: "HD", link: "#" },
      { name: "Netflix", slug: "netflix", logo: platformLogo("netflix"), type: "stream", quality: "HD", link: "#" },
    ],
    trendScore: 85,
  },
  {
    id: "7",
    tmdbId: 693134,
    type: "movie",
    title: "Dune: Parte Dos",
    titleOriginal: "Dune: Part Two",
    year: "2024",
    rating: 8.3,
    voteCount: 14500,
    overview:
      "Paul Atreides se une a los Fremen y busca venganza contra los conspiradores que destruyeron a su familia mientras lucha por evitar un futuro terrible que solo él puede prever.",
    posterPath: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    backdropPath: "https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg",
    genres: ["Sci-Fi", "Aventura", "Drama"],
    runtime: 166,
    director: "Denis Villeneuve",
    cast: ["Timothée Chalamet", "Zendaya", "Austin Butler", "Florence Pugh"],
    platforms: [
      { name: "HBO Max", slug: "hbo", logo: platformLogo("hbo"), type: "stream", quality: "4K HDR", link: "#" },
      { name: "Amazon Prime Video", slug: "amazon", logo: platformLogo("amazon"), type: "rent", quality: "4K", price: "$1.799", link: "#" },
      { name: "Apple TV+", slug: "apple", logo: platformLogo("apple"), type: "buy", quality: "4K HDR", price: "$4.299", link: "#" },
    ],
    trendScore: 91,
  },
  {
    id: "8",
    tmdbId: 94997,
    type: "series",
    title: "House of the Dragon",
    titleOriginal: "House of the Dragon",
    year: "2022–",
    rating: 8.4,
    voteCount: 11200,
    overview:
      "La historia de la casa Targaryen, ambientada 200 años antes de los eventos de Game of Thrones.",
    posterPath: "https://image.tmdb.org/t/p/w500/z2yahl2uefxDCl0nogcRBstwruJ.jpg",
    backdropPath: "https://image.tmdb.org/t/p/original/etj8E2o0Bud0HkONVQPjyCkIvpv.jpg",
    genres: ["Drama", "Fantasía", "Acción"],
    seasons: 2,
    director: "Ryan Condal",
    cast: ["Emma D'Arcy", "Matt Smith", "Olivia Cooke"],
    platforms: [
      { name: "HBO Max", slug: "hbo", logo: platformLogo("hbo"), type: "stream", quality: "4K HDR", link: "#" },
    ],
    trendScore: 87,
  },
  {
    id: "9",
    tmdbId: 786892,
    type: "movie",
    title: "Furiosa: De la Saga Mad Max",
    titleOriginal: "Furiosa: A Mad Max Saga",
    year: "2024",
    rating: 7.6,
    voteCount: 5100,
    overview:
      "La historia del origen de la renegada guerrera Furiosa antes de su encuentro con Mad Max.",
    posterPath: "https://image.tmdb.org/t/p/w500/iADOJ8Zymht2JPMoy3R7xceZprc.jpg",
    backdropPath: "https://image.tmdb.org/t/p/original/shrwC6U8Bkst9c9KcLBgQTOsJCv.jpg",
    genres: ["Acción", "Aventura", "Sci-Fi"],
    runtime: 148,
    director: "George Miller",
    cast: ["Anya Taylor-Joy", "Chris Hemsworth", "Tom Burke"],
    platforms: [
      { name: "HBO Max", slug: "hbo", logo: platformLogo("hbo"), type: "stream", quality: "4K", link: "#" },
      { name: "Amazon Prime Video", slug: "amazon", logo: platformLogo("amazon"), type: "rent", quality: "HD", price: "$1.499", link: "#" },
    ],
    trendScore: 72,
  },
  {
    id: "10",
    tmdbId: 550,
    type: "movie",
    title: "El Club de la Pelea",
    titleOriginal: "Fight Club",
    year: "1999",
    rating: 8.8,
    voteCount: 28300,
    overview:
      "Un oficinista insomne y un fabricante de jabón deviant forman un club de pelea clandestino que evoluciona en algo mucho más grande.",
    posterPath: "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    backdropPath: "https://image.tmdb.org/t/p/original/hZkgoQYus5dXo3H8T7Uef6DNknx.jpg",
    genres: ["Drama", "Thriller"],
    runtime: 139,
    director: "David Fincher",
    cast: ["Brad Pitt", "Edward Norton", "Helena Bonham Carter"],
    platforms: [
      { name: "Disney+", slug: "disney", logo: platformLogo("disney"), type: "stream", quality: "HD", link: "#" },
      { name: "Amazon Prime Video", slug: "amazon", logo: platformLogo("amazon"), type: "rent", quality: "4K", price: "$999", link: "#" },
    ],
  },
  {
    id: "11",
    tmdbId: 157336,
    type: "movie",
    title: "Interestelar",
    titleOriginal: "Interstellar",
    year: "2014",
    rating: 8.7,
    voteCount: 32100,
    overview:
      "Un grupo de exploradores viaja a través de un agujero de gusano en el espacio en un intento de asegurar la supervivencia de la humanidad.",
    posterPath: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdropPath: "https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK1DVfjko.jpg",
    genres: ["Sci-Fi", "Drama", "Aventura"],
    runtime: 169,
    director: "Christopher Nolan",
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
    platforms: [
      { name: "Paramount+", slug: "paramount", logo: platformLogo("paramount"), type: "stream", quality: "4K HDR", link: "#" },
      { name: "Amazon Prime Video", slug: "amazon", logo: platformLogo("amazon"), type: "rent", quality: "4K", price: "$1.299", link: "#" },
    ],
    trendScore: 80,
  },
  {
    id: "12",
    tmdbId: 1399,
    type: "series",
    title: "Game of Thrones",
    titleOriginal: "Game of Thrones",
    year: "2011–2019",
    rating: 8.4,
    voteCount: 23100,
    overview:
      "Nueve familias nobles luchan por el control de las tierras de Westeros, mientras un antiguo enemigo regresa tras estar dormido durante miles de años.",
    posterPath: "https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg",
    backdropPath: "https://image.tmdb.org/t/p/original/suopoADq0k8YZr4dQXcU6pToj6s.jpg",
    genres: ["Drama", "Fantasía", "Aventura"],
    seasons: 8,
    director: "David Benioff",
    cast: ["Emilia Clarke", "Kit Harington", "Peter Dinklage"],
    platforms: [
      { name: "HBO Max", slug: "hbo", logo: platformLogo("hbo"), type: "stream", quality: "4K HDR", link: "#" },
    ],
    trendScore: 75,
  },
];

export const getTrending = () =>
  [...MOCK_TITLES]
    .filter((t) => t.trendScore)
    .sort((a, b) => (b.trendScore || 0) - (a.trendScore || 0));

export const getNewArrivals = () =>
  [...MOCK_TITLES].filter(
    (t) => t.year.includes("2024") || t.year.includes("2023")
  );

export const searchTitles = (query: string) => {
  const q = query.toLowerCase();
  return MOCK_TITLES.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.titleOriginal.toLowerCase().includes(q) ||
      t.genres.some((g) => g.toLowerCase().includes(q)) ||
      t.cast.some((c) => c.toLowerCase().includes(q))
  );
};

export const getTitleById = (id: string) =>
  MOCK_TITLES.find((t) => t.id === id);

export const getSimilar = (id: string) => {
  const title = getTitleById(id);
  if (!title) return [];
  return MOCK_TITLES.filter(
    (t) => t.id !== id && t.genres.some((g) => title.genres.includes(g))
  ).slice(0, 6);
};

export const PLATFORM_COLORS: Record<string, string> = {
  netflix: "#E50914",
  amazon: "#00A8E1",
  disney: "#113CCF",
  hbo: "#B535F6",
  paramount: "#0064FF",
  apple: "#AAAAAA",
  star: "#C724B1",
  mubi: "#001489",
  crunchyroll: "#F47521",
};
