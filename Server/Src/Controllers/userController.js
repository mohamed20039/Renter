const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const Prisma = require("../Config/Prisma");
const bcrypt = require("bcryptjs");

// @description Register new user
// @Method POST
// @Route /user/
// @Access Public
const register = asyncHandler(async (req, res) => {
  // Fetch the necessary data from the request
  const { firstName, lastName, username, email, password } = req.body;
  const image = req.file;
  const { role } = req.query;

  // Check if the email, password, or username are provided
  if (
    !firstName &&
    !lastName &&
    !username &&
    !email &&
    !password &&
    !role &&
    !image
  ) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  // Check if user role is valid
  const lowercaseRole = role.toLowerCase();
  if (lowercaseRole !== "renter" && lowercaseRole !== "owner") {
    res.status(400);
    throw new Error("Invalid role: " + lowercaseRole);
  }

  // Check if the user already exists
  const user = await Prisma.user.findUnique({
    where: {
      email,
    },
  });

  // If user already exists return an error message
  if (user) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Use the default image URL from the schema
  const userImage = image
    ? image.path
    : "https://img.freepik.com/free-photo/user-profile-front-side_187299-39595.jpg?w=740&t=st=1705394157~exp=1705394757~hmac=698b5c4b763dcf4e72007c7778a11ea7282cba512333dddfb9d887f7159cc955";

  // Create the user
  const newUser = await Prisma.user.create({
    data: {
      firstName,
      lastName,
      username,
      email,
      role: lowercaseRole,
      password: hashedPassword,
      image: userImage,
    },
    include: {
      rentedProperties: lowercaseRole === "renter",
      ownedProperties: lowercaseRole === "owner",
    },
  });

  // Return the response with success and newly created user
  res.status(201).json({
    success: true,
    data: newUser,
    token: generateToken(newUser.id, newUser.email),
  });
});

// @description Login
// @Method POST
// @Route /user/login
// @Access Public
const login = asyncHandler(async (req, res) => {
  // Fetch the necessary data from the request
  const { email, password } = req.body;

  //Check if the email or password or username are provided
  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  //Check if the user exists
  var user = await Prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (user && user.role === "owner") {
    user = await Prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        ownedProperties: true,
      },
    });
  } else {
    user = await Prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        rentedProperties: true,
      },
    });
  }

  // If user does not exist return a error message
  if (!user) {
    res.status(400);
    throw new Error("User does not exist");
  }

  // Check if the password is correct
  const isMatch = await bcrypt.compare(password, user.password);

  // If password is incorrect return a error message
  if (!isMatch) {
    res.status(400);
    throw new Error("Invalid password");
  }

  // Return the response with success and newly created user
  res.status(200).json({
    success: true,
    message: "User logged in successfully",
    data: user,
    token: generateToken(user.id, user.email),
  });
});

// @description Get User Profile
// @Method GET
// @Route /user/profile
// @Access Private
const getUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  //Check if the user exits based on the provided Id
  var user = await Prisma.user.findUnique({
    where: { id: userId },
  });

  if (user && user.role === "owner") {
    user = await Prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        ownedProperties: true,
      },
    });
  } else {
    user = await Prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        rentedProperties: true,
      },
    });
  }

  //Return user profile with success message
  res.status(200).json({
    success: true,
    message: "You are authorized to check user profile",
    data: user,
  });
});

// @description Get User Profile
// @Method PUT
// @Route /user/updateUser/:id
// @Access Private
const updateUser = asyncHandler(async (req, res) => {
  const { userId } = req.query;
  const id = req.user.id;
  const { firstName, lastName, username, email, password } = req.body;
  const image = req.file;
  const { role } = req.query;

  //Check if the userId which got fetched from the params and id fetched from user token matches
  if (userId != id) {
    res.status(401);
    throw new Error("You aren't allowed to update this user");
  }

  // Fetch user from database
  const user = Prisma.user.findUnique({
    where: { id },
  });

  //If user doesn't exist
  if (!user) {
    res.status(404);
    throw new Error("User doesn't exist");
  }

  // Use the default image URL from the schema
  const userImage = image
    ? image.path
    : "https://img.freepik.com/free-photo/user-profile-front-side_187299-39595.jpg?w=740&t=st=1705394157~exp=1705394757~hmac=698b5c4b763dcf4e72007c7778a11ea7282cba512333dddfb9d887f7159cc955";

  const updatedUser = await Prisma.user.update({
    where: {
      id,
    },
    data: {
      firstName,
      lastName,
      username,
      email,
      password,
      role,
      image: userImage,
    },
  });

  res.status(201).json({
    success: true,
    message: "User updated successfully",
    data: updateUser,
  });
});

const allUsers = asyncHandler(async (req, res) => {
  const user = await Prisma.user.findMany({});
  res.send({ users: user });
});

const generateToken = (id, email) => {
  const payload = { id, email };
  const secret = process.env.JWT_SECRET;
  return jwt.sign(payload, secret, {
    expiresIn: "1d",
  });
};

module.exports = {
  register,
  login,
  getUserProfile,
  updateUser,
  allUsers,
};
