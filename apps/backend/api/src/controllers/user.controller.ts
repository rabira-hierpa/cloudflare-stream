import { Request, Response } from 'express';
import { IUser } from '../models/User/user-schema';
import convertAccess from '../utils/helpers/convertAcces';

/**
 * Retrieves the user profile information and sends it as a response.
 * @param req - The request object.
 * @param res - The response object.
 * @returns A Promise that resolves to void
 */
export async function userProfile(req: Request, res: Response): Promise<void> {
  const user = req.user as IUser;
  //get id from req.sessionID
  res.status(200).send({
    verified: true,
    message: 'welcome to your profile',
    user: user,
    session: req.sessionID,
    access: await convertAccess(user.userAccess),
  });
}

export async function LoggedInUserProfile(
  req: Request,
  res: Response,
): Promise<void> {
  const user: any = req.user;
  const { salt, hash, ...userInfo } = user._doc;
  res.status(200).send({
    user: {
      ...userInfo,
      session: req.sessionID,
      access: await convertAccess(userInfo.userAccess),
    },
  });
}
