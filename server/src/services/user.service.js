const httpStatus = require("http-status");
const { User, Token, Affiliate, Referral } = require("../models");
const ApiError = require("../utils/ApiError");
const { tokenTypes } = require("../config/token");

const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  const user = await User.create(userBody);
  return user;
};

const getUserById = async (id) => {
  return User.findById(id);
};

const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

const updateUserById = async (userId, updateBody) => {
  let user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  user = await updateUser(user, updateBody);
  return user;
};

const applyRegexFilter = (filter) => {
  const regexFields = ["fullName", "userName", "email"];

  regexFields.forEach((field) => {
    if (filter[field]) {
      filter[field] = { $regex: filter[field], $options: "i" };
    }
  });

  return filter;
};

const getAllUser = async (userData, filter, options) => {
  if (userData.role === "user") {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "You do not have permission to do this"
    );
  }

  filter = applyRegexFilter(filter);

  const { results, totalPages, page, limit, sortBy, totalResults } =
    await User.paginate(filter, options);

  const populatedResults = await User.populate(results, { path: "account" });

  const extractedResults = populatedResults.map(
    ({
      _id,
      userName,
      email,
      fullName,
      country,
      account,
      isBlocked,
      createdAt,
    }) => ({
      _id,
      userName,
      email,
      fullName,
      country,
      accountBalance: account ? account.accountBalance : 0,
      isBlocked,
      createdAt,
    })
  );

  return {
    results: extractedResults,
    totalPages,
    page,
    limit,
    sortBy,
    totalResults,
  };
};

const updateUser = async (user, updateBody) => {
  if (
    updateBody.email &&
    (await User.isEmailTaken(updateBody.email, user.id))
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

const deleteUser = async (userData, userId) => {
  if (userData.role === "user") {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "You do not have permission to do this"
    );
  }
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "Client not found");
  }
  await User.findByIdAndDelete(userId);
  return user;
};

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  updateUserById,
  updateUser,
  getAllUser,
  deleteUser,
};
