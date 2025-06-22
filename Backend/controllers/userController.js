import User from "../models/User.js";

export const getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ msg: "Only admin can view users." });
    }

    const authors = await User.find({ role: "Author" }).select("-password");
    res.json(authors);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


export const deleteUser = async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ msg: "Only admin can delete users." });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({ msg: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


export const updateUser = async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ msg: "Only admin can update users." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
