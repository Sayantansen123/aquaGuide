import fs from "fs";
import path from "path";
import winston from "winston";

const LOG_DIR =
  process.env.LOG_DIR || path.join(process.cwd(), "instance");

try {
  fs.mkdirSync(LOG_DIR, { recursive: true });
} catch (e) {
  // fallback to console only
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(
      ({ timestamp, level, message }) =>
        `${timestamp} - ${level.toUpperCase()} - ${message}`
    )
  ),
  transports: [],
});

// File logging (safe)
try {
  logger.add(
    new winston.transports.File({
      filename: path.join(LOG_DIR, "server.log"),
      maxsize: 1_000_000,
      maxFiles: 3,
    })
  );
} catch (e) {
  // ignore file errors
}

// Console logging (always)
logger.add(new winston.transports.Console());

export default logger;
