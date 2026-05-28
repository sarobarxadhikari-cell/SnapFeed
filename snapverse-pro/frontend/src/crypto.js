import CryptoJS from "crypto-js";

const SECRET = "snapverse-e2e-key-2026";

export const encrypt = (msg) => {
  const encrypted = CryptoJS.AES.encrypt(msg, SECRET);
  return encrypted.toString();
};

export const decrypt = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET);
  return bytes.toString(CryptoJS.enc.Utf8);
};
