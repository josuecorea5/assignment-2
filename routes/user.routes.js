const { Router } = require("express");
const { check } = require("express-validator");

const {
  validateFields,
  validateJWT,
  isAdminRole,
  hasRole,
} = require("../middleware");

const {
  isAValidRole,
  emailExist,
  userByIdExist,
} = require("../helpers/db-validators");

const {
  usersGet,
  userPost,
  userPut,
  userDelete,
} = require("../controllers/user.controller");

const router = Router();

router.get("/", usersGet);

router.post(
  "/",
  check("name", "name is mandatory").not().isEmpty(),
  check("password", "password should have at least 7 charactes").isLength({
    min: 6,
  }),
  check("email", "email is not valid").isEmail(),
  check("email").custom(emailExist),
  check("role", "is not a valid role").isIn(["ADMIN_ROLE", "USER_ROLE"]),
  // check("role").custom((role) => isAValidRole(role)),
  // check("role").custom(isAValidRole),
  validateFields,
  userPost
);

router.put(
  "/:id",
  [
    check("id", "is not a valid mongo ID").isMongoId(),
    check("id").custom(userByIdExist),
    validateFields,
  ],
  userPut
);

router.delete(
  "/:id",
  [
    validateJWT,
    hasRole("ADMIN_ROLE", "SALES_ROLE", "USER_ROLE"),
    check("id", "is not a valid mongo ID").isMongoId(),
    check("id").custom(userByIdExist),
    validateFields,
  ],
  userDelete
);

module.exports = router;
