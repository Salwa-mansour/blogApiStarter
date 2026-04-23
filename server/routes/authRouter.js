const express = require('express');
const authRouter = express.Router();

const authController = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');
const ROLES_LIST = require('../config/roles_list.JS');
const verifyRoles = require('../middleware/verifyRoles');

authRouter.post('/login', authController.loginPost);
authRouter.post('/signup', authController.signupAccount);
authRouter.post('/logout', authController.logout);

authRouter.get('/users', auth, verifyRoles(ROLES_LIST.ADMIN), authController.getAllUsers);
// POST or PATCH both work, but PATCH is semantically better for partial updates
authRouter.patch('/update-roles', 
    auth, 
    verifyRoles(ROLES_LIST.ADMIN), 
    authController.updateUserRoles
);
// Token refresh endpoint 
authRouter.get('/refresh', authController.refreshToken);

module.exports = authRouter;