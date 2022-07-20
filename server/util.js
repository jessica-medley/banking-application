const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  async checkAccessTokenMiddleware(req, res, next) {
    try {
      const token = req.header('x-auth-token');
      if (!token) {
        res.send({
          error: 'Error: Token not found',
          code: 0,
        });
        res.end()
      } else {
        const clientUser = await jwt.verify(
          token,
          process.env.ACCESS_TOKEN_SECRET
        );
        req.clientUser = clientUser;
        next();
      }
    } catch (error) {
      console.error(error);
      res.send({
        error: 'Error: Invalid token',
        code: 0,
      });
    }
  },
  async verifyToken(token, secret) {
    const data = await jwt.verify(token, secret);
    return data;
  },
  async generateTokens(payload) {
    const accessToken = await jwt.sign(
      payload,
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: '10m',
      }
    );

    const refreshToken = await jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: '20m',
      }
    );
    return {
      accessToken,
      refreshToken,
    };
  },
  error(res, msg) {
    const ERROR_MSG = msg;
    console.log(ERROR_MSG);
    res.send({
      error: ERROR_MSG,
    });
  },
};
