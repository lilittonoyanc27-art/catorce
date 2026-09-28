// Data for TEMA 7: PALABRAS Y SIGNIFICADOS / ԹԵՄԱ 7․ ԲԱՌԵՐ ԵՎ ԻՄԱՍՏՆԵՐ

export interface FullTextItem {
  id: string;
  es: string;
  hy: string;
  keywords?: string[];
}

export interface ConceptItem {
  number: number;
  titleEs: string;
  titleHy: string;
  descriptionEs: string;
  descriptionHy: string;
  exampleEs: string;
  exampleHy: string;
  explanationEs?: string;
  explanationHy?: string;
  badge?: string;
}

export interface TableRowItem {
  id: string;
  concept: string;
  conceptHy: string;
  significadoEs: string;
  significadoHy: string;
}

export interface QAItem {
  number: number;
  questionEs: string;
  questionHy: string;
  answerEs: string;
  answerHy: string;
  category?: string;
}

export interface ShortTextItem {
  id: string;
  es: string;
  hy: string;
}

export const TOPIC_INFO = {
  themeEs: "TEMA 7: PALABRAS Y SIGNIFICADOS",
  themeHy: "ԹԵՄԱ 7․ ԲԱՌԵՐ ԵՎ ԻՄԱՍՏՆԵՐ",
  descriptionEs: "Aprende el significado de las palabras, monosemia, polisemia, sinónimos, antónimos, homónimos, campos semánticos y sentidos denotativo y connotativo.",
  descriptionHy: "Սովորեք բառերի իմաստը, մեկիմաստություն, բազմիմաստություն, հոմանիշներ, հականիշներ, համանուններ, իմաստային դաշտեր, ուղիղ և փոխաբերական իմաստներ։",
};

