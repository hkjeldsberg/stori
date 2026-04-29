import type { NextApiRequest, NextApiResponse } from "next";
import type { GenerateImageResponse } from "@/types/story";
import { buildImagePrompt } from "@/lib/sentence";
import { getImageProvider } from "@/services/imageProvider";

interface ErrorResponse {
  error: string;
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GenerateImageResponse | ErrorResponse>,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { subject, setting, adjective } = (req.body ?? {}) as Partial<{
    subject: unknown;
    setting: unknown;
    adjective: unknown;
  }>;

  if (
    !isNonEmptyString(subject) ||
    !isNonEmptyString(setting) ||
    !isNonEmptyString(adjective)
  ) {
    return res
      .status(400)
      .json({ error: "subject, setting and adjective are required non-empty strings" });
  }

  const prompt = buildImagePrompt({ subject, setting, adjective });
  const { build } = getImageProvider();
  const imageUrl = build(prompt);

  // Remote URLs (e.g. pollinations) are proxied server-side so the browser
  // never hits an external host that may be blocked by corporate firewalls.
  if (imageUrl.startsWith("http")) {
    try {
      const upstream = await fetch(imageUrl);
      if (!upstream.ok) throw new Error(`upstream ${upstream.status}`);
      const buf = await upstream.arrayBuffer();
      const mime = upstream.headers.get("content-type") ?? "image/jpeg";
      const b64 = Buffer.from(buf).toString("base64");
      return res.status(200).json({ imageUrl: `data:${mime};base64,${b64}`, prompt });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return res.status(502).json({ error: `Image fetch failed: ${msg}` });
    }
  }

  return res.status(200).json({ imageUrl, prompt });
}
