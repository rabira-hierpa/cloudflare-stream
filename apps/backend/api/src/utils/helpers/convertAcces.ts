import UserType from '../../models/User/type/user-types';

async function convertAccess(access: string[]) {
  const stringedAccess = await Promise.all(
    access.map(async (accessId) => {
      const accessType = await UserType.findById(accessId);
      return accessType?.accessRights;
    }),
  );
  return stringedAccess.filter(Boolean);
}

export default convertAccess;
