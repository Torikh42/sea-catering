import type { AnyZodObject } from "zod";
import { ZodError } from "zod";
import type { Request, Response, NextFunction } from "express";

// Extend Express Request interface
import "express";

declare module "express" {
	interface Request {
		validatedQuery?: unknown;
	}
}

export const validateQuery =
	(schema: AnyZodObject) =>
	(req: Request, res: Response, next: NextFunction) => {
		try {
			req.validatedQuery = schema.parse(req.query);
			next();
		} catch (err) {
			if (err instanceof ZodError) {
				res.status(400).json({
					message: "Validation failed",
					errors: err.errors,
				});
			} else {
				res.status(500).json({
					message: "Internal server error",
				});
			}
		}
	};

export default validateQuery;
