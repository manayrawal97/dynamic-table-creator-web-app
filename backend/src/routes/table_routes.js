const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth_middleware");
const {
  createTable,
  getTables,
  getTableById,
  updateTable,
  deleteTable,exportTable
} = require("../controller/table_controller");

router.post("/", auth, createTable);
router.get("/", auth, getTables);
router.get("/:id", auth, getTableById);
router.put("/:id", auth, updateTable);
router.delete("/:id", auth, deleteTable);
router.get("/:id/export", auth, exportTable);


module.exports = router;
