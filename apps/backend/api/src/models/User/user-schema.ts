import { PassportLocalDocument, Schema, model } from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
import { IUserType } from './type/user-types';
/**
 * Interface to model the User Schema for TypeScript.
 * @param email: string
 * @param username: string
 * @param userAccess: ref => [ UserType._id]
 */

//passport-local-mongoose will handle the password and hashing

export interface IUser extends PassportLocalDocument {
  userAccess: IUserType['_id'];
  email: string;
  username: string;
}

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  userAccess: [
    {
      type: Schema.Types.ObjectId,
      ref: 'UserType',
      required: true,
    },
  ],
});

UserSchema.plugin(passportLocalMongoose);

const User = model<IUser>('User', UserSchema);
export default User;
