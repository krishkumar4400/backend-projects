import bcrypt from "bcryptjs";
import { User } from "../Model/User";

// Login Controller
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.json({
        message: "Email and Password are required",
        success: false,
      });
    }

    let user = await User.findOne({email});
    if(!user) {
        return res.json({
            message: "Incorrect email or password",
            success: false 
        });
    }

    const validPassword = await bcrypt.compare(password,user.password);

    if(!validPassword) {
        return res.json({
            message: "Incorrect Email or Password",
            success: false 
        });
    }

    const token = await jwt.sign({id: user._id}, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const sendLoginNotification = (email) => {
        try {
            const mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: user.email,
                subject: 'Login Notification',
                text: `Someone just logged in with this account ${user.email}`
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    res.json({
        message: `Welcome back ${user.name}`,
        success: true
    });

  } catch (error) {
    return res.json({
      message: error.message,
      success: false,
    });
  }
};

export const register = async (req, res) => {};
