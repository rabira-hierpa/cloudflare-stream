import roleTypes from '../models/User/type/role-types';
import UserType from '../models/User/type/user-types';

async function isPopulated(): Promise<boolean> {
  const userTypes = await UserType.find();
  if (userTypes.length === 0) return false;
  return true;
}

export async function seedDB(): Promise<void> {
  const populated = await isPopulated();
  if (populated) {
    console.info('DB already seeded');
    return;
  }
  for (let type in roleTypes) {
    const newType = new UserType({ accessRights: type });
    await newType.save();
    console.info('Seeding DB with role types completed!');
  }
}
