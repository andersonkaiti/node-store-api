'use strict';

const express = require("express");
const router = express.Router();
const controller = require("../controllers/product-controller");
const authService = require("../services/auth-service");

router.get("/", controller.get);
router.get("/:slug", controller.getBySlug);
router.get("/admin/:id", controller.getById);
router.get("/tags/:tag", controller.getByTag);
router.post("/", authService.isAdm, controller.post);
router.put("/:id", authService.isAdm, controller.put);
router.delete("/", authService.isAdm, controller.delete);

module.exports = router;