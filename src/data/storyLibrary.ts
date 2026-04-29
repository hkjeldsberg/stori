import type { Page } from "@/types/story";

// Library of Norwegian Bokmål story templates. Each story is 5-7 pages.
// Adjective slots (_____) are written to accept common Norwegian adjectives
// like "modig", "liten", "glad", "rask" in an indefinite-form position.
// The existing "Mannen i Skogen" story lives in mannen-i-skogen.ts and is
// intentionally not duplicated here.

export interface StoryTemplate {
  id: string;
  title: string;
  description: string;
  pages: Array<
    Omit<Page, "id" | "storyId" | "createdAt"> & {
      id: string;
      storyId: string;
      createdAt: string;
    }
  >;
}

const createdAt = new Date(0).toISOString();

export const storyTemplates: StoryTemplate[] = [
  {
    id: "prinsessen-i-slottet",
    title: "Prinsessen i Slottet",
    description:
      "En prinsesse utforsker det store slottet sitt og finner en hemmelighet i tårnet.",
    pages: [
      {
        id: "prinsessen-i-slottet-p1",
        storyId: "prinsessen-i-slottet",
        pageNumber: 1,
        sentenceTemplate:
          "Det bodde en gang en _____ prinsesse i et gammelt slott.",
        basePromptSubject: "A princess",
        basePromptSetting: "A castle",
        createdAt,
      },
      {
        id: "prinsessen-i-slottet-p2",
        storyId: "prinsessen-i-slottet",
        pageNumber: 2,
        sentenceTemplate: "Hun gikk inn i en _____ sal med høye vinduer.",
        basePromptSubject: "A princess walking",
        basePromptSetting: "A castle hall",
        createdAt,
      },
      {
        id: "prinsessen-i-slottet-p3",
        storyId: "prinsessen-i-slottet",
        pageNumber: 3,
        sentenceTemplate: "I tårnet fant hun en _____ kiste full av skatter.",
        basePromptSubject: "A treasure chest",
        basePromptSetting: "A castle tower",
        createdAt,
      },
      {
        id: "prinsessen-i-slottet-p4",
        storyId: "prinsessen-i-slottet",
        pageNumber: 4,
        sentenceTemplate: "En _____ katt hoppet opp i vinduskarmen og måtte.",
        basePromptSubject: "A cat",
        basePromptSetting: "A castle window",
        createdAt,
      },
      {
        id: "prinsessen-i-slottet-p5",
        storyId: "prinsessen-i-slottet",
        pageNumber: 5,
        sentenceTemplate: "Sammen danset de i en _____ hage full av roser.",
        basePromptSubject: "A princess dancing with a cat",
        basePromptSetting: "A castle garden",
        createdAt,
      },
      {
        id: "prinsessen-i-slottet-p6",
        storyId: "prinsessen-i-slottet",
        pageNumber: 6,
        sentenceTemplate: "Til slutt sovnet prinsessen med et _____ smil.",
        basePromptSubject: "A sleeping princess",
        basePromptSetting: "A royal bedroom",
        createdAt,
      },
    ],
  },
  {
    id: "bjornen-pa-fjellet",
    title: "Bjørnen på Fjellet",
    description:
      "En bjørn vandrer oppover fjellet for å finne den vakreste utsikten.",
    pages: [
      {
        id: "bjornen-pa-fjellet-p1",
        storyId: "bjornen-pa-fjellet",
        pageNumber: 1,
        sentenceTemplate:
          "Høyt oppe i fjellet bodde det en _____ bjørn helt alene.",
        basePromptSubject: "A bear",
        basePromptSetting: "A mountain",
        createdAt,
      },
      {
        id: "bjornen-pa-fjellet-p2",
        storyId: "bjornen-pa-fjellet",
        pageNumber: 2,
        sentenceTemplate: "Han våknet en _____ morgen og lyttet til vinden.",
        basePromptSubject: "A bear yawning",
        basePromptSetting: "A mountain cave",
        createdAt,
      },
      {
        id: "bjornen-pa-fjellet-p3",
        storyId: "bjornen-pa-fjellet",
        pageNumber: 3,
        sentenceTemplate: "Bjørnen klatret oppover en _____ sti mot toppen.",
        basePromptSubject: "A bear climbing",
        basePromptSetting: "A mountain path",
        createdAt,
      },
      {
        id: "bjornen-pa-fjellet-p4",
        storyId: "bjornen-pa-fjellet",
        pageNumber: 4,
        sentenceTemplate: "På veien møtte han en _____ hare som hilste pent.",
        basePromptSubject: "A hare",
        basePromptSetting: "A mountain meadow",
        createdAt,
      },
      {
        id: "bjornen-pa-fjellet-p5",
        storyId: "bjornen-pa-fjellet",
        pageNumber: 5,
        sentenceTemplate: "Fra toppen så han en _____ dal langt der nede.",
        basePromptSubject: "A bear on a summit",
        basePromptSetting: "A mountain peak",
        createdAt,
      },
      {
        id: "bjornen-pa-fjellet-p6",
        storyId: "bjornen-pa-fjellet",
        pageNumber: 6,
        sentenceTemplate: "Bjørnen brølte et _____ brøl, og alt ble stille.",
        basePromptSubject: "A roaring bear",
        basePromptSetting: "A mountain sunset",
        createdAt,
      },
    ],
  },
  {
    id: "havfruen-i-havet",
    title: "Havfruen i Havet",
    description:
      "En havfrue svømmer gjennom korallrev og finner en gammel skatt på havets bunn.",
    pages: [
      {
        id: "havfruen-i-havet-p1",
        storyId: "havfruen-i-havet",
        pageNumber: 1,
        sentenceTemplate:
          "Dypt nede i havet svømte det en _____ havfrue med langt hår.",
        basePromptSubject: "A mermaid",
        basePromptSetting: "An underwater scene",
        createdAt,
      },
      {
        id: "havfruen-i-havet-p2",
        storyId: "havfruen-i-havet",
        pageNumber: 2,
        sentenceTemplate: "Hun lekte mellom _____ koraller hele dagen lang.",
        basePromptSubject: "A mermaid swimming",
        basePromptSetting: "A coral reef",
        createdAt,
      },
      {
        id: "havfruen-i-havet-p3",
        storyId: "havfruen-i-havet",
        pageNumber: 3,
        sentenceTemplate: "Plutselig så hun et _____ skipsvrak i sanden.",
        basePromptSubject: "A shipwreck",
        basePromptSetting: "A sandy ocean floor",
        createdAt,
      },
      {
        id: "havfruen-i-havet-p4",
        storyId: "havfruen-i-havet",
        pageNumber: 4,
        sentenceTemplate: "Inne i vraket fant hun en _____ perle som glitret.",
        basePromptSubject: "A pearl",
        basePromptSetting: "A shipwreck interior",
        createdAt,
      },
      {
        id: "havfruen-i-havet-p5",
        storyId: "havfruen-i-havet",
        pageNumber: 5,
        sentenceTemplate: "En _____ delfin kom svømmende for å se hva hun hadde.",
        basePromptSubject: "A dolphin",
        basePromptSetting: "An open ocean",
        createdAt,
      },
      {
        id: "havfruen-i-havet-p6",
        storyId: "havfruen-i-havet",
        pageNumber: 6,
        sentenceTemplate:
          "Sammen svømte de mot overflaten under en _____ måne.",
        basePromptSubject: "A mermaid and a dolphin",
        basePromptSetting: "An ocean surface at night",
        createdAt,
      },
    ],
  },
  {
    id: "trollet-under-broen",
    title: "Trollet under Broen",
    description:
      "Et ensomt troll under broen møter en liten geit og får seg en uventet venn.",
    pages: [
      {
        id: "trollet-under-broen-p1",
        storyId: "trollet-under-broen",
        pageNumber: 1,
        sentenceTemplate:
          "Under en gammel bro bodde det et _____ troll helt for seg selv.",
        basePromptSubject: "A troll",
        basePromptSetting: "An old stone bridge",
        createdAt,
      },
      {
        id: "trollet-under-broen-p2",
        storyId: "trollet-under-broen",
        pageNumber: 2,
        sentenceTemplate: "Trollet satt og stirret på den _____ elven hver dag.",
        basePromptSubject: "A troll sitting",
        basePromptSetting: "A river under a bridge",
        createdAt,
      },
      {
        id: "trollet-under-broen-p3",
        storyId: "trollet-under-broen",
        pageNumber: 3,
        sentenceTemplate: "En dag kom en _____ geit trippende over broen.",
        basePromptSubject: "A goat",
        basePromptSetting: "A wooden bridge",
        createdAt,
      },
      {
        id: "trollet-under-broen-p4",
        storyId: "trollet-under-broen",
        pageNumber: 4,
        sentenceTemplate: "Trollet ropte med en _____ stemme: Hvem går der?",
        basePromptSubject: "A shouting troll",
        basePromptSetting: "A bridge at dusk",
        createdAt,
      },
      {
        id: "trollet-under-broen-p5",
        storyId: "trollet-under-broen",
        pageNumber: 5,
        sentenceTemplate: "Geita svarte med et _____ blikk og smilte bredt.",
        basePromptSubject: "A smiling goat",
        basePromptSetting: "A bridge at dusk",
        createdAt,
      },
      {
        id: "trollet-under-broen-p6",
        storyId: "trollet-under-broen",
        pageNumber: 6,
        sentenceTemplate: "Fra da av ble de _____ venner for resten av livet.",
        basePromptSubject: "A troll and a goat together",
        basePromptSetting: "A meadow near a bridge",
        createdAt,
      },
    ],
  },
  {
    id: "jenta-og-stjernene",
    title: "Jenta og Stjernene",
    description:
      "En jente klatrer opp på taket en natt og oppdager hva stjernene forteller.",
    pages: [
      {
        id: "jenta-og-stjernene-p1",
        storyId: "jenta-og-stjernene",
        pageNumber: 1,
        sentenceTemplate:
          "Det var en gang en _____ jente som elsket å se på himmelen.",
        basePromptSubject: "A girl",
        basePromptSetting: "A bedroom window at night",
        createdAt,
      },
      {
        id: "jenta-og-stjernene-p2",
        storyId: "jenta-og-stjernene",
        pageNumber: 2,
        sentenceTemplate: "En _____ kveld klatret hun opp på taket.",
        basePromptSubject: "A girl climbing",
        basePromptSetting: "A rooftop at twilight",
        createdAt,
      },
      {
        id: "jenta-og-stjernene-p3",
        storyId: "jenta-og-stjernene",
        pageNumber: 3,
        sentenceTemplate: "Over henne blinket en _____ stjerne helt nær.",
        basePromptSubject: "A bright star",
        basePromptSetting: "A starry sky",
        createdAt,
      },
      {
        id: "jenta-og-stjernene-p4",
        storyId: "jenta-og-stjernene",
        pageNumber: 4,
        sentenceTemplate: "Stjernen hvisket et _____ ønske rett i øret hennes.",
        basePromptSubject: "A girl listening",
        basePromptSetting: "A rooftop under stars",
        createdAt,
      },
      {
        id: "jenta-og-stjernene-p5",
        storyId: "jenta-og-stjernene",
        pageNumber: 5,
        sentenceTemplate: "Hun lukket øynene og tenkte på et _____ eventyr.",
        basePromptSubject: "A girl with closed eyes",
        basePromptSetting: "A rooftop at night",
        createdAt,
      },
      {
        id: "jenta-og-stjernene-p6",
        storyId: "jenta-og-stjernene",
        pageNumber: 6,
        sentenceTemplate: "Om morgenen våknet hun med en _____ følelse i brystet.",
        basePromptSubject: "A girl waking up",
        basePromptSetting: "A sunny bedroom",
        createdAt,
      },
    ],
  },
];
