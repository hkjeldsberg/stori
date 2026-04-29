### **Product Requirements Document (PRD): Ståri**

#### **1. Vision** 🚀

To create a highly responsive interactive storybook application, **Ståri**, that brings Norwegian stories to life by generating simple, iconic illustrations in near real-time based on adjectives supplied by the user. The application will prioritize speed and interactivity to create a magical and seamless creative experience.

#### **2. Core Features & User Stories** 📖

#### **2. Core Features & User Stories** 📖

| Feature | User Story |
| :--- | :--- |
| **Interactive Story Pages** | As a user, I want to see a single sentence with a blank space on one side of the "book" so I can understand what I need to add. |
| **Dynamic Visualization** | As a user, I want to see an initial black-and-white drawing that represents the base sentence *before* I add my adjective. |
| **Adjective Input** | As a user, I want to be able to either type my own adjective or choose from a few creative suggestions to fill in the blank. |
| **Instantaneous Rendering** | As a user, I want the drawing to re-render **almost instantly** when I enter my adjective, making the application feel responsive and magical. |
| **Book-like Navigation** | As a user, I want to be able to "turn the page" to continue to the next part of the story, with the illustration updating quickly. |

---

#### **3. Localization & Language** 🇳🇴

*   **Primary Language:** Norwegian (Bokmål). All user-facing text, including story content and UI elements, will be in Norwegian.
*   **Example UI Copy:**
    *   **Button:** "Neste side" (Next Page)
    *   **Instruction:** "Skriv inn et adjektiv" (Enter an adjective)

---

#### **4. Proposed Tech Stack** 💻

*(This section remains largely the same, but with specifics for the database schema)*

| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Frontend** | **React** or **Next.js** with **TypeScript** | Robust framework for a dynamic UI. |
| **Styling & Animation**| **Tailwind CSS** & **Framer Motion** | For a clean layout and fluid, book-like page-turning animations. |
| **3D "Book" Effect** | **Three.js** or custom **GLSL shaders** | To achieve the desired 3D, shaded look for the book layout. |
| **Backend & Database**| **Supabase** | Excellent for managing story content and running serverless functions. The database schema will be named **`stori`**. |
| **Image Generation**| **Generative AI (e.g., Google's Imagen)** | Using speed-optimized prompts (e.g., `fast generation, simple line art. Subject: [Subject]. Setting: [Setting].`) to ensure a real-time feel. |

---

#### **5. Database Schema (Supabase)**

The database will use the **`stori`** schema.

**Table: `stori.stories`**
This table holds the overall information for each storybook.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | Primary Key, `default gen_random_uuid()` | Unique identifier for the story. |
| `title` | `text` | `not null` | The title of the story (e.g., "Mannen i Skogen"). |
| `description` | `text` | | A brief summary of the story. |
| `created_at`| `timestamptz` | `default now()` | Timestamp for when the story was created. |

**Table: `stori.pages`**
This table holds the content for each individual page within a story.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | Primary Key, `default gen_random_uuid()` | Unique identifier for the page. |
| `story_id` | `uuid` | Foreign Key -> `stori.stories.id` | Links the page to its parent story. |
| `page_number`| `integer` | `not null` | The order of the page in the story (1, 2, 3...). |
| `sentence_template`| `text` | `not null` | The Norwegian sentence with a blank, e.g., "Det var en gang en \_\_\_\_\_ mann som bodde i skogen.". |
| `base_prompt_subject`| `text` | `not null` | The core subject for the image prompt, e.g., "A man". |
| `base_prompt_setting`| `text` | `not null` | The core setting for the image prompt, e.g., "A forest". |
| `created_at` | `timestamptz` | `default now()` | Timestamp for when the page was created. |

---

#### **6. Planning & Norwegian Prompt Examples** ✨

**Example Story: "Mannen i Skogen"**

**Page 1:**
*   **Sentence Template:** `Det var en gang en _____ mann som bodde i skogen.`
*   **User Fills:** `modig` (brave)
*   **Speed-Optimized Prompt:** `fast generation, simple black and white line art, icon style. Subject: A brave man. Setting: A forest.`

**Page 2:**
*   **Sentence Template:** `Han la ut på en _____ reise.`
*   **User Fills:** `lang` (long)
*   **Speed-Optimized Prompt:** `fast generation, simple black and white line art, icon style. Subject: A man on a journey. Setting: A long path.`



