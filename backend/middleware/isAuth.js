import jwt from "jsonwebtoken";
const isAuth = async(req, res, next) => {
  // Get token from cookie or Authorization header
  let {token} = req.cookies; 
console.log("TOKEN FROM COOKIE:", req.cookies.token);

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Synchronous verification
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decodedToken.userId; // ✅ use the correct key from JWT
 // attach userId to request
    next(); // pass control to next middleware / route
  } catch (error) {
    console.error("JWT ERROR:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default isAuth;