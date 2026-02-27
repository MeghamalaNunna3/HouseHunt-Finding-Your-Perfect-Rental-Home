import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // Initialization Vector length
const AUTH_TAG_LENGTH = 16; // GCM auth tag length
// The secret key is read from your .env file
const SECRET_KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');

// This function takes plain text and returns an encrypted string
export const encrypt = (text) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  // We combine iv, authTag, and the encrypted text, separated by ':'
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
};

// This function takes an encrypted string and returns the plain text
export const decrypt = (hash) => {
  try {
    const parts = hash.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encryptedText = parts[2];
    
    const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption failed:', error);
    return null; // Handle the error gracefully
  }
};