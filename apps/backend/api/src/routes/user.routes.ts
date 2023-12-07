import connectEnsureLogin from 'connect-ensure-login';
import express from 'express';
import { userProfile } from '../controllers/user.controller';

const router = express.Router();

/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns the user's profile
 *       401:
 *         description: Unauthorized, user needs to log in
 */
router.get(
  '/profile',
  connectEnsureLogin.ensureLoggedIn('/loginerror'),
  userProfile,
);

export default router;
