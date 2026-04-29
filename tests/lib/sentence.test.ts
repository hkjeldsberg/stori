import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parseSentenceTemplate, buildImagePrompt } from "@/lib/sentence";

describe("parseSentenceTemplate", () => {
  it("splits on the _____ blank token", () => {
    const result = parseSentenceTemplate("Det var en gang en _____ mann.");
    assert.equal(result.hasBlank, true);
    assert.equal(result.prefix, "Det var en gang en ");
    assert.equal(result.suffix, " mann.");
  });

  it("returns hasBlank=false when no blank is present", () => {
    const result = parseSentenceTemplate("En hel setning uten blank.");
    assert.equal(result.hasBlank, false);
    assert.equal(result.prefix, "En hel setning uten blank.");
    assert.equal(result.suffix, "");
  });

  it("handles a blank at the start", () => {
    const result = parseSentenceTemplate("_____ var kongen.");
    assert.equal(result.hasBlank, true);
    assert.equal(result.prefix, "");
    assert.equal(result.suffix, " var kongen.");
  });

  it("handles a blank at the end", () => {
    const result = parseSentenceTemplate("Mannen var _____");
    assert.equal(result.hasBlank, true);
    assert.equal(result.prefix, "Mannen var ");
    assert.equal(result.suffix, "");
  });
});

describe("buildImagePrompt", () => {
  it("matches the PRD §6 page-1 example exactly", () => {
    const prompt = buildImagePrompt({
      subject: "A man",
      setting: "A forest",
      adjective: "brave",
    });
    assert.equal(
      prompt,
      "fast generation, simple black and white line art, icon style. Subject: A brave man. Setting: A forest.",
    );
  });

  it("strips a leading 'A ' from subject to avoid 'A brave A man'", () => {
    const prompt = buildImagePrompt({
      subject: "A dog",
      setting: "A garden",
      adjective: "red",
    });
    assert.match(prompt, /Subject: A red dog\./);
  });

  it("trims whitespace on all inputs", () => {
    const prompt = buildImagePrompt({
      subject: "  A man  ",
      setting: "  A forest  ",
      adjective: "  modig  ",
    });
    assert.equal(
      prompt,
      "fast generation, simple black and white line art, icon style. Subject: A modig man. Setting: A forest.",
    );
  });
});
