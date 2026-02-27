import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, "Listing not found"));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only delete your own listings!"));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Listing has been deleted' });
  } catch (error) {
    next(error);
  }
};


export const editListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, "Listing not found"));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only edit your own listings!"));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    // Find the listing by its ID
    const listing = await Listing.findById(req.params.id);

    // This will log the result of the query to your backend terminal
    // console.log('Listing data after populate:', listing); 
    
    if (!listing) {
      return next(errorHandler(404, "Listing not found"));
    }

    // Send the complete listing object, now with the user's info included
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if (offer === undefined || offer === 'false') {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === 'false') {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;

    if (parking === undefined || parking === 'false') {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;

    if (type === undefined || type === 'all') {
      type = { $in: ['sale', 'rent'] };
    }

    const searchTerm = req.query.searchTerm || '';
    const sort = req.query.sort || 'createdAt';
    const order = req.query.order === 'asc' ? 1 : -1;

    const baseQuery = {
      offer,
      furnished,
      parking,
      type,
    };
    
    // --- NEW: Conditionally add exact match for beds and baths ---
    if (req.query.bedrooms) {
      baseQuery.bedrooms = parseInt(req.query.bedrooms);
    }
    if (req.query.bathrooms) {
      baseQuery.bathrooms = parseInt(req.query.bathrooms);
    }
    // -----------------------------------------------------------
    
    // Conditionally add search term to avoid issues with empty searches
    const query = searchTerm
      ? {
          ...baseQuery,
          $or: [
            // Use regex with start (^) and end ($) anchors for an absolute, case-insensitive match
            { name: { $regex: `^${searchTerm}$`, $options: 'i' } },
            { address: { $regex: `^${searchTerm}$`, $options: 'i' } },
          ],
        }
      : baseQuery;

    const listings = await Listing.find(query)
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};