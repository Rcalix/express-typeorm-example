const jwt = require("jsonwebtoken");
const config = require('../config.ts');

module.exports = (req, res, next) => {
  try {
    console.log(req.headers);
    const token = req.headers.authorization.split(" ")[1];
    console.log(token);
    const decodedToken = jwt.verify(token,"Rv!&1ZlyYEz#KX10&e!YlPc943%^KYfctn1t3!gPGLLpy#dUaJ!5Od#zRgqfPw7#%");
    console.log(decodedToken)
    req.userData = { email: decodedToken.email, userId: decodedToken.userId };
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Auth failed!" });
  }
};
