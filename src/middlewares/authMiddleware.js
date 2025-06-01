const jwt = require('jsonwebtoken');
const response = require('../tools/response');
const { token } = require('morgan');

const secretKey = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  console.log("ini tokemmmm",token);

  if (!token) {
    return response(req, res, {
      status: 401,
      message: 'Unauthorized - Token not provided'
    });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return response(req, res, {
        status: 401,
        message: 'Unauthorized - Invalid token'
      });
    }

    req.user = decoded;
    next();
  });
};


function checkAccess(allowedAccess = []) {
  return (req, res, next) => {
    
    user = req.user;
    // const userAccessArray = req.user;
    console.log("ini user access array",user);
      // const userAccessArray = req.user.id_access.split(',').map(Number);
      // const hasAccess = userAccessArray.some(access => allowedAccess.includes(access));

      // if (!hasAccess) {
      //     return res.status(403).json({ message: 'Forbidden: You do not have access to this resource.' });
      // }

      // next();
  };
}
module.exports = {
  verifyToken,
  checkAccess
};
