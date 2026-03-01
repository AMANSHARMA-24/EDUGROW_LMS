import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../config/token.js";

import validator from "validator";
import Sendmail from "../config/gmail.js";
import uploadOnCloud from "../config/cloudinary.js";

export const signUp = async (req, resp) => {
  try {


    const { name, email, password, role } = req.body;
    let e = await User.findOne({ email });
    if (!validator.isEmail(email)) {
      return resp.status(400).json({ message: "Enter Valid Email" });
    }
    if (e) {
      return resp.status(400).json({ message: "User already exist" })
    }
    if (password.length < 6) {
      return resp.status(400).json({ message: "password must be of 6 character" })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const newuser = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    })

    const token = await generateToken(newuser._id);
    resp.cookie("token", token, {
      httpOnly: true,
      secure: false,          // localhost
      sameSite: "lax",        // 🔥 strict ❌
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000
    })
    return resp.status(201).json(newuser)

  } catch (error) {
    return resp.status(500).json(`sign up error ${error}`)
  }
}

export const signIn = async (req, resp) => {
  try {
    const { email, password } = req.body;
    const e = await User.findOne({ email });
    if (!e) {
      return resp.status(400).json({ message: "User does not exist" })
    }
    const ismatch = await bcrypt.compare(password, e.password)
    if (!ismatch) {
      return resp.status(400).json({ message: "incorrect password" })
    }

    const token = await generateToken(e._id);
    resp.cookie("token", token, {
      httpOnly: true,
      secure: false,          // localhost
      sameSite: "lax",        // 🔥 strict ❌
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000
    })
    return resp.status(200).json(e)

  } catch (error) {
    return resp.status(500).json(`sign in error ${error}`)
  }
}

export const signOut = async (req, resp) => {
  try {
    await resp.clearCookie("token")
    return resp.status(200).json({ message: "log out successfully" })
  } catch (error) {
    return resp.status(500).json(`sign out error ${error}`)
  }
}

export const sendOtp = async (req, resp) => {
  try {
    const { email } = req.body;
    console.log("mai yaha tak aa gyaa ")
    const user = await User.findOne({ email });
    if (!user) {
      return resp.status(400).json({ message: "No user exists" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpexpire = Date.now() + 5 * 60 * 1000;

    await user.save();

    await Sendmail(email, otp);

    return resp.status(200).json({
      message: "OTP sent successfully",
      success: true,
    });
  } catch (error) {
    console.error("SEND OTP ERROR:", error);
    return resp.status(500).json({ message: "OTP sending error" });
  }
};
export const verifyOtp = async (req, resp) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return resp.status(400).json({ success: false, message: "User not found" });
    }

    if (otp !== user.otp) {
      return resp.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (user.otpexpire < Date.now()) {
      return resp.status(400).json({ success: false, message: "OTP expired" });
    }

    // OTP is correct and not expired
    user.otp = undefined;
    user.otpexpire = undefined;
    await user.save();

    return resp.status(200).json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    return resp.status(500).json({ success: false, message: "OTP not verified" });
  }
};



export const changePassword = async (req, resp) => {
  try {
    const { email, newpassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return resp.status(400).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newpassword, 10);

    user.password = hashedPassword;
    user.otp = undefined;
    user.otpexpire = undefined;

    await user.save();

    return resp.status(200).json({
  success: true,
  message: "Password reset successfully"
});
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    return resp.status(500).json({ message: "Password not reset" });
  }
};


export const googleAuth = async (req, resp) => {
  try {
    const { name, email, role } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      // User exists → Sign In
      const token = await generateToken(user._id);
      resp.cookie("token", token, {
        httpOnly: true,
        secure: false, // localhost
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
      return resp.status(200).json({ user, token, message: "Signed in successfully" });
    }

    // User does not exist → Sign Up
    const newUser = await User.create({ name, email, role });

    const token = await generateToken(newUser._id);
    resp.cookie("token", token, {
      httpOnly: true,
      secure: false, // localhost
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return resp.status(201).json({ user: newUser, token, message: "Signed up successfully" });

  } catch (error) {
    console.error("Google Auth error:", error);
    return resp.status(500).json({ message: `Google Auth error: ${error}` });
  }
};

