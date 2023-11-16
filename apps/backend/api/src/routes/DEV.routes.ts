import express from 'express';
import roleTypes from '../models/User/type/role-types';
import UserType from '../models/User/type/user-types';

const router = express.Router();

router.get('/dev/types', (req, res) => {
  console.log(req.body);
  res.send(roleTypes);
});

router.get('/dev/type', async (req, res) => {
  console.log(req.body);
  let defaultAccessLevel = await UserType.findOne({
    accessRights: roleTypes.user,
  });
  console.log(defaultAccessLevel);
  res.send(defaultAccessLevel);
});

export default router;
