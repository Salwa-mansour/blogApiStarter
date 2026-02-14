const express = require('express');
const categoryRouter = express.Router();
const categoryController = require('../controllers/categoryController');
const auth = require('../middleware/authMiddleware');
const ROLES_LIST = require('../config/roles_list.js');
const verifyRoles = require('../middleware/verifyRoles');

categoryRouter.post('/create', auth, verifyRoles(ROLES_LIST.ADMIN, ROLES_LIST.EDITOR), categoryController.createCategory);
categoryRouter.post("/allCategories",auth,categoryController.getCategories)
module.exports = categoryRouter;
