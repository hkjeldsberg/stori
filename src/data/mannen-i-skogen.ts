import type { Page } from "@/types/story";

// Seed data from PRD §6, expanded to 6 pages for a satisfying narrative arc.
// In-memory until Supabase wiring lands.
//
// Every sentence uses common-gender indefinite ("en …") so the adjective slot
// takes the uninflected base form ("modig", "liten", etc.). Avoiding neuter
// ("et …") sidesteps inflection mismatches like "et stor hus".
export const mannenISkogenPages: Page[] = [
  {
    id: "mannen-i-skogen-p1",
    storyId: "mannen-i-skogen",
    pageNumber: 1,
    sentenceTemplate: "Det var en gang en _____ mann som bodde i skogen.",
    basePromptSubject: "A man",
    basePromptSetting: "A forest",
    createdAt: new Date(0).toISOString(),
  },
  {
    id: "mannen-i-skogen-p2",
    storyId: "mannen-i-skogen",
    pageNumber: 2,
    sentenceTemplate: "En morgen la han ut på en _____ reise.",
    basePromptSubject: "A man walking",
    basePromptSetting: "A winding forest road",
    createdAt: new Date(0).toISOString(),
  },
  {
    id: "mannen-i-skogen-p3",
    storyId: "mannen-i-skogen",
    pageNumber: 3,
    sentenceTemplate: "Underveis møtte han en _____ ugle i et tre.",
    basePromptSubject: "An owl",
    basePromptSetting: "A tall oak tree",
    createdAt: new Date(0).toISOString(),
  },
  {
    id: "mannen-i-skogen-p4",
    storyId: "mannen-i-skogen",
    pageNumber: 4,
    sentenceTemplate: "Uglen viste ham en _____ sti gjennom skogen.",
    basePromptSubject: "A narrow path",
    basePromptSetting: "A mossy forest floor",
    createdAt: new Date(0).toISOString(),
  },
  {
    id: "mannen-i-skogen-p5",
    storyId: "mannen-i-skogen",
    pageNumber: 5,
    sentenceTemplate: "Ved enden av stien fant han en _____ hytte.",
    basePromptSubject: "A wooden cabin",
    basePromptSetting: "A forest clearing",
    createdAt: new Date(0).toISOString(),
  },
  {
    id: "mannen-i-skogen-p6",
    storyId: "mannen-i-skogen",
    pageNumber: 6,
    sentenceTemplate: "Inne satte han seg ned med en _____ kopp te.",
    basePromptSubject: "A cup of tea",
    basePromptSetting: "A cozy fireplace",
    createdAt: new Date(0).toISOString(),
  },
];

export const mannenISkogenTitle = "Mannen i Skogen";
export const mannenISkogenId = "mannen-i-skogen";
export const mannenISkogenDescription = "En liten fortelling om en mann som bor i skogen.";