export const FULL_TEXT_ITEMS: FullTextItem[] = [
  {
    id: "ft-1",
    es: "Las palabras tienen un significado y se relacionan unas con otras de diferentes maneras.",
    hy: "Բառերն ունեն իմաստ և տարբեր ձևերով կապված են միմյանց հետ։",
    keywords: ["palabras", "significado"]
  },
  {
    id: "ft-2",
    es: "Una palabra puede tener un solo significado o varios significados.",
    hy: "Բառը կարող է ունենալ մեկ կամ մի քանի իմաստ։",
    keywords: ["un solo significado", "varios significados"]
  },
  {
    id: "ft-3",
    es: "Cuando una palabra tiene un único significado, hablamos de monosemia. Por ejemplo, una palabra técnica puede tener un significado muy concreto.",
    hy: "Երբ բառը ունի միայն մեկ հստակ իմաստ, խոսում ենք monosemia-ի մասին։",
    keywords: ["monosemia", "palabra técnica"]
  },
  {
    id: "ft-4",
    es: "Cuando una palabra tiene varios significados relacionados entre sí, hablamos de polisemia. Por ejemplo, la palabra “banco” puede referirse a un asiento o a una entidad financiera.",
    hy: "Երբ բառը ունի մի քանի իրար հետ կապված իմաստ, խոսում ենք polisemia-ի մասին։ Օրինակ՝ «banco» բառը կարող է նշանակել նստարան կամ բանկային հաստատություն։",
    keywords: ["polisemia", "banco"]
  },
  {
    id: "ft-5",
    es: "También existen palabras con significados semejantes, llamadas sinónimos. Por ejemplo, “bonito” y “hermoso”.",
    hy: "Նման իմաստ ունեցող բառերը կոչվում են հոմանիշներ։ Օրինակ՝ “bonito” և “hermoso”։",
    keywords: ["sinónimos", "bonito", "hermoso"]
  },
  {
    id: "ft-6",
    es: "Las palabras con significados opuestos se llaman antónimos. Por ejemplo, “alto” y “bajo”.",
    hy: "Հակառակ իմաստ ունեցող բառերը կոչվում են հականիշներ։ Օրինակ՝ “alto” և “bajo”։",
    keywords: ["antónimos", "alto", "bajo"]
  },
  {
    id: "ft-7",
    es: "También existen palabras que tienen la misma forma o una forma muy parecida, pero significados diferentes. Son los homónimos.",
    hy: "Կան նաև բառեր, որոնք նույն կամ շատ նման ձև ունեն, բայց տարբեր իմաստներ։ Դրանք կոչվում են homónimos։",
    keywords: ["homónimos"]
  },
  {
    id: "ft-8",
    es: "Dentro del vocabulario también podemos encontrar campos semánticos. Un campo semántico es un grupo de palabras relacionadas por su significado. Por ejemplo: “mesa, silla, sofá, armario” pertenecen al campo semántico de los muebles.",
    hy: "Բառապաշարում կան նաև իմաստային դաշտեր։ Իմաստային դաշտը իրար հետ իմաստով կապված բառերի խումբ է։ Օրինակ՝ “mesa, silla, sofá, armario” բառերը պատկանում են կահույքի իմաստային դաշտին։",
    keywords: ["campo semántico", "muebles"]
  },
  {
    id: "ft-9",
    es: "Además, podemos distinguir entre el significado denotativo y el connotativo.",
    hy: "Բացի դրանից, կարելի է տարբերել բառի ուղղակի իմաստը և փոխաբերական կամ լրացուցիչ իմաստը։",
    keywords: ["denotativo", "connotativo"]
  },
  {
    id: "ft-10",
    es: "El significado denotativo es el significado objetivo y literal de una palabra.",
    hy: "Denotativo իմաստը բառի օբյեկտիվ, ուղիղ իմաստն է։",
    keywords: ["denotativo", "literal", "objetivo"]
  },
  {
    id: "ft-11",
    es: "El significado connotativo incluye ideas, emociones o asociaciones personales y culturales.",
    hy: "Connotativo իմաստը ներառում է լրացուցիչ պատկերացումներ, հույզեր կամ մշակութային ասոցիացիաներ։",
    keywords: ["connotativo", "emociones", "asociaciones"]
  },
  {
    id: "ft-12",
    es: "En resumen, las palabras pueden relacionarse por semejanza, oposición o pertenencia a un mismo campo semántico, y pueden tener uno o varios significados.",
    hy: "Ամփոփելով՝ բառերը կարող են իրար հետ կապված լինել նմանությամբ, հակադրությամբ կամ նույն իմաստային դաշտին պատկանելով, և կարող են ունենալ մեկ կամ մի քանի իմաստ։",
    keywords: ["en resumen", "semejanza", "oposición"]
  }
];

