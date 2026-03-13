import { clerkMiddleware, getAuth } from "@clerk/express";
import type { RequestHandler } from "express";
import { UserRepository } from "../repositories/user.repository.js";
import type { User } from "../repositories/user.repository.js";

// Augment Express Request so downstream handlers have typed access
declare global {
  namespace Express {
    interface Request {
      ourUser?: User;
    }
  }
}

/**
 * Global Clerk middleware — must be mounted on the Express app before all routes.
 * Verifies Clerk session tokens on every request (no-op if no token present).
 */
export const clerkGlobal = clerkMiddleware();

/**
 * Loads the full user profile from our DB using the verified Clerk user ID.
 * Must be used after Clerk's requireAuth() guard so auth().userId is always set.
 * Attaches req.ourUser for downstream controllers.
 */
export const loadOurUser: RequestHandler = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const repo = new UserRepository();
    const user = await repo.findById(userId);

    if (!user) {
      res.status(401).json({ error: "User not found — sign up first" });
      return;
    }

    req.ourUser = user;
    next();
  } catch (err) {
    next(err);
  }
};
