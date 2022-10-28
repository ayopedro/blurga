const User = require("../models/User");
const bcrypt = require("bcrypt");

const createUser = async (req, res) => {
  const { firstname, lastname, email, password, role } = req.body;

  if (!firstname || !lastname || !email || !password)
    return res
      .status(400)
      .json({ message: "please provide the requested resources" });

  const duplicate = await User.findOne({ email }).exec();

  if (duplicate) return res.sendStatus(409);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      first_name: firstname,
      last_name: lastname,
      email,
      password: hashedPassword,
      roles: role
    });
    
    console.log(newUser);

    res
      .status(201)
      .json({ message: `New user with email address ${email} created` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createUser };