export const CONCEPTS: ConceptItem[] = [
  {
    number: 1,
    titleEs: "Monosemia",
    titleHy: "Մեկիմաստություն",
    descriptionEs: "Una palabra monosémica tiene un solo significado.",
    descriptionHy: "Մեկիմաստ բառը ունի միայն մեկ իմաստ։",
    exampleEs: "“Triángulo” tiene un significado concreto.",
    exampleHy: "“Triángulo” բառը ունի հստակ իմաստ։",
    badge: "1 Significado"
  },
  {
    number: 2,
    titleEs: "Polisemia",
    titleHy: "Բազմիմաստություն",
    descriptionEs: "Una palabra polisémica tiene varios significados relacionados.",
    descriptionHy: "Բազմիմաստ բառը ունի մի քանի փոխկապակցված իմաստ։",
    exampleEs: "banco = asiento / entidad financiera",
    exampleHy: "banco = նստարան / բանկ",
    badge: "Varios significados"
  },
  {
    number: 3,
    titleEs: "Sinónimos",
    titleHy: "Հոմանիշներ",
    descriptionEs: "Son palabras con significado igual o parecido.",
    descriptionHy: "Նման կամ նույն իմաստ ունեցող բառեր են։",
    exampleEs: "bonito — hermoso\nrápido — veloz\nfeliz — contento",
    exampleHy: "bonito (սիրուն) — hermoso (գեղեցիկ)\nrápido (արագ) — veloz (սրընթաց)\nfeliz (ուրախ) — contento (գոհ/ուրախ)",
    badge: "Significados parecidos"
  },
  {
    number: 4,
    titleEs: "Antónimos",
    titleHy: "Հականիշներ",
    descriptionEs: "Son palabras con significados opuestos.",
    descriptionHy: "Հակառակ իմաստ ունեցող բառեր են։",
    exampleEs: "alto — bajo\ngrande — pequeño\nfrío — caliente\nentrar — salir",
    exampleHy: "alto (բարձրահասակ) — bajo (կարճահասակ/ցածր)\ngrande (մեծ) — pequeño (փոքր)\nfrío (սառը) — caliente (տաք)\nentrar (մտնել) — salir (դուրս գալ)",
    badge: "Significados opuestos"
  },
  {
    number: 5,
    titleEs: "Homónimos",
    titleHy: "Համանուններ",
    descriptionEs: "Son palabras que tienen la misma forma o una forma muy parecida, pero significados distintos.",
    descriptionHy: "Դրանք նույն կամ շատ նման ձև ունեցող, բայց տարբեր իմաստներով բառեր են։",
    exampleEs: "“vino” puede ser una bebida o una forma del verbo venir.",
    exampleHy: "“vino” կարող է լինել ըմպելիք (գինի) կամ venir (գալ) բայի ձև։",
    badge: "Misma forma"
  },
  {
    number: 6,
    titleEs: "Campo semántico",
    titleHy: "Իմաստային դաշտ",
    descriptionEs: "Es un grupo de palabras relacionadas por su significado.",
    descriptionHy: "Դա իմաստով իրար հետ կապված բառերի խումբ է։",
    exampleEs: "fútbol, tenis, baloncesto, natación → deportes",
    exampleHy: "ֆուտբոլ, թենիս, բասկետբոլ, լող → սպորտ",
    badge: "Grupo de palabras"
  },
  {
    number: 7,
    titleEs: "Significado denotativo",
    titleHy: "Ուղիղ իմաստ",
    descriptionEs: "Es el significado objetivo y literal de una palabra.",
    descriptionHy: "Դա բառի օբյեկտիվ և ուղիղ իմաստն է։",
    exampleEs: "“Perro” = animal doméstico.",
    exampleHy: "“Perro” = ընտանի կենդանի (շուն)։",
    badge: "Literal y objetivo"
  },
  {
    number: 8,
    titleEs: "Significado connotativo",
    titleHy: "Լրացուցիչ կամ փոխաբերական իմաստ",
    descriptionEs: "Es el significado relacionado con emociones, ideas o asociaciones.",
    descriptionHy: "Դա այն իմաստն է, որը կապված է հույզերի, գաղափարների կամ ասոցիացիաների հետ։",
    exampleEs: "“Eres un sol.”\nNo significa que una persona sea realmente el Sol, sino que es muy buena o agradable.",
    exampleHy: "“Eres un sol.”\nՍա չի նշանակում, որ մարդը իրականում արև է, այլ որ նա շատ լավ կամ հաճելի մարդ է։",
    badge: "Emociones e ideas"
  }
];

