---
name: groq-whisper
description: Fast cloud speech-to-text via Groq Whisper API (replaces local openai-whisper).
homepage: https://console.groq.com/docs/speech-text
metadata: {"clawdbot":{"emoji":"🎙️","requires":{"env":["GROQ_API_KEY"]}}}
---

# Groq Whisper — Audio Transcription

Transcribe audio files using the Groq API (whisper-large-v3-turbo).

## Quick Start

```bash
node skills/groq-whisper/transcribe.js /path/to/audio.mp3
node skills/groq-whisper/transcribe.js /path/to/audio.m4a --language de
node skills/groq-whisper/transcribe.js /path/to/audio.mp3 --translate --format txt
```

## Programmatic

```js
const { transcribe } = require("./skills/groq-whisper/transcribe");
const result = await transcribe("/path/to/file.mp3", { language: "de" });
console.log(result.text);
```

## Models

| Model | Use Case |
|-------|----------|
| whisper-large-v3-turbo | Default transcription (fast) |
| whisper-large-v3 | Translation / higher accuracy |

## Env

- `GROQ_API_KEY` — Required. Get from https://console.groq.com/keys

## Supported Formats

mp3, mp4, mpeg, mpga, m4a, wav, webm — max 25 MB.
