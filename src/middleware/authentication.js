 const jwt= require("jsonwebtoken")
const authentication = async function(req, res, next) {
    try {
      let token = req.headers["x-api-key"];
  
      if (!token) return res.status(400).send({ status: false, message: "Token must be present" });
  
      jwt.verify(token, "secreteKey", function(error, decodedToken) {
        if (error) {
          console.error("Token verification error:", error);
          return res.status(401).send({ status: false, message: "Unauthorized access" });
        }
  
        req.decode = decodedToken.userId;
        next();
      });
    } catch (error) {
      console.error("Authentication middleware error:", error);
      return res.status(500).send({ status: false, message: error.message });
    }
  };
  
  module.exports = { authentication };
  