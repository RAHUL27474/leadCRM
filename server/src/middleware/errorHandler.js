export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation failed",
      errors: Object.fromEntries(
        Object.entries(error.errors).map(([field, issue]) => [
          field,
          issue.message
        ])
      )
    });
  }

  if (error.name === "CastError") {
    return res.status(400).json({ message: "Invalid resource identifier" });
  }

  console.error(error);
  return res.status(500).json({ message: "Internal server error" });
}
