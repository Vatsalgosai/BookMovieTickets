import User from "../models/User.js";
import userService from "../services/userService.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import dotenv from "dotenv";
import constant from "../util/constant.js";

dotenv.config();

const createUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json("Validation Failed");
  }
  let role = constant.USER;
  const userCount = await userService.getUserCount();
  if (userCount == 0) {
    role = constant.SUPER_ADMIN;
  } else {
    const superAdmin = await userService.findSuperAdmin();
    if (!superAdmin) {
      role = constant.SUPER_ADMIN;
    }
  }
  if (req.user) {
    if (req.user.role === constant.SUPER_ADMIN) {
      role = constant.ADMIN;
    }
  }

  try {
    const { email, password, name, contact } = req.body;
    const hashPassword = await bcrypt.hash(password.trim(), 12);
    const user = new User({
      email: email,
      password: hashPassword,
      name: name,
      contact: contact,
      role: role,
    });
    const userData = await userService.findUser(email);

    if (userData) {
      const err = new Error("User is Already Exist");
      err.statusCode = 401;
      throw err;
    }

    const savedUser = userService.createUser(user);
    res.status(201).json({
      message: "User is Register",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const logIn = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json("Validation Failed");
  }
  try {
    const user = await userService.findUser(email);
    if (!user) {
      const err = new Error("A user with this email is not found");
      err.statusCode = 401;
      throw err;
    }
    if (user.status === 0) {
      const err = new Error("This user is deactivate by admin");
      err.statusCode = 401;
      throw err;
    }
    const isEqual = await bcrypt.compare(password, user.password.trim());

    if (!isEqual) {
      const err = new Error("Wrong Password");
      err.statusCode = 401;
      throw err;
    }
    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
      },
      process.env.SECRETE_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      token: token,
      userId: user._id.toString(),
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  const userId = req.params.id;
  const user = await userService.findUserById(userId);
  const { email, password, name, contact } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json("Validation Failed");
  }
  if (!user) {
    const err = new Error("User is not found");
    err.statusCode = 401;
    throw err;
  }
  if (user.role !== constant.ADMIN) {
    return res
      .status(401)
      .json({ message: "Super Admin can not  update user" });
  }
  try {
    const hashPassword = await bcrypt.hash(password, 12);
    user.email = email;
    user.password = hashPassword;
    user.name = name;
    user.contact = contact;
    user.role = constant.ADMIN;
    user.status = 1;

    const userData = await userService.createUser(user);
    res.status(202).json({
      message: "user Updated Successfully",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const getUsers = async (req, res, next) => {
  const users = await userService.getAllUsers();
  if (!users) {
    const err = new Error("Users not found");
    err.statusCode = 401;
    throw err;
  }
  res.status(200).json({
    users: users,
  });
};

const deleteUser = async (req, res, next) => {
  const userId = req.params.id;
  const user = await userService.findUserById(userId);
  if (!user) {
    const err = new Error("Users not found");
    err.statusCode = 401;
    throw err;
  }
  user.email = user.email;
  user.password = user.password;
  user.name = user.name;
  user.contact = user.contact;
  user.role = user.role;
  user.status = 0;
  await userService.createUser(user);
  res.status(204).json({
    message: "User deactivate",
  });
};

export default { createUser, logIn, updateUser, getUsers, deleteUser };
