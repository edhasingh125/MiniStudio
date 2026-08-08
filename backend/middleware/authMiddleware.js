import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    console.log("AUTH HEADER:", req.headers.authorization);
    console.log("JWT SECRET:", process.env.JWT_SECRET);

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    console.log("TOKEN:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("DECODED:", decoded);

    req.user = {
      id: decoded.id,
    };

    next();
  } catch (error) {
    console.log("VERIFY ERROR:", error);

    return res.status(401).json({
      message: "Invalid token",
      error: error.message,
    });
  }
};

export default authMiddleware;