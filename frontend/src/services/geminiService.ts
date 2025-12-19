// Note: Direct client-side Gemini usage is available but we recommend using
// the API route for security (keeps API key on server)

export interface GeneratedQuestion {
  type: 'qcm';
  content: string;
  options: string[];
  answer: string;
  points: number;
}

export interface GenerationResult {
  questions: GeneratedQuestion[];
}

/**
 * Generate questions via the API route (recommended for production)
 * This keeps the API key secure on the server
 */
export async function generateQuestionsViaAPI(
  subject: string,
  count: number = 5,
  language: string = 'fr'
): Promise<GeneratedQuestion[]> {
  const response = await fetch('/api/generate-questions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subject, count, language }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.details || error.error || 'Failed to generate questions');
  }

  const data = await response.json();
  
  // Normalize the response format
  const questions: GeneratedQuestion[] = data.questions.map((q: any) => ({
    type: 'qcm' as const,
    content: q.question || q.content,
    options: q.options,
    answer: q.correctAnswer || q.answer,
    points: q.points || 2,
  }));
  
  return questions;
}
