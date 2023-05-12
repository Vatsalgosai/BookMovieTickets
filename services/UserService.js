import User from "../models/User.js";

const getUserCount = async (getUserCount) => {
  try {
    const count = await User.countDocuments({});
    return count;
  } catch (err) {
    throw err;
  }
};

const findSuperAdmin = async (findSuperAdmin) => {
  try {
    const superAdmin = await User.findOne({ role: "super-admin" });
    return superAdmin;
  } catch (err) {
    throw err;
  }
};

const createUser = async (userData) => {
  try {
    const savedUser = await userData.save();
    return savedUser;
  } catch (error) {
    throw new Error(error.message);
  }
};

const findUser = async (email) => {
  try {
    const user = await User.findOne({ email: email });
    return user;
  } catch (error) {
    throw new Error(error);
  }
};

const findUserById = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user;
  } catch (err) {
    throw new Error(err);
  }
};

const getAllUsers = async () => {
  try {
    const users = await User.find();
    return users;
  } catch (err) {
    throw new Error(err);
  }
};

export default {
  getUserCount,
  findSuperAdmin,
  createUser,
  findUser,
  findUserById,
  getAllUsers,
};
