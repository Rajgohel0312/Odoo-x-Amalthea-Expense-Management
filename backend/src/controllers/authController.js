const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Company = require("../models/Company");
const { generateRandomPassword, sendPasswordEmail } = require("../utils/email");
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const newPass = generateRandomPassword();
    user.passwordHash = await bcrypt.hash(newPass, 10); // ✅ FIXED
    await user.save();

    await sendPasswordEmail(email, user.name, newPass);

    res.json({ message: "New password sent to email" });
  } catch (err) {
    console.error("forgotPassword error:", err);
    res.status(500).json({ message: "Error resetting password" });
  }
};

const signup = async (req, res) => {
  try {
    const { name, email, password, companyName, country, currency } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "name,email,password required" });

    // create company (auto-create if not provided)
    const company = new Company({
      name: companyName || `${name} Company`,
      country: country || "Unknown",
      currency: currency || "USD",
    });
    await company.save();

    const salt = await bcrypt.genSalt(10);
    const passHash = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      passwordHash: passHash,
      role: "Admin",
      status: "Approved",
      company: company._id,
    });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company,
      },
    });
  } catch (err) {
    console.error("signup err", err);
    return res
      .status(500)
      .json({ message: "Signup failed", error: err.message });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const u = await User.findOne({ email }).populate("company");
    if (!u) return res.status(400).json({ message: "Invalid credentials" });

    // ✅ Add status check
    if (u.status !== "Approved") {
      return res.status(403).json({ message: "Account not approved yet" });
    }

    const match = await bcrypt.compare(password, u.passwordHash);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: u._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        company: u.company,
      },
    });
  } catch (err) {
    console.error("login err", err);
    return res.status(500).json({ message: "Login failed" });
  }
};

module.exports = { signup, login, forgotPassword };
