const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/user.repository");

const jwtSecret = process.env.JWT_SECRET || "dev_secret";

async function register(fullName, email, password) {
  const existed = await userRepository.findByEmail(email);
  if (existed) {
    const error = new Error("Email already exists");
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  return userRepository.createUser(fullName, email, passwordHash);
}

async function login(email, password) {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  const matched = await bcrypt.compare(password, user.password_hash);
  if (!matched) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign({ userId: user.id, email: user.email }, jwtSecret, {
    expiresIn: "1d",
  });

  return {
    token,
    user: {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
    },
  };
}

async function getUserById(id) {
  const user = await userRepository.findById(id);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
}

module.exports = {
  register,
  login,
  getUserById,
};
