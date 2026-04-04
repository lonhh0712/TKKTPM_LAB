const userModel = require("../models/user.model");

async function getMyProfile(userId) {
  const user = await userModel.findById(userId);
  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }
  return user;
}

module.exports = {
  getMyProfile,
};
