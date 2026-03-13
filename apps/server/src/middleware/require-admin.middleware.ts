import type { RequestHandler } from "express";

/**
 * Guard: only allows users with role='admin' in our DB.
 * Must be used after loadOurUser() so req.ourUser is set.
 */
export const requireAdmin: RequestHandler = (req, res, next) => {
  if (req.ourUser?.role !== "admin") {
    res.status(403).json({ error: "Admin access required" });
    return;
  }
  next();
};
