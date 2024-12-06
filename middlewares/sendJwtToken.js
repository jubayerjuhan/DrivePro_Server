export const sendJwtToken = async (res, next, user) => {
  const jwt = await user.generateJwtToken();

  if (user.password) user.password = undefined;

  res.status(200).json({
    success: true,
    user,
    jwtToken: jwt,
  });
};
