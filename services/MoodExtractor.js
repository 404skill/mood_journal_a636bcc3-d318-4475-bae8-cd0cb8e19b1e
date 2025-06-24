// utils/MoodExtractor.js

import { InferenceClient } from '@huggingface/inference';

export class MoodExtractor {
  constructor({
    token   = process.env.HUGGING_FACE_TOKEN,
    model   = 'j-hartmann/emotion-english-distilroberta-base',
  } = {}) {
    if (!token || typeof token !== 'string') {
      throw new Error('Hugging Face token is required');
    }
    this.hfClient = new InferenceClient(token);
    this.model = model;
  }

  async extract(text) {
    try {
      const results = await this.hfClient.textClassification({
        model:  this.model,
        inputs: text
      });
      if (Array.isArray(results) && results.length > 0) {
        return results[0].label.toLowerCase();
      }
    } catch (err) {
      console.warn('HF extraction failed, defaulting to neutral', err);
    }
  }
}

export const moodExtractor = new MoodExtractor();
