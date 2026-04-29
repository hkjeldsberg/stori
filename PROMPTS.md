**1. To Generate the Database Schema:**

> "Read the `prd.md` file. Based on the 'Database Schema (Supabase)' section, generate the complete SQL code to create the `stori` schema and the `stories` and `pages` tables, including all specified constraints and default values. Ensure the foreign key relationship is correctly defined."

**2. To Set Up the Project Structure:**

> "Read the `prd.md` file. I am building a Next.js application with TypeScript and Tailwind CSS. Based on the PRD, suggest a logical folder and file structure inside the `/src` directory. Include folders for components, services (for Supabase calls), contexts (for state management), and pages."

**3. To Create the Main React Component:**

> "Read `prd.md`. Write a React component in TypeScript named `StoryPage.tsx` using Next.js and Tailwind CSS.
>
> It should:
> 1.  Accept `sentence_template`, `base_prompt_subject`, and `base_prompt_setting` as props.
> 2.  Display the sentence with an input field for the adjective.
> 3.  Have a state to hold the user's adjective.
> 4.  Have a placeholder `div` on the right side for the generated image.
> 5.  Include a disabled 'Neste side' button at the bottom."

**4. To Create the API Route for Image Generation:**

> "Read `prd.md`. Create a Next.js API route file at `src/pages/api/generate-image.ts`. This route should receive a `subject`, `setting`, and `adjective` in its request body.
>
> It must then:
> 1.  Construct the speed-optimized prompt string as defined in the PRD (e.g., `fast generation, simple black and white line art...`).
> 2.  Include a placeholder comment where I would call the actual image generation model API.
> 3.  Return a mock image URL as a JSON response."
