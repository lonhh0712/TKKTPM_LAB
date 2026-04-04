const bcrypt = require("bcryptjs");
const userModel = require("../models/user.model");
const { signAccessToken } = require("../utils/jwt");

async function register(payload) {
  const existing = await userModel.findByEmail(payload.email);
  if (existing) {
    const err = new Error("Email already exists");
    err.statusCode = 409;
    throw err;
  }

  const passwordHash = await bcrypt.hash(payload.password, 10);
  const user = await userModel.createUser({
    fullName: payload.fullName,
    email: payload.email,
    passwordHash,
  });

  const token = signAccessToken({ userId: user.id, email: user.email });

  return { user, token };
}

async function login(payload) {
  const user = await userModel.findByEmail(payload.email);
  if (!user) {
    const err = new Error("Invalid credentials");
    err.statusCode = 401;
    throw err;
  }

  const matched = await bcrypt.compare(payload.password, user.password_hash);
  if (!matched) {
    const err = new Error("Invalid credentials");
    err.statusCode = 401;
    throw err;
  }

  const token = signAccessToken({ userId: user.id, email: user.email });

  return {
    user: {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      created_at: user.created_at,
    },
    token,
  };
}

module.exports = {
  register,
  login,
};