export const MEMORY_TABLE: TableRowItem[] = [
  {
    id: "row-1",
    concept: "Monosemia",
    conceptHy: "Մեկիմաստություն",
    significadoEs: "Un significado",
    significadoHy: "Մեկ իմաստ"
  },
  {
    id: "row-2",
    concept: "Polisemia",
    conceptHy: "Բազմիմաստություն",
    significadoEs: "Varios significados",
    significadoHy: "Մի քանի իմաստ"
  },
  {
    id: "row-3",
    concept: "Sinónimos",
    conceptHy: "Հոմանիշներ",
    significadoEs: "Significados parecidos",
    significadoHy: "Նման իմաստ"
  },
  {
    id: "row-4",
    concept: "Antónimos",
    conceptHy: "Հականիշներ",
    significadoEs: "Significados opuestos",
    significadoHy: "Հակառակ իմաստ"
  },
  {
    id: "row-5",
    concept: "Homónimos",
    conceptHy: "Համանուններ",
    significadoEs: "Misma forma, distinto significado",
    significadoHy: "Նույն ձև, տարբեր իմաստ"
  },
  {
    id: "row-6",
    concept: "Campo semántico",
    conceptHy: "Իմաստային դաշտ",
    significadoEs: "Grupo de palabras relacionadas",
    significadoHy: "Իմաստով կապված բառերի խումբ"
  },
  {
    id: "row-7",
    concept: "Denotativo",
    conceptHy: "Ուղիղ իմաստ",
    significadoEs: "Significado literal",
    significadoHy: "Ուղիղ իմաստ"
  },
  {
    id: "row-8",
    concept: "Connotativo",
    conceptHy: "Լրացուցիչ իմաստ",
    significadoEs: "Significado asociado",
    significadoHy: "Լրացուցիչ իմաստ"
  }
];

export const QA_ITEMS: QAItem[] = [
  {
    number: 1,
    questionEs: "¿Qué estudia el significado de las palabras?",
    questionHy: "Ի՞նչ է ուսումնասիրում բառերի իմաստը։",
    answerEs: "La semántica.",
    answerHy: "Իմաստաբանությունը։",
    category: "Definición"
  },
  {
    number: 2,
    questionEs: "¿Qué es la monosemia?",
    questionHy: "Ի՞նչ է monosemia-ն։",
    answerEs: "Es cuando una palabra tiene un solo significado.",
    answerHy: "Դա այն դեպքն է, երբ բառը ունի միայն մեկ իմաստ։",
    category: "Monosemia"
  },
  {
    number: 3,
    questionEs: "¿Qué es la polisemia?",
    questionHy: "Ի՞նչ է polisemia-ն։",
    answerEs: "Es cuando una palabra tiene varios significados relacionados.",
    answerHy: "Դա այն դեպքն է, երբ բառը ունի մի քանի փոխկապակցված իմաստ։",
    category: "Polisemia"
  },
  {
    number: 4,
    questionEs: "Da un ejemplo de palabra polisémica.",
    questionHy: "Բե՛ր բազմիմաստ բառի օրինակ։",
    answerEs: "Banco.",
    answerHy: "Banco։",
    category: "Polisemia"
  },
  {
    number: 5,
    questionEs: "¿Qué son los sinónimos?",
    questionHy: "Ի՞նչ են հոմանիշները։",
    answerEs: "Son palabras con significados iguales o parecidos.",
    answerHy: "Դրանք նույն կամ նման իմաստ ունեցող բառեր են։",
    category: "Sinónimos"
  },
  {
    number: 6,
    questionEs: "Da un sinónimo de “bonito”.",
    questionHy: "Տո՛ւր “bonito” բառի հոմանիշ։",
    answerEs: "Hermoso.",
    answerHy: "Hermoso։",
    category: "Sinónimos"
  },
  {
    number: 7,
    questionEs: "¿Qué son los antónimos?",
    questionHy: "Ի՞նչ են հականիշները։",
    answerEs: "Son palabras con significados opuestos.",
    answerHy: "Դրանք հակառակ իմաստ ունեցող բառեր են։",
    category: "Antónimos"
  },
  {
    number: 8,
    questionEs: "¿Cuál es el antónimo de “alto”?",
    questionHy: "Ո՞րն է “alto” բառի հականիշը։",
    answerEs: "Bajo.",
    answerHy: "Bajo։",
    category: "Antónimos"
  },
  {
    number: 9,
    questionEs: "¿Qué son los homónimos?",
    questionHy: "Ի՞նչ են համանունները։",
    answerEs: "Son palabras con la misma forma o forma parecida, pero con significados distintos.",
    answerHy: "Դրանք նույն կամ նման ձև ունեցող, բայց տարբեր իմաստներով բառեր են։",
    category: "Homónimos"
  },
  {
    number: 10,
    questionEs: "¿Qué es un campo semántico?",
    questionHy: "Ի՞նչ է իմաստային դաշտը։",
    answerEs: "Es un grupo de palabras relacionadas por su significado.",
    answerHy: "Դա իմաստով իրար հետ կապված բառերի խումբ է։",
    category: "Campo semántico"
  },
  {
    number: 11,
    questionEs: "¿A qué campo semántico pertenecen “mesa, silla y sofá”?",
    questionHy: "Ո՞ր իմաստային դաշտին են պատկանում “mesa, silla y sofá” բառերը։",
    answerEs: "Al campo semántico de los muebles.",
    answerHy: "Կահույքի իմաստային դաշտին։",
    category: "Campo semántico"
  },
  {
    number: 12,
    questionEs: "¿Qué es el significado denotativo?",
    questionHy: "Ի՞նչ է denotativo իմաստը։",
    answerEs: "Es el significado literal y objetivo.",
    answerHy: "Դա բառի ուղիղ և օբյեկտիվ իմաստն է։",
    category: "Denotativo"
  },
  {
    number: 13,
    questionEs: "¿Qué es el significado connotativo?",
    questionHy: "Ի՞նչ է connotativo իմաստը։",
    answerEs: "Es un significado asociado a emociones, ideas o valores.",
    answerHy: "Դա հույզերի, գաղափարների կամ արժեքների հետ կապված լրացուցիչ իմաստն է։",
    category: "Connotativo"
  },
  {
    number: 14,
    questionEs: "¿“Feliz” y “contento” son sinónimos o antónimos?",
    questionHy: "“Feliz” և “contento” բառերը հոմանիշնե՞ր են, թե՞ հականիշներ։",
    answerEs: "Son sinónimos.",
    answerHy: "Հոմանիշներ են։",
    category: "Sinónimos"
  },
  {
    number: 15,
    questionEs: "¿“Frío” y “caliente” son sinónimos o antónimos?",
    questionHy: "“Frío” և “caliente” բառերը հոմանիշնե՞ր են, թե՞ հականիշներ։",
    answerEs: "Son antónimos.",
    answerHy: "Հականիշներ են։",
    category: "Antónimos"
  },
  {
    number: 16,
    questionEs: "¿Puede una palabra tener más de un significado?",
    questionHy: "Կարո՞ղ է բառը ունենալ մեկից ավելի իմաստ։",
    answerEs: "Sí. En ese caso puede ser una palabra polisémica.",
    answerHy: "Այո։ Այդ դեպքում այն կարող է լինել բազմիմաստ բառ։",
    category: "Polisemia"
  }
];

