import express from 'express';
import { createListing, deleteListing, editListing, getListing, getListings } from '../controllers/listing.controller.js';
import {verifyToken} from '../utils/verifyUser.js';

const router = express.Router();

// Define your listing routes here
router.post('/create', verifyToken, createListing);
// Delete a listing
router.delete('/delete/:id', verifyToken, deleteListing);

// Edit a listing
router.put('/edit/:id', verifyToken, editListing);

// Get a single existing listing information to see so that it can be edited
router.get('/get/:id', getListing);

// Get all listings
router.get('/getListings', getListings);

export default router;
