const express = require("express");
const router = express.Router();
const ComponentsController = require("../controllers/pc-components");

router.get("/id/:componentID", ComponentsController.get_component_by_id);

router.get("/:componentsName", ComponentsController.get_components_by_name);

module.exports = router;
