import type { AnyZodObject } from "zod";
import { ZodError } from "zod";
import type { Request, Response, NextFunction } from "express";

// Extend Express Request interface using module augmentation
import "express";

declare module "express-serve-static-core" {
	interface Request {
		validatedData?: unknown;
	}
}

const validateRequest =
	(schema: AnyZodObject) =>
	(req: Request, res: Response, next: NextFunction) => {
		try {
			req.validatedData = schema.parse(req.body);
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

export default validateRequest;
