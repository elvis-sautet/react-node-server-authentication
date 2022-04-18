const express = require("express");
const {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
} = require("../../controllers/employees");
const router = express.Router();
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middlewares/verifyRoles");

router
  .route("/")
  .get(getAllEmployees)
  .post(verifyRoles(ROLES_LIST.ADMIN, ROLES_LIST.EDITOR), createNewEmployee)
  .put(verifyRoles(ROLES_LIST.ADMIN, ROLES_LIST.EDITOR), updateEmployee)
  .delete(verifyRoles(ROLES_LIST.ADMIN), deleteEmployee);

router.route("/id").get(getEmployee);

module.exports = router;
