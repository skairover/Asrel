import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";


export async function register(req, res) {
  console.log("Mongo state:", mongoose.connection.readyState);
  try {
    const { name, email, password } = req.body;


    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }


    const hashedPassword = await bcrypt.hash(
      password,
      10
    );


    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });


    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );


    res.status(201).json({
      user: {
        id: user._id,
        username: user.name,
        email: user.email,
      },
      token,
    });


  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}



export async function login(req, res) {
  try {

    const { email, password } = req.body;


    const user = await User.findOne({
      email,
    });


    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }


    const match = await bcrypt.compare(
      password,
      user.password
    );


    if (!match) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }


    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );


    res.json({
      user: {
        id: user._id,
        username: user.name,
        email: user.email,
      },
      token,
    });


  } catch(error) {
    res.status(500).json({
      message:error.message
    });
  }
}