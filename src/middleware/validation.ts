import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodIssue, z } from 'zod';
import logger from '../lib/logger';

export const validateRequest = (schema: z.ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        logger.warn('Validation error for %s %s: %j', req.method, req.path, error.issues);
        res.status(400).json({
          error: 'Validation failed',
          details: error.issues.map((err: ZodIssue) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
        return;
      }
      logger.error('Unexpected validation error: %s', error);
      res.status(500).json({ error: 'Internal validation handler failure.' });
    }
  };
};

// --- Authentication Schemas ---
export const googleAuthSchema = z.object({
  body: z.object({
    idToken: z.string().min(1, 'idToken is required'),
  }),
});

// --- Study Schemas ---
export const createBinderSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Binder name is required').max(100),
    description: z.string().optional(),
  }),
});

export const querySchema = z.object({
  body: z.object({
    query: z.string().min(1, 'Query is required'),
    binderId: z.string().uuid('Invalid binder ID format').optional(),
    deepResearch: z.boolean().optional(),
  }),
});

export const createFlashcardSchema = z.object({
  body: z.object({
    front: z.string().min(1, 'Front text is required'),
    back: z.string().min(1, 'Back text is required'),
  }),
});

export const gradeFlashcardSchema = z.object({
  body: z.object({
    flashcardId: z.string().uuid('Invalid flashcard ID format'),
    score: z.number().int().min(0).max(5),
  }),
});

export const generateQuizSchema = z.object({
  body: z.object({
    binderId: z.string().uuid('Invalid binder ID format'),
    questionCount: z.number().int().min(1).max(20).optional().default(5),
  }),
});

export const gradeQuizSchema = z.object({
  body: z.object({
    quizAnswers: z.array(
      z.object({
        question: z.string().min(1),
        userAnswer: z.string(),
      })
    ),
  }),
});
