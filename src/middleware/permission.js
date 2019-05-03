const jwt = require("jsonwebtoken");
const config = require('../config.ts');

//This cpde separate from check auth because i think is more easy to read but could be an only one function
module.exports = (...allowed) =>{
  const isAllowed = role => allowed.indexOf(role) > -1;
  
  // return a middleware
  return (req, response, next) => {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "Rv!&1ZlyYEz#KX10&e!YlPc943%^KYfctn1t3!gPGLLpy#dUaJ!5Od#zRgqfPw7#%");
    req.userData = { email: decodedToken.email, userId: decodedToken.userId, role: decodedToken.role };
    if (req.userData && isAllowed(req.userData.role))
      next();
    else {
      response.status(403).json({message: "Forbidden"}); // user is forbidden
    }
  }
}