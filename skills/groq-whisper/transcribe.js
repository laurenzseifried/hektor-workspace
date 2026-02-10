#!/usr/bin/env node
// Groq Whisper Transcription — replaces local openai-whisper
// Usage: node transcribe.js <audio-file> [--language de] [--translate]

const fs = require("fs");
const path = require("path");
const Groq = require("groq-sdk");

async function transcribe(filePath, opts = {}) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error(
      "GROQ_API_KEY not set. Add it to your environment or openclaw config."
    );
  }

  const groq = new Groq();
  const model = opts.translate
    ? "whisper-large-v3"
    : "whisper-large-v3-turbo";

  const params = {
    file: fs.createReadStream(filePath),
    model,
    response_format: opts.format || "verbose_json",
  };
  if (opts.language) params.language = opts.language;
  if (opts.prompt) params.prompt = opts.prompt;

  const endpoint = opts.translate
    ? groq.audio.translations
    : groq.audio.transcriptions;

  const result = await endpoint.create(params);
  return result;
}

// CLI mode
if (require.main === module) {
  const args = process.argv.slice(2);
  if (!args.length) {
    console.error("Usage: node transcribe.js <file> [--language de] [--translate] [--format txt]");
    process.exit(1);
  }

  const filePath = args[0];
  const opts = {};
  for (let i = 1; i < args.length; i++) {
    if (args[i] === "--language" && args[i + 1]) opts.language = args[++i];
    if (args[i] === "--translate") opts.translate = true;
    if (args[i] === "--format" && args[i + 1]) opts.format = args[++i];
    if (args[i] === "--prompt" && args[i + 1]) opts.prompt = args[++i];
  }

  transcribe(filePath, opts)
    .then((r) => {
      if (typeof r === "string") console.log(r);
      else console.log(JSON.stringify(r, null, 2));
    })
    .catch((e) => {
      console.error("Error:", e.message);
      process.exit(1);
    });
}

module.exports = { transcribe };
