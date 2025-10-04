const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { generateRandomPassword, sendPasswordEmail } = require("../utils/email");
const createUser = async (req, res) => {
  try {
    const { name, email, role, managerId, password } = req.body;

    // check if already exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    // ✅ 1️⃣ Decide password logic
    let plainPassword = password?.trim() || generateRandomPassword();

    // ✅ 2️⃣ Hash password
    const hashed = await bcrypt.hash(plainPassword, 10);

    // ✅ 3️⃣ Auto-approve if created by Admin
    let status = req.user.role === "Admin" ? "Approved" : "Pending";

    // ✅ 4️⃣ Create user
    const user = new User({
      name,
      email,
      role,
      manager: managerId || null,
      passwordHash: hashed,
      status,
      company: req.user.company
    });
    await user.save();

    // ✅ 5️⃣ Email credentials
    await sendPasswordEmail(email, name, plainPassword);

    res.json({
      message: `User created successfully. Password sent to ${email}`,
      user
    });
  } catch (err) {
    console.error("Create user error:", err);
    res.status(500).json({ message: "Error creating user" });
  }
};
const listUsers = async (req, res) => {
  try {
    const users = await User.find({ company: req.user.company._id }).select(
      "-passwordHash"
    );
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching users" });
  }
};

const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const payload = req.body;
    delete payload.passwordHash;
    const user = await User.findByIdAndUpdate(id, payload, {
      new: true,
    }).select("-passwordHash");
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating user" });
  }
};

const resendPassword = async (req, res) => {
  try {
    const { id } = req.params; // user ID
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // generate new password
    const newPass = generateRandomPassword();
    user.passwordHash = await bcrypt.hash(newPass, 10);
    await user.save();

    // send via email
    await sendPasswordEmail(user.email, user.name, newPass);

    res.json({ message: "New password sent to user email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error resending password" });
  }
};

// ✅ Export all functions with CommonJS
module.exports = { createUser, listUsers, updateUser, resendPassword };
