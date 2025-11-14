import { config } from '../config/index.js';
import { verifyToken } from '../helpers/jwt.js';
import { ApiError } from '../helpers/errorMessage.js';
import  db from '../database/knex.js';

export const authGuard = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new ApiError(401, `UNAUTHORIZED, PLEASE REGISTER FIRST!`));
    }

    let token = authHeader.split(' ')[1];
    if (token.startsWith('"') && token.endsWith('"')) {
      token = token.substring(1, token.length - 1);
    }

    let validToken;
    try {
      validToken = verifyToken(token, config.jwt.accessSecret);
    } catch (err) {
      return next(new ApiError(401, `INVALID OR EXPIRED TOKEN! ${err.message}`));
    }

    let user;
    switch (validToken.role) {
      case 'user':
        user = await db('users').where({ id: validToken.id, role: 'user' }).first();
        break;
      case 'librarian':
        user = await db('users').where({ id: validToken.id, role: 'librarian' }).first();
        break;
      case 'admin':
        user = await db('users').where({ id: validToken.id, role: 'admin' }).first();
        break;
      default:
        return next(new ApiError(403, 'ROLE NOT RECOGNIZED!'));
    }

    if (!user) {
      return next(new ApiError(404, `User not found for the given role and token.`));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(error);
  }
};
