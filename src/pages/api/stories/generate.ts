import type { NextApiRequest, NextApiResponse } from "next";
import {
  getRandomTemplate,
  getTemplateById,
  instantiateTemplate,
  type StoryWithPages,
} from "@/services/stories";

interface ErrorResponse {
  error: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ story: StoryWithPages } | ErrorResponse>,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const body = (req.body ?? {}) as { templateId?: unknown; excludeId?: unknown };
  const templateId = typeof body.templateId === "string" ? body.templateId : undefined;
  const excludeId = typeof body.excludeId === "string" ? body.excludeId : undefined;

  try {
    const template = templateId
      ? getTemplateById(templateId)
      : getRandomTemplate(excludeId);

    if (!template) {
      return res.status(404).json({ error: "Fant ikke malen." });
    }

    const story = await instantiateTemplate(template);
    return res.status(201).json({ story });
  } catch (err) {
    console.error("POST /api/stories/generate failed:", err);
    return res.status(500).json({ error: "Kunne ikke lage fortelling." });
  }
}
