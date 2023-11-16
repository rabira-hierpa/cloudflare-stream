import { Document, model, Schema } from 'mongoose';
import roleTypes from './role-types';

export interface IUserType extends Document {
  accessRights: string;
}
const UserTypeSchema: Schema = new Schema({
  accessRights: {
    type: String,
    required: true,
    default: roleTypes.user,
  },
});

const UserType = model<IUserType>('UserType', UserTypeSchema);

export default UserType;
