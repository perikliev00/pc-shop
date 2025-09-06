const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Expect token in headers: Authorization: Bearer <token>
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token.' });
  }

  if (!decodedToken) {
    return res.status(401).json({ message: 'Not authenticated.' });
  }

  // Attach user data to req
  req.user = {
    userId: decodedToken.userId,
    role: decodedToken.role,
  };

  next();
};