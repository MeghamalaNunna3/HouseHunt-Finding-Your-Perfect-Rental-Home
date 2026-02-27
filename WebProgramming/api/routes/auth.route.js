import express from 'express';
import { google, signup } from '../controllers/auth.controller.js';
import { signin, signout } from '../controllers/auth.controller.js';


const router = express.Router();

// Handle user registration logic here
router.post('/signup', signup);
// Handle user sign logic here
router.post('/signin', signin);
// Handle Google OAuth logic here
router.post('/google', google);
// Handle user sign out logic here
router.get('/signout', signout);
export default router;