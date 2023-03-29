const path = require("path");
const fs = require("fs");
const { response } = require("express");
const { fileUpload } = require("../helpers");
const { User, Product } = require("../models");

const loadFile = async (req, res = response) => {
  try {
    const fullPath = await fileUpload(req.files, ["pdf"], "textos");
    res.json({
      fileName: fullPath,
    });
  } catch (msg) {
    res.status(400).json({
      msg,
    });
  }
};

const updateImage = async (req, res = res) => {
  const { id, collection } = req.params;

  let model;

  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model)
        return res
          .status(400)
          .json({ msg: `No user exists with the id: ${id}` });
      break;
    case "products":
      model = await Product.findById(id);
      if (!model)
        return res
          .status(400)
          .json({ msg: `No product exists with the id: ${id}` });
      break;
    default:
      return res.status(500).json({ msg: "I did not finish this part" });
  }

  if (model.image) {
    const imagePath = path.join(
      __dirname,
      "../uploads",
      collection,
      model.image
    );
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
  }

  const fileName = await fileUpload(req.files, undefined, collection);
  model.image = fileName;
  await model.save();
  res.json({
    model,
  });
};

const showImage = async (req, res = response) => {
  const { id, collection } = req.params;

  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model)
        return res
          .status(400)
          .json({ msg: `No user exists with the id: ${id}` });
      break;
    case "products":
      model = await Product.findById(id);
      if (!model)
        return res
          .status(400)
          .json({ msg: `No product exists with the id: ${id}` });
      break;
    default:
      return res.status(500).json({ msg: "I did not finish this part" });
  }

  if (model.image) {
    const imagePath = path.join(
      __dirname,
      "../uploads",
      collection,
      model.image
    );
    if (fs.existsSync(imagePath)) return res.sendFile(imagePath);
  }
  const imagePath = path.join(__dirname, "../assets/no-image.jpg");
  res.sendFile(imagePath);
};

module.exports = {
  loadFile,
  updateImage,
  showImage,
};
