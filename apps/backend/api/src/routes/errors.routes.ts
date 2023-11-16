import express from 'express';

const router = express.Router();

/**
 * @swagger
 * /loginerror:
 *   get:
 *     summary: Login error page
 *     tags: [Errors]
 *     responses:
 *       418:
 *         description: You must be logged in to access this page
 */
router.get('/loginerror', (req, res) => {
  res.status(418).send({
    message: "I'm a teapot",
    error: 'You must be logged in to access this page',
  });
});

/**
 * @swagger
 * /error:
 *   get:
 *     summary: General error page
 *     tags: [Errors]
 *     responses:
 *       418:
 *         description: Returns the error message
 */
router.get('/error', (req, res) => {
  res.status(418).send({
    message: "I'm a teapot",
    error: req.flash('error'),
  });
});

/**
 * @swagger
 * /unauthorized:
 *   get:
 *     summary: Unauthorized access page
 *     tags: [Errors]
 *     responses:
 *       401:
 *         description: Unauthorized
 */
router.get('/unauthorized', (req, res) => {
  res.status(401).send({
    message: 'Unauthorized',
  });
});

/**
 * @swagger
 * /404:
 *   get:
 *     summary: 404 Not Found page
 *     tags: [Errors]
 *     responses:
 *       404:
 *         description: Not Found
 */
router.get('/404', (req, res) => {
  res.status(404).send({
    message: 'Not Found',
  });
});
export default router;
