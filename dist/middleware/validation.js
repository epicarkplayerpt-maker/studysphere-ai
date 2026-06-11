"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gradeQuizSchema = exports.generateQuizSchema = exports.gradeFlashcardSchema = exports.createFlashcardSchema = exports.querySchema = exports.createBinderSchema = exports.googleAuthSchema = exports.validateRequest = void 0;
const zod_1 = require("zod");
const logger_1 = __importDefault(require("../lib/logger"));
const validateRequest = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                logger_1.default.warn('Validation error for %s %s: %j', req.method, req.path, error.issues);
                res.status(400).json({
                    error: 'Validation failed',
                    details: error.issues.map((err) => ({
                        field: err.path.join('.'),
                        message: err.message,
                    })),
                });
                return;
            }
            logger_1.default.error('Unexpected validation error: %s', error);
            res.status(500).json({ error: 'Internal validation handler failure.' });
        }
    };
};
exports.validateRequest = validateRequest;
// --- Authentication Schemas ---
exports.googleAuthSchema = zod_1.z.object({
    body: zod_1.z.object({
        idToken: zod_1.z.string().min(1, 'idToken is required'),
    }),
});
// --- Study Schemas ---
exports.createBinderSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Binder name is required').max(100),
        description: zod_1.z.string().optional(),
    }),
});
exports.querySchema = zod_1.z.object({
    body: zod_1.z.object({
        query: zod_1.z.string().min(1, 'Query is required'),
        binderId: zod_1.z.string().uuid('Invalid binder ID format').optional(),
        deepResearch: zod_1.z.boolean().optional(),
    }),
});
exports.createFlashcardSchema = zod_1.z.object({
    body: zod_1.z.object({
        front: zod_1.z.string().min(1, 'Front text is required'),
        back: zod_1.z.string().min(1, 'Back text is required'),
    }),
});
exports.gradeFlashcardSchema = zod_1.z.object({
    body: zod_1.z.object({
        flashcardId: zod_1.z.string().uuid('Invalid flashcard ID format'),
        score: zod_1.z.number().int().min(0).max(5),
    }),
});
exports.generateQuizSchema = zod_1.z.object({
    body: zod_1.z.object({
        binderId: zod_1.z.string().uuid('Invalid binder ID format'),
        questionCount: zod_1.z.number().int().min(1).max(20).optional().default(5),
    }),
});
exports.gradeQuizSchema = zod_1.z.object({
    body: zod_1.z.object({
        quizAnswers: zod_1.z.array(zod_1.z.object({
            question: zod_1.z.string().min(1),
            userAnswer: zod_1.z.string(),
        })),
    }),
});
