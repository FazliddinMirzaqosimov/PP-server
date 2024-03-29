exports.passwordValidator = (password) => {
  if (!password) {
    return {
      isValid: false,
      message: "Parol topilmadi!",
    };
  }
  if (String(password).length < 8) {
    return {
      isValid: false,
      message: "Parol kamida 8 harakterdan iborat bo'lishi kerak",
    };
  }
  return {
    isValid: true,
    message: null,
  };
};
 