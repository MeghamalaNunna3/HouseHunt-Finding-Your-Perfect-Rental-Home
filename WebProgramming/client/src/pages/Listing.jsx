import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation, EffectFade } from 'swiper/modules';

// Core Swiper styles for proper functionality
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';
import Contact from '../components/Contact';

export default function Listing() {
  SwiperCore.use([Navigation, EffectFade]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  return (
    <main>
      {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
      {error && (
        <p className='text-center my-7 text-2xl'>Something went wrong!</p>
      )}
      {listing && !loading && !error && (
        <div className='max-w-6xl mx-auto'>
          <Swiper
            modules={[EffectFade, Navigation]}
            effect='fade'
            navigation={{
              nextEl: '.swiper-button-next-custom',
              prevEl: '.swiper-button-prev-custom',
            }}
            className='h-[550px] rounded-lg shadow-lg relative'
            loop={true}
          >
            {listing.imageUrls.map((url, index) => (
              <SwiperSlide key={`${url}-${index}`}>
                <img
                  src={url}
                  alt={`Listing image ${index + 1}`}
                  className='w-full h-full object-cover'
                />
              </SwiperSlide>
            ))}

            {/* Custom Navigation Buttons */}
            <div className='absolute top-1/2 left-4 z-10 -translate-y-1/2'>
              <div className='swiper-button-prev-custom bg-white/70 rounded-full w-10 h-10 flex justify-center items-center text-slate-800 transition-all duration-300 hover:bg-white hover:scale-110 cursor-pointer shadow-md'>
                <FaChevronLeft className='text-lg' />
              </div>
            </div>
            <div className='absolute top-1/2 right-4 z-10 -translate-y-1/2'>
              <div className='swiper-button-next-custom bg-white/70 rounded-full w-10 h-10 flex justify-center items-center text-slate-800 transition-all duration-300 hover:bg-white hover:scale-110 cursor-pointer shadow-md'>
                <FaChevronRight className='text-lg' />
              </div>
            </div>
          </Swiper>
        
          {/* Floating Share Button */}
          <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
            <FaShare
              className='text-slate-500'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
              Link copied!
            </p>
          )}

          {/* Styled content container with updated width */}
          <div className='flex flex-col max-w-6xl mx-auto my-7 gap-4 bg-white shadow-md rounded-lg p-6 border border-gray-200'>
            <p className='text-2xl font-semibold text-slate-800'>
              {listing.name} - ${' '}
              {listing.offer
                ? listing.discountPrice.toLocaleString('en-US')
                : listing.regularPrice.toLocaleString('en-US')}
              {listing.type === 'rent' && <span className='text-lg font-normal'> / month</span>}
            </p>
            <p className='flex items-center gap-2 text-slate-600 text-sm'>
              <FaMapMarkerAlt className='text-green-700' />
              {listing.address}
            </p>
            <div className='flex flex-wrap gap-4 items-center'>
              <p className='bg-red-800 text-white text-center p-1 px-3 rounded-md text-sm font-semibold'>
                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
              </p>
              {listing.offer && (
                <p className='bg-green-800 text-white text-center p-1 px-3 rounded-md text-sm font-semibold'>
                  ${+listing.regularPrice - +listing.discountPrice} OFF
                </p>
              )}
            </div>
            <div className='border-t border-gray-200 mt-2'></div>
            <p className='text-slate-700 pt-2 leading-relaxed'>
              <span className='font-semibold text-slate-800'>Description - </span>
              {listing.description}
            </p>
            
            <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6 pt-2'>
              <li className='flex items-center gap-1 whitespace-nowrap'>
                <FaBed className='text-lg' />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds `
                  : `${listing.bedrooms} bed `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap'>
                <FaBath className='text-lg' />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths `
                  : `${listing.bathrooms} bath `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap'>
                <FaParking className='text-lg' />
                {listing.parking ? 'Parking spot' : 'No Parking'}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap'>
                <FaChair className='text-lg' />
                {listing.furnished ? 'Furnished' : 'Unfurnished'}
              </li>
            </ul>

            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className='bg-slate-700 text-white rounded-lg uppercase hover:bg-slate-800 transition-colors p-3 mt-4'
              >
                Contact landlord
              </button>
            )}
            {contact && <Contact listing={listing} />}
          </div>
        </div>
      )}
    </main>
  );
}