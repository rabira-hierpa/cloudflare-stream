import roleTypes from '../models/User/type/role-types';
import UserType from '../models/User/type/user-types';
import User, { IUser } from '../models/User/user-schema';
import generateAvatar from '../utils/generators/generateAvatar';

//return of the register function
interface IReturnRegister {
  user: IUser;
  error: boolean;
  message: string;
}

//return of the reset function
interface IReturnReset {
  error: boolean;
  message: string;
}

interface INewUser {
  email: string;
  password: string;
  username: string;
  accessLevels?: string[];
}

//this will be used to create a new user by the admin or a user
//we include the access levels for the function that are optional
//in our middlewares we will check if the user has the right access level if needed
export const adminRegistersUser =
  //middlewares will check for admin access level
  async ({
    email,
    password,
    username,
    accessLevels,
  }: INewUser): Promise<IReturnRegister> => {
    let newUsersAccessLevels = [];
    let firstUser = false;

    //check if the user already exists
    console.log(
      'properties provided for registration',
      email,
      password,
      username,
      accessLevels,
    );

    //check if user exists by email or username
    const user = await User.findOne({
      $or: [{ email: email }, { username: username }],
    });
    if (user) {
      return {
        message: 'User already exists',
        error: true,
        user: null,
      };
    }
    //if there are no users in the database, default first user to be admin
    const count = await User.countDocuments({});
    if (count === 0) {
      firstUser = true;
    }

    //accessLevels will be an array of strings
    //we will convert the strings to the access level object
    if (!accessLevels || accessLevels.length === 0) {
      console.log('no access levels provided defaulting to user');
      //if the accessLevels is not provided we will assign the user to the default access level
      const defaultAccessLevel = await UserType.findOne({
        accessRights: roleTypes.user,
      });
      newUsersAccessLevels.push(defaultAccessLevel._id);
    } else {
      //if the accessLevels is provided we will convert the strings to the access level object
      for (const accessRight of accessLevels) {
        console.log(accessRight + ' access right sent in');
        const accessLevel = await UserType.findOne({
          accessRights: accessRight,
        });
        console.log('access level found is ' + accessLevel);
        newUsersAccessLevels.push(accessLevel._id);
        console.log('access level pushed to array ' + newUsersAccessLevels);
      }
    }

    if (firstUser) {
      console.log('first user is being created');
      //if the user is the first user in the database, we will assign them the admin access level
      const adminAccessLevel = await UserType.findOne({
        accessRights: roleTypes.admin,
      });
      newUsersAccessLevels.push(adminAccessLevel._id);
    }

    //mongoose-local-passport will hash the password and handle it when we register the user

    //generate avatar
    let avatar = generateAvatar();

    //create a new user
    const newUser = new User({
      email,
      username,
      userAccess: newUsersAccessLevels,
      avatar,
    });
    //register the user
    const registeredUser = await User.register(newUser, password);
    const regobj = {
      email: registeredUser.email,
      username: registeredUser.username,
      userAccess: registeredUser.userAccess,
    };
    console.log('user registered', { regobj });
    if (registeredUser) {
      return {
        message: 'User registered',
        error: false,
        user: registeredUser,
      };
    } else {
      return {
        message: 'error registering user',
        error: true,
        user: null,
      };
    }
  };

export const resetPassword = async ({
  email,
  newPassword,
}: {
  email: string;
  newPassword: string;
}): Promise<IReturnReset> => {
  //reset the users password
  let userToReset = await User.findOne({ email });
  if (!userToReset) {
    return {
      message: 'user not found',
      error: true,
    };
  }
  userToReset.setPassword(newPassword, (err) => {
    if (err) {
      return {
        message: 'error resetting password',
        error: true,
      };
    }
    userToReset.save();
  });
  console.log('password reset');
  return {
    message: 'password successfully reset',
    error: false,
  };
};