export const SHORT_TEXT_ITEMS: ShortTextItem[] = [
  {
    id: "st-1",
    es: "Las palabras tienen significados y pueden relacionarse de diferentes maneras.",
    hy: "Բառերն ունեն իմաստ և կարող են տարբեր ձևերով կապված լինել միմյանց հետ։"
  },
  {
    id: "st-2",
    es: "Una palabra puede tener un solo significado, que se llama monosemia, o varios significados, que se llama polisemia.",
    hy: "Բառը կարող է ունենալ մեկ իմաստ՝ monosemia, կամ մի քանի իմաստ՝ polisemia։"
  },
  {
    id: "st-3",
    es: "Los sinónimos tienen significados parecidos y los antónimos tienen significados opuestos. También existen los homónimos y los campos semánticos.",
    hy: "Հոմանիշները ունեն նման իմաստ, իսկ հականիշները՝ հակառակ իմաստ։ Կան նաև համանուններ և իմաստային դաշտեր։"
  },
  {
    id: "st-4",
    es: "Además, podemos distinguir entre significado denotativo, que es literal, y connotativo, que expresa ideas o asociaciones.",
    hy: "Բացի այդ, տարբերում ենք denotativo՝ ուղիղ իմաստը, և connotativo՝ լրացուցիչ կամ ասոցիատիվ իմաստը։"
  }
];

