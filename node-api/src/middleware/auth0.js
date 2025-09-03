import { expressjwt as jwt } from 'express-jwt';
import jwks from 'jwks-rsa';
import dotenv from 'dotenv';

dotenv.config();

const domain = process.env.AUTH0_DOMAIN;
const audience = process.env.AUTH0_AUDIENCE;

console.log('Auth0 Middleware Config:', {
  domain,
  audience,
  jwksUri: `https://${domain}/.well-known/jwks.json`
});

export const checkJwt = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${domain}/.well-known/jwks.json`
  }),
  audience: audience,
  issuer: `https://${domain}/`,
  algorithms: ['RS256']
});

// Add error handling middleware to catch JWT errors
export const handleJwtError = (err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    console.error('JWT Validation Error:', err);
    return res.status(401).json({ 
      message: 'Invalid token',
      error: err.message,
      code: err.code
    });
  }
  next(err);
};


