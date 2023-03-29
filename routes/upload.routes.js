const { Router } = require("express");
const { check } = require("express-validator");
const {
  loadFile,
  updateImage,
  showImage,
} = require("../controllers/upload.controller");
const { allowedCollections } = require("../helpers");
const { validateFields, validateFileUpload } = require("../middleware");
const router = Router();

router.post("/", [validateFileUpload], loadFile);
router.put(
  "/:collection/:id",
  [
    validateFileUpload,
    check("id", "this should be a mongo ID").isMongoId(),
    check("collection").custom((c) =>
      allowedCollections(c, ["users", "products"])
    ),
    validateFields,
  ],
  updateImage
);

router.get(
  "/:collection/:id",
  [
    check("id", "this should be a mongo ID").isMongoId(),
    check("collection").custom((c) =>
      allowedCollections(c, ["users", "products"])
    ),
    validateFields,
  ],
  showImage
);

module.exports = router;
