import express from 'express';
import passport from 'passport';
import {
  SUDO_REGISTER,
  regularRegister,
  resetPasswordRequest,
  resetUserPass,
  verifyResetToken,
} from '../controllers/auth.controller';
import { LoggedInUserProfile } from '../controllers/user.controller';
import {
  SUDOMiddleware,
  registerMiddleware,
  rememberMe,
  resetPassRequestMiddleWare,
  resetPasswordMiddleware,
} from '../middlewares/auth.middlewares';
import {
  SUDOOptionalUserAccessLevel,
  registrationValidation,
  resetPassRequestValidation,
  resetPasswordValidation,
} from '../middlewares/validators/validators';

const router = express.Router();

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).json({
      message: "I'm a teapot",
      error: 'You must be logged in to access this page',
    });
  }
}
/**
 * @swagger
 * /account/sudoregister:
 *   post:
 *     summary: admin only access for creating new users where that user can be an admin or any other regular user
 *     tags: [Authentication]
 *     description:
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: The user was successfully created
 *       400:
 *         description: Some error happened
 *       418:
 *         description: You must be logged in to access this page
 */
router.post(
  '/sudoregister',
  ensureAuthenticated,
  registrationValidation,
  SUDOOptionalUserAccessLevel,
  SUDOMiddleware,
  SUDO_REGISTER,
);

/**
 * @swagger
 * /api/v1/account/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, redirecting to profile page
 *       400:
 *         description: Login failed, redirecting to error page
 */
router.post(
  '/login',
  rememberMe,
  passport.authenticate('local'),
  (req, res) => {
    LoggedInUserProfile(req, res);
  },
);

/**
 * @swagger
 * /api/v1/account/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: The user was successfully created
 *       400:
 *         description: Some error happened
 */
router.post(
  '/register',
  registrationValidation,
  registerMiddleware,
  regularRegister,
);

/**
 * @swagger
 * /api/v1/account/logout:
 *   get:
 *     summary: Log out a user
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Logout successful, redirecting to logout success page
 */
router.get('/logout', function (req, res) {
  console.log('logging out');
  req.logout(() => null);
  res.status(200).send({
    message: 'You have been logged out',
  });
});

/**
 * @swagger
 * /api/v1/account/resetPasswordRequest:
 *   post:
 *     summary: Request a password reset
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset request successful
 *       400:
 *         description: Some error happened
 */
router.post(
  '/resetPasswordRequest',
  resetPassRequestValidation,
  resetPassRequestMiddleWare,
  resetPasswordRequest,
);

/**
 * @swagger
 * /api/v1/account/verifyResetToken/{resetToken}:
 *   get:
 *     summary: Verify a password reset token
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: resetToken
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Token verified
 *       400:
 *         description: Invalid token
 */
router.get('/verifyResetToken/:resetToken', verifyResetToken);

/**
 * @swagger
 * /api/v1/account/resetPassword:
 *   post:
 *     summary: Reset a user's password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Some error happened
 */
router.post(
  '/resetPassword',
  resetPasswordValidation,
  resetPasswordMiddleware,
  resetUserPass,
);

export default router;
