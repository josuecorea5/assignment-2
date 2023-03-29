const dbValidators = require("./db-validators");
const generateJWT = require("./generate-jwt");
const fileUpload = require("./file-upload");

module.exports = {
  ...dbValidators,
  ...generateJWT,
  ...fileUpload,
};
