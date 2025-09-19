// import jwt from "jsonwebtoken";

// const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// export const authMiddleware = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ message: "No token provided" });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     console.log(decoded);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };

//Next method and code
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

const publicRoutes = ["/auth/login", "/auth/register"];
export const authMiddleware = asyncHandler(async (req, res, next) => {
  if (publicRoutes.includes(req.path)) {
    return next();
  }

  const [type, token] = req.headers.authorization?.split(" ") || [];
  if (!token || type !== "Bearer") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;
  next();
});
