const path = require("path");
const { v4: uuidv4 } = require("uuid");

const fileUpload = (
  files,
  valideExtensions = ["png", "jpg", "jpeg", "gif"],
  folder = ""
) => {
  return new Promise((resolve, reject) => {
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    const { file } = files;

    const cutedFileName = file.name.split(".");
    const extension = cutedFileName[cutedFileName.length - 1];

    const allowedExtentions = valideExtensions;
    if (!allowedExtentions.includes(extension))
      return reject(
        `The extension ${extension}, is not allowed. Allowed extensions: ${allowedExtentions}`
      );

    const tempFileName = uuidv4() + "." + extension;

    const uploadPath = path.join(
      __dirname,
      "../uploads/",
      folder,
      tempFileName
    );

    // Use the mv() method to place the file somewhere on your server
    file.mv(uploadPath, function (err) {
      if (err) return reject(err);

      resolve(tempFileName);
    });
  });
};

module.exports = {
  fileUpload,
};
