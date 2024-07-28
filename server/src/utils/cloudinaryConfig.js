const config = require("../config/config");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.cloud_api_key,
  api_secret: config.cloudinary.cloud_secret_key,
});

const uploadFile = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ resource_type: "auto" }, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      })
      .end(fileBuffer);
  });
};

module.exports = {
  uploadFile,
};
