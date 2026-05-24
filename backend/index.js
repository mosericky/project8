import 'dotenv/config';
import { z } from 'zod';

/**
 * Define the schema for the request query parameters.
 */
const querySchema = z.object({
  name: z.string().optional().default('Guest'),
});

/**
 * This is the main entry point for your API.
 * All requests starting with /api/ are routed here.
 */
export default async function handler(req, res) {
  try {
    // Validate the request query using Zod
    const validationResult = querySchema.safeParse(req.query);

    if (!validationResult.success) {
      // If validation fails, return a 400 Bad Request error
      return res.status(400).json({
        status: 'error',
        message: 'Invalid query parameters',
        errors: validationResult.error.issues,
      });
    }

    const { name } = validationResult.data;

    return res.status(200).json({
      status: 'success',
      message: `Welcome to the Style Hub API, ${name}!`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('API Error:', error); // Log the error for debugging
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
}