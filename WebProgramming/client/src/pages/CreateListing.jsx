import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBed, FaBath, FaDollarSign, FaPhone } from 'react-icons/fa';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phoneNumber: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 500,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
    imageUrls: [],
    userRef: currentUser ? currentUser._id : '',
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const validateStep = () => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Property name is required.';
      if (!formData.description.trim()) newErrors.description = 'Description is required.';
      if (!formData.address.trim()) newErrors.address = 'Address is required.';

      if (!formData.phoneNumber) {
        newErrors.phoneNumber = 'Phone number is required.';
      } else if (!isValidPhoneNumber(formData.phoneNumber)) {
        newErrors.phoneNumber = 'Please enter a valid phone number.';
      }
    }
    if (step === 2) {
      if (formData.regularPrice <= 0) newErrors.regularPrice = 'Regular price must be greater than 0.';
      if (formData.type === 'sale' && formData.offer && +formData.discountPrice >= +formData.regularPrice) {
        newErrors.discountPrice = 'Discount price must be less than the regular price.';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handleBack = () => setStep(step - 1);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: null }));
    }
    if (id === 'sale' || id === 'rent') {
      setFormData({
        ...formData,
        type: id,
        offer: false,
        discountPrice: 0
      });
    } else if (id === 'parking' || id === 'furnished' || id === 'offer') {
      setFormData({ ...formData, [id]: checked });
    } else {
      setFormData({ ...formData, [id]: type === 'number' ? Number(value) : value });
    }
  };

  const handleImageSubmit = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = files.map((file) => {
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        uploadFormData.append('upload_preset', 'omrlo2vb');
        return fetch('https://api.cloudinary.com/v1_1/dntrypsos/image/upload', {
          method: 'POST',
          body: uploadFormData,
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.error) throw new Error(data.error.message);
            return data.secure_url;
          });
      });
      Promise.all(promises)
        .then((urls) => {
          setFormData({ ...formData, imageUrls: formData.imageUrls.concat(urls) });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch(() => {
          setImageUploadError('Image upload failed. Please try again.');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload up to 6 images per listing.');
    }
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;
    if (formData.imageUrls.length < 1) {
      return setErrors({ images: 'You must upload at least one image.' });
    }
    if (+formData.regularPrice < +formData.discountPrice) {
      return setErrors({ discountPrice: 'Discount price must be lower than regular price' });
    }
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
        return;
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-700">Loading...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-xl space-y-8">
        <h1 className="text-3xl font-bold text-center text-slate-700">Create a Property Listing</h1>
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
              Step {step} of 4
            </span>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
            <motion.div
              style={{ width: `${(step / 4) * 100}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"
              initial={{ width: 0 }}
              animate={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1 */}
          {step === 1 && (
            <motion.div key="step1" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
              <h2 className="text-xl font-semibold text-slate-600">Describe your place</h2>
              <div>
                <input type="text" placeholder="Property Name (e.g., Safe Villa)" id="name"
                  className={`w-full p-3 border rounded-lg ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                  required onChange={handleChange} value={formData.name} />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <textarea placeholder="Description" id="description"
                  className={`w-full p-3 border rounded-lg h-32 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                  required onChange={handleChange} value={formData.description}></textarea>
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              </div>
              <div>
                <input type="text" placeholder="Address" id="address"
                  className={`w-full p-3 border rounded-lg ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                  required onChange={handleChange} value={formData.address} />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>

              <div>
                <PhoneInput
                  international // This prop enables immediate international formatting
                  id="phoneNumber"
                  placeholder="Enter phone number"
                  className={`p-3 border rounded-lg custom-phone-input ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
                  defaultCountry="BD"
                  value={formData.phoneNumber}
                  onChange={(value) => {
                    if (errors.phoneNumber) {
                        setErrors(prev => ({ ...prev, phoneNumber: null }));
                    }
                    setFormData({ ...formData, phoneNumber: value || '' })
                  }}
                />
                {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
              </div>

              <div className="flex gap-4">
                <button onClick={handleNext} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">Next</button>
              </div>
            </motion.div>
          )}

          {/* Step 2 */}
          {step === 2 && (
             <motion.div key="step2" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
               <h2 className="text-xl font-semibold text-slate-600">Property Details & Pricing</h2>
               <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                 <p className="font-semibold">This property is for:</p>
                 <div className="flex gap-2">
                   <input type="radio" id="sale" name="type" className="w-5" onChange={handleChange} checked={formData.type === 'sale'} />
                   <span>Sell</span>
                 </div>
                 <div className="flex gap-2">
                   <input type="radio" id="rent" name="type" className="w-5" onChange={handleChange} checked={formData.type === 'rent'} />
                   <span>Rent</span>
                 </div>
               </div>

               <div className="flex flex-wrap gap-6 pt-4 border-t">
                 <div className="flex items-center gap-2">
                   <FaBed className="text-lg" />
                   <input type="number" id="bedrooms" min="1" max="10" required
                     className="p-3 border border-gray-300 rounded-lg w-24"
                     onChange={handleChange} value={formData.bedrooms} />
                   <span>Beds</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <FaBath className="text-lg" />
                   <input type="number" id="bathrooms" min="1" max="10" required
                     className="p-3 border border-gray-300 rounded-lg w-24"
                     onChange={handleChange} value={formData.bathrooms} />
                   <span>Baths</span>
                 </div>
               </div>

               {formData.type === 'sale' && (
                 <div className="flex gap-2 items-center">
                   <input type="checkbox" id="offer" className="w-5 h-5" onChange={handleChange} checked={formData.offer} />
                   <span>Make an offer with a discounted price?</span>
                 </div>
               )}

               <div>
                 <div className="flex items-center gap-2">
                   <FaDollarSign className="text-lg" />
                   <input type="number" id="regularPrice" min="50" required
                     className={`p-3 border rounded-lg ${errors.regularPrice ? 'border-red-500' : 'border-gray-300'}`}
                     onChange={handleChange} value={formData.regularPrice} />
                   <div className="flex flex-col items-center">
                     <p>Regular Price</p>
                     {formData.type === 'rent' && <span className="text-xs">($ / month)</span>}
                   </div>
                 </div>
                 {errors.regularPrice && <p className="text-red-500 text-xs mt-1">{errors.regularPrice}</p>}
               </div>

               {formData.type === 'sale' && formData.offer && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                   <div className="flex items-center gap-2">
                     <FaDollarSign className="text-lg text-green-600" />
                     <input type="number" id="discountPrice" min="0" required
                       className={`p-3 border rounded-lg ${errors.discountPrice ? 'border-red-500' : 'border-gray-300'}`}
                       onChange={handleChange} value={formData.discountPrice} />
                     <div className="flex flex-col items-center">
                       <p>Discounted Price</p>
                     </div>
                   </div>
                   {errors.discountPrice && <p className="text-red-500 text-xs mt-1">{errors.discountPrice}</p>}
                 </motion.div>
               )}

               <div className="flex gap-4">
                 <button onClick={handleBack} className="w-full bg-gray-200 text-slate-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition">Back</button>
                 <button onClick={handleNext} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">Next</button>
               </div>
             </motion.div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <motion.div key="step3" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
              <h2 className="text-xl font-semibold text-slate-600">Features & Amenities</h2>
              <div className="flex flex-wrap gap-4">
                <div className="flex gap-2">
                  <input type="checkbox" id="parking" className="w-5" onChange={handleChange} checked={formData.parking} />
                  <span>Parking spot</span>
                </div>
                <div className="flex gap-2">
                  <input type="checkbox" id="furnished" className="w-5" onChange={handleChange} checked={formData.furnished} />
                  <span>Furnished</span>
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={handleBack} className="w-full bg-gray-200 text-slate-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition">Back</button>
                <button onClick={handleNext} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">Next</button>
              </div>
            </motion.div>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <motion.div key="step4" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
              <h2 className="text-xl font-semibold text-slate-600">Add Images</h2>
              <div className="flex gap-4">
                <input onChange={handleImageSubmit} className="p-3 border border-gray-300 rounded w-full" type="file" id="images" accept="image/*" multiple />
                <button type="button" disabled={uploading} className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80">
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
              <p className="text-red-700 text-sm">{imageUploadError && imageUploadError}</p>
              {errors.images && <p className="text-red-500 text-sm">{errors.images}</p>}
              {formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                <div key={url} className="flex justify-between p-3 border items-center">
                  <img src={url} alt="listing" className="w-20 h-20 object-contain rounded-lg" />
                  <button type="button" onClick={() => handleRemoveImage(index)} className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75">Delete</button>
                </div>
              ))}
              <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                  <button onClick={handleBack} className="w-full bg-gray-200 text-slate-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition">Back</button>
                  <button onClick={handleSubmit} disabled={loading || uploading} className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-70">
                    {loading ? 'Creating...' : 'Create Listing'}
                  </button>
                </div>
                {error && <p className="text-red-700 text-sm text-center">{error}</p>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}