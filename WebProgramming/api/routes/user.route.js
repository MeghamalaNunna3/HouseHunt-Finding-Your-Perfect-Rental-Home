import express from 'express';
import { test, updateUser, deleteUser, getUserListings, getUser } from '../controllers/user.controllers.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// Test route
router.get('/test', test);

// Update user route (requires token verification)
router.post('/update/:id', verifyToken, updateUser);

// Delete user route (requires token verification)
router.delete('/delete/:id', verifyToken, deleteUser);

// Get the listings of a user (requires token verification)
router.get('/listings/:id', verifyToken, getUserListings);

// Show listings created by a specific user
router.get('/:id', verifyToken, getUser);


export default router;

