import jwt from 'jsonwebtoken';

const adminMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ message: 'Token saknas' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Endast admin har tillgång' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Ogiltig token' });
  }
};

export default adminMiddleware;
// This middleware checks if the user is an admin by verifying the JWT token.
// If the token is valid and the user role is 'admin', it allows the request to proceed.