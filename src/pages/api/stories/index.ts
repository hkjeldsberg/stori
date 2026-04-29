import type { NextApiRequest, NextApiResponse } from "next";
import { listStoriesForPicker, type StoryWithPages } from "@/services/stories";

interface ErrorResponse {
  error: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ stories: StoryWithPages[] } | ErrorResponse>,
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const stories = await listStoriesForPicker();
    return res.status(200).json({ stories });
  } catch (err) {
    console.error("GET /api/stories failed:", err);
    return res.status(500).json({ error: "Kunne ikke hente fortellinger." });
  }
}