export const VOCABULARY_FLASHCARDS = [
  { es: "Monosemia", hy: "Մեկիմաստություն", detail: "Un solo significado / Մեկ իմաստ", tag: "Տերմին" },
  { es: "Polisemia", hy: "Բազմիմաստություն", detail: "Varios significados relacionados / Մի քանի փոխկապակցված իմաստ", tag: "Տերմին" },
  { es: "Sinónimos", hy: "Հոմանիշներ", detail: "Significados iguales o parecidos / Նույն կամ նման իմաստ", tag: "Տերմին" },
  { es: "Antónimos", hy: "Հականիշներ", detail: "Significados opuestos / Հակառակ իմաստներ", tag: "Տերմին" },
  { es: "Homónimos", hy: "Համանուններ", detail: "Misma forma, distinto significado / Նույն ձև, տարբեր իմաստ", tag: "Տերմին" },
  { es: "Campo semántico", hy: "Իմաստային դաշտ", detail: "Grupo de palabras relacionadas / Կապված բառերի խումբ", tag: "Տերմին" },
  { es: "Denotativo", hy: "Ուղիղ իմաստ", detail: "Significado objetivo y literal / Օբյեկտիվ և ուղիղ իմաստ", tag: "Տերմին" },
  { es: "Connotativo", hy: "Լրացուցիչ/փոխաբերական իմաստ", detail: "Emociones, ideas o asociaciones / Հույզեր, գաղափարներ, ասոցիացիաներ", tag: "Տերմին" },
  { es: "banco (asiento / entidad)", hy: "նստարան / բանկ", detail: "Ejemplo de polisemia / Բազմիմաստ բառի օրինակ", tag: "Օրինակ" },
  { es: "bonito — hermoso", hy: "սիրուն — գեղեցիկ", detail: "Sinónimos / Հոմանիշներ", tag: "Օրինակ" },
  { es: "rápido — veloz", hy: "արագ — սրընթաց", detail: "Sinónimos / Հոմանիշներ", tag: "Օրինակ" },
  { es: "feliz — contento", hy: "ուրախ — գոհ/ուրախ", detail: "Sinónimos / Հոմանիշներ", tag: "Օրինակ" },
  { es: "alto — bajo", hy: "բարձր — ցածր / կարճահասակ", detail: "Antónimos / Հականիշներ", tag: "Օրինակ" },
  { es: "grande — pequeño", hy: "մեծ — փոքր", detail: "Antónimos / Հականիշներ", tag: "Օրինակ" },
  { es: "frío — caliente", hy: "սառը — տաք", detail: "Antónimos / Հականիշներ", tag: "Օրինակ" },
  { es: "entrar — salir", hy: "մտնել — դուրս գալ", detail: "Antónimos / Հականիշներ", tag: "Օրինակ" },
  { es: "vino (bebida / verbo)", hy: "գինի / եկավ (venir)", detail: "Homónimos / Համանուններ", tag: "Օրինակ" },
  { es: "fútbol, tenis, baloncesto, natación", hy: "ֆուտբոլ, թենիս, բասկետբոլ, լող", detail: "Campo semántico de deportes / Սպորտի իմաստային դաշտ", tag: "Օրինակ" },
  { es: "mesa, silla, sofá, armario", hy: "սեղան, աթոռ, բազմոց, պահարան", detail: "Campo semántico de muebles / Կահույքի իմաստային դաշտ", tag: "Օրինակ" },
  { es: "Perro = animal doméstico", hy: "Շուն = ընտանի կենդանի", detail: "Denotativo / Ուղիղ իմաստ", tag: "Օրինակ" },
  { es: "Eres un sol", hy: "Դու արև ես (շատ բարի ես)", detail: "Connotativo / Փոխաբերական իմաստ", tag: "Օրինակ" }
];
