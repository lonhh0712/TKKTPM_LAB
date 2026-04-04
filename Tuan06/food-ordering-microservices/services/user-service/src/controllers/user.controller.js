const authService = require("../services/auth.service");

async function register(req, res, next) {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res
        .status(400)
        .json({ message: "fullName, email, password are required" });
    }

    const user = await authService.register(fullName, email, password);
    return res.status(201).json(user);
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email and password are required" });
    }

    const result = await authService.login(email, password);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
}

async function getUser(req, res, next) {
  try {
    const user = await authService.getUserById(req.params.id);
    return res.json(user);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  register,
  login,
  getUser,
};
