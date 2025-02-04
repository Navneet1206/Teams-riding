export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  return /^\d{10}$/.test(phone);
};

export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return re.test(password);
};

export const validateVehicleNumber = (number) => {
  // Indian vehicle number format: XX-XX-XX-XXXX
  const re = /^[A-Z]{2}-\d{2}-[A-Z]{2}-\d{4}$/;
  return re.test(number);
};