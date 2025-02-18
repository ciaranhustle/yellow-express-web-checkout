import validator from "validator";

export const isEmail = (email?: string) => {
  if (!email) return false;
  return validator.isEmail(email);
};

export const isMobile = (phoneNumber?: string) => {
  if (!phoneNumber) return false;
  return validator.isMobilePhone(phoneNumber);
};

export const isValidPassword = (password?: string) => {
  if (!password) return false;
  const lengthRegex = /^.{8,}$/;
  const uppercaseRegex = /[A-Z]/;
  const lowercaseRegex = /[a-z]/;
  const specialCharsRegex = /[!@#$%^&*.()]/;

  return (
    lengthRegex.test(password) &&
    uppercaseRegex.test(password) &&
    lowercaseRegex.test(password) &&
    specialCharsRegex.test(password)
  );
};
