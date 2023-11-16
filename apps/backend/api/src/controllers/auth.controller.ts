import { Request, Response } from 'express';
import ResetToken from '../models/ResetToken/reset-token';
import User from '../models/User/user-schema';
import { adminRegistersUser, resetPassword } from '../services/auth.service';
import { sendResetLink } from '../services/email.service';
import {
  createResetToken,
  verifyJWTToken,
} from '../services/resettoken.service';
import convertAccess from '../utils/helpers/convertAcces';

/**
 * Registers a new user with admin privileges.
 * @param req - The Express Request object.
 * @param res - The Express Response object.
 * @returns The newly registered user object.
 */
export async function SUDO_REGISTER(req: Request, res: Response) {
  const { username, password, email, accessLevels } = req.body;
  let user;
  if (!accessLevels) {
    user = await adminRegistersUser({ username, password, email });
  } else {
    user = await adminRegistersUser({
      username,
      password,
      email,
      accessLevels,
    });
  }
  res.status(200).send(user);
}

/**
 * Registers a new user with the provided username, password, and email.
 * Logins in the user if the registration is successful
 * This create a persistent session that will allow them
 * to view the protected resources until they log out.
 * @param req - The request object.
 * @param res - The response object.
 * @returns A Promise that resolves to the registered user's information if successful, or an error message if not.
 */
export async function regularRegister(req: Request, res: Response) {
  const { username, password, email } = req.body;
  console.log('received request to register user: ', username, password, email);
  const registered = await adminRegistersUser({ username, password, email });
  //login the user
  if (registered.error) {
    res.status(400).send(registered);
  } else {
    let returnUser = registered.user;

    // need to login the user as well
    req.login(returnUser, async (err) => {
      if (err) {
        res.status(400).send(err);
      } else {
        const accessConverted = await convertAccess(returnUser.userAccess);
        console.log('access converted is ' + accessConverted);
        res.status(200).send({
          message: 'User registered successfully',
          verified: true,
          user: {
            username: returnUser.username,
            email: returnUser.email,
            accessLevels: accessConverted,
          },
        });
      }
    });
  }
}

/**
 * Handles the request to reset a user's password.
 * If the request contains an email, sends a reset link to that email.
 * If the request contains a username, finds the user's email and sends a reset link to that email.
 * @param req - The request object.
 * @param res - The response object.
 */
export async function resetPasswordRequest(req: Request, res: Response) {
  const { email, username } = req.body;

  if (email) {
    //if the user supplied an email
    let resetToken = await createResetToken({ email: email });
    if (resetToken.error) {
      res.status(400).send({ message: 'Error creating reset token' });
    } else {
      //send the email link here
      sendResetLink({ email: email, tokenString: resetToken.resetToken });
      res
        .status(200)
        .send({ message: 'if the user exists, an email will be sent to them' });
    }
  } else if (username) {
    //if the user supplied a username
    const resetToken = await createResetToken({ username: username });
    //find the users email
    const user = await User.findOne({ username: username });
    const { email } = user;
    if (resetToken.error) {
      res.status(400).send(resetToken);
    } else {
      //send the email link here
      sendResetLink({ email, tokenString: resetToken.resetToken });
      res.status(200).send({
        message: 'if the user exists, an email will be sent to them',
      });
    }
  }
}

/**
 * Verifies a reset token and returns the associated user if the token is valid.
 * used by the UI to display the form or redirect if reset token is invalid
 * @param req - The request object.
 * @param res - The response object.
 * @returns A response with a status code of 200 and the associated user if the token is valid,
 * or a response with a status code of 400 and an error message if the token is invalid or expired.
 */
export async function verifyResetToken(req: Request, res: Response) {
  const { resetToken } = req.params;
  console.log('received request to verify reset token: ', resetToken);
  const verified = verifyJWTToken(resetToken);
  if (verified.error) {
    return res.status(400).send({
      error: true,
      message: 'invalid token or token expired',
    });
  }
  const verifiedResetToken = await ResetToken.findOne({
    resetToken: resetToken,
  });

  if (verifiedResetToken) {
    return res.status(200).send({
      verified: true,
      message: 'token verified',
      user: verifiedResetToken.user,
    });
  }
  return res.status(400).send({
    verified: false,
    message: 'invalid token or token expired',
    error: true,
  });
}

/**
 * Resets the password for a user.
 * middlewares will check if the token is valid
 * if all is valid, the user will be retrieved from the database
 * and attached to the request body
 * @param req - The request object.
 * @param res - The response object.
 * @returns The updated user object if successful, or an error object if unsuccessful.
 */
export async function resetUserPass(req: Request, res: Response) {
  const { password, user } = req.body;
  console.log('received request to reset password for user: ', user);
  let updated = await resetPassword({ email: user, newPassword: password });
  if (updated.error) {
    return res.status(400).send(updated);
  }
  return res.status(200).send(updated);
}
