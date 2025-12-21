import { GoogleGenerativeAI } from '@google/generative-ai';

export const config = {
  runtime: 'edge',
};

interface GeneratedQuestion {
  type: 'qcm';
  question: string;
  options: string[];
  correctAnswer: string;
  points: number;
}

export default async function handler(request: Request) {
  // Handle CORS
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { subject, count = 5, language = 'fr' } = await request.json();

    if (!subject) {
      return new Response(JSON.stringify({ error: 'Subject is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.0-pro' });

    const systemPrompt = `Tu es un expert en pédagogie et en création d'examens. Tu dois générer exactement ${count} questions à choix multiples (QCM) sur le sujet donné.

RÈGLES IMPORTANTES:
1. Chaque question doit être claire et bien formulée
2. Chaque question doit avoir exactement 4 options (A, B, C, D)
3. Une seule réponse correcte par question
4. Les questions doivent être de difficulté variée (facile, moyenne, difficile)
5. Langue des questions: ${language === 'fr' ? 'Français' : 'English'}

RETOURNE UNIQUEMENT un tableau JSON valide, sans aucun texte avant ou après, avec ce format exact:
[
  {
    "type": "qcm",
    "question": "La question ici ?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "A",
    "points": 2
  }
]

Les points doivent varier entre 1 et 3 selon la difficulté.
La correctAnswer doit être "A", "B", "C" ou "D".`;

    const result = await model.generateContent([
      { text: systemPrompt },
      { text: `Sujet: ${subject}` },
    ]);

    const response = result.response;
    const text = response.text();

    // Extract JSON from response (handle markdown code blocks)
    let jsonText = text;
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      jsonText = jsonMatch[1];
    }
    
    // Clean up the text
    jsonText = jsonText.trim();
    if (!jsonText.startsWith('[')) {
      const arrayStart = jsonText.indexOf('[');
      if (arrayStart !== -1) {
        jsonText = jsonText.substring(arrayStart);
      }
    }
    if (!jsonText.endsWith(']')) {
      const arrayEnd = jsonText.lastIndexOf(']');
      if (arrayEnd !== -1) {
        jsonText = jsonText.substring(0, arrayEnd + 1);
      }
    }

    const questions: GeneratedQuestion[] = JSON.parse(jsonText);

    // Validate the response
    if (!Array.isArray(questions)) {
      throw new Error('Invalid response format');
    }

    // Ensure all questions have correct structure
    const validatedQuestions = questions.map((q, index) => ({
      type: 'qcm' as const,
      question: q.question || `Question ${index + 1}`,
      options: Array.isArray(q.options) ? q.options.slice(0, 4) : ['A', 'B', 'C', 'D'],
      correctAnswer: ['A', 'B', 'C', 'D'].includes(q.correctAnswer) ? q.correctAnswer : 'A',
      points: typeof q.points === 'number' ? q.points : 2,
    }));

    return new Response(JSON.stringify({ questions: validatedQuestions }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error generating questions:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate questions',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
