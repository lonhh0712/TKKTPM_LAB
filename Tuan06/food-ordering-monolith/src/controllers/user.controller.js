const userService = require("../services/user.service");

async function me(req, res, next) {
  try {
    const user = await userService.getMyProfile(req.user.userId);
    return res.json(user);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  me,
};
