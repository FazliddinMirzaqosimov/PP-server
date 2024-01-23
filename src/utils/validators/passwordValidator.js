exports.passwordValidator = (password) => {
  if (String(password).length < 8) {
    return {
      isValid: false,
      message: "Password must be at least 8 character long",
    };
  }
  return {
    isValid: true,
    message: null,
  };
};
 