import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

@Injectable()
export class AIService {
  private genAI: GoogleGenerativeAI | undefined;
  private model: GenerativeModel | undefined;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY')?.trim();

    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      console.warn('GEMINI_API_KEY is not configured properly.');
    } else {
      this.genAI = new GoogleGenerativeAI(apiKey);
      // Use gemini-2.0-flash which is confirmed to be available for this API key
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    }
  }

  /**
   * Returns true if Gemini is properly configured with an API key
   */
  isConfigured(): boolean {
    return !!this.model;
  }

  async generateText(prompt: string): Promise<string> {
    if (!this.model) {
      throw new InternalServerErrorException('Gemini AI is not configured.');
    }

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (error: unknown) {
      console.error('Gemini API Error:', error);

      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const errorStatus =
        typeof error === 'object' && error !== null && 'status' in error
          ? (error as Record<string, unknown>).status
          : undefined;

      if (errorStatus === 429 || errorMessage.includes('429')) {
        throw new InternalServerErrorException(
          'AI rate limit reached. Please wait a moment and try again later.',
        );
      }

      throw new InternalServerErrorException(
        errorMessage || 'Failed to generate content from AI.',
      );
    }
  }

  async generateJsonResponse<T>(prompt: string): Promise<T> {
    const jsonPrompt = `${prompt}\n\nReturn the response strictly as a JSON object. No markdown, no triple backticks.`;
    const text = await this.generateText(jsonPrompt);
    try {
      // Clean up potential markdown if Gemini still adds it despite instructions
      const cleanText = text
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
      return JSON.parse(cleanText) as T;
    } catch (parseError) {
      console.error('Failed to parse Gemini JSON response:', text, parseError);
      throw new InternalServerErrorException(
        'AI returned invalid JSON format.',
      );
    }
  }

  async generateBlogContent(title: string, keywords?: string): Promise<string> {
    const prompt = `Write a high-quality, SEO-optimized blog post body based on the following title: "${title}".
      ${keywords ? `Include context about: ${keywords}.` : ''}
      Format in Markdown with headings. Return ONLY content.`;

    return this.generateText(prompt);
  }

  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
