import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { NextApiRequest, NextApiResponse } from "next";
import handler from "@/pages/api/generate-image";

interface CapturedResponse {
  statusCode: number;
  body: unknown;
  headers: Record<string, string>;
}

function mockReq(method: string, body?: unknown): NextApiRequest {
  return { method, body, headers: {}, query: {}, cookies: {} } as unknown as NextApiRequest;
}

function mockRes(): { res: NextApiResponse; captured: CapturedResponse } {
  const captured: CapturedResponse = { statusCode: 0, body: null, headers: {} };
  const res = {
    setHeader(k: string, v: string) {
      captured.headers[k] = v;
    },
    status(code: number) {
      captured.statusCode = code;
      return res;
    },
    json(b: unknown) {
      captured.body = b;
      return res;
    },
  } as unknown as NextApiResponse;
  return { res, captured };
}

describe("/api/generate-image", () => {
  it("returns 405 for non-POST methods and sets Allow header", async () => {
    const { res, captured } = mockRes();
    await handler(mockReq("GET"), res);
    assert.equal(captured.statusCode, 405);
    assert.equal(captured.headers.Allow, "POST");
  });

  it("returns 400 when subject is missing", async () => {
    const { res, captured } = mockRes();
    await handler(mockReq("POST", { setting: "A forest", adjective: "modig" }), res);
    assert.equal(captured.statusCode, 400);
    assert.match((captured.body as { error: string }).error, /non-empty/);
  });

  it("returns 400 when setting is missing", async () => {
    const { res, captured } = mockRes();
    await handler(mockReq("POST", { subject: "A man", adjective: "modig" }), res);
    assert.equal(captured.statusCode, 400);
  });

  it("returns 400 when adjective is empty string", async () => {
    const { res, captured } = mockRes();
    await handler(mockReq("POST", { subject: "A man", setting: "A forest", adjective: "   " }), res);
    assert.equal(captured.statusCode, 400);
  });

  it("returns 200 with the PRD-shaped prompt and an imageUrl", async () => {
    const { res, captured } = mockRes();
    await handler(
      mockReq("POST", { subject: "A man", setting: "A forest", adjective: "modig" }),
      res,
    );
    assert.equal(captured.statusCode, 200);
    const body = captured.body as { imageUrl: string; prompt: string };
    assert.equal(
      body.prompt,
      "fast generation, simple black and white line art, icon style. Subject: A modig man. Setting: A forest.",
    );
    // default provider is svg-local → returns a data URL
    assert.match(body.imageUrl, /^(data:image\/svg\+xml|https:\/\/)/);
  });

  it("default provider renders a local SVG data URL containing the adjective", async () => {
    const { res, captured } = mockRes();
    await handler(
      mockReq("POST", { subject: "A man", setting: "A forest", adjective: "modig" }),
      res,
    );
    const body = captured.body as { imageUrl: string };
    assert.match(body.imageUrl, /^data:image\/svg\+xml/);
    const decoded = decodeURIComponent(body.imageUrl.replace(/^data:image\/svg\+xml[^,]*,/, ""));
    assert.match(decoded, /modig/);
    assert.match(decoded, /<svg[\s\S]+<\/svg>/);
  });

  it("honors IMAGE_PROVIDER=placeholder", async () => {
    const prev = process.env.IMAGE_PROVIDER;
    process.env.IMAGE_PROVIDER = "placeholder";
    try {
      const { res, captured } = mockRes();
      await handler(
        mockReq("POST", { subject: "A man", setting: "A forest", adjective: "modig" }),
        res,
      );
      const body = captured.body as { imageUrl: string };
      assert.match(body.imageUrl, /placehold\.co/);
    } finally {
      if (prev === undefined) delete process.env.IMAGE_PROVIDER;
      else process.env.IMAGE_PROVIDER = prev;
    }
  });
});
