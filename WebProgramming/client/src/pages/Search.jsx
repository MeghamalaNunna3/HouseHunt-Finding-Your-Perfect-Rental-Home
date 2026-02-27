import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

export default function Search() {
  const navigate = useNavigate();
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    bedrooms: '', // Added bedrooms
    bathrooms: '', // Added bathrooms
    sort: 'created_at',
    order: 'desc',
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const bedroomsFromUrl = urlParams.get('bedrooms'); // Added
    const bathroomsFromUrl = urlParams.get('bathrooms'); // Added
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      bedroomsFromUrl || // Added
      bathroomsFromUrl || // Added
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebarData({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true',
        furnished: furnishedFromUrl === 'true',
        offer: offerFromUrl === 'true',
        bedrooms: bedroomsFromUrl || '', // Added
        bathrooms: bathroomsFromUrl || '', // Added
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
      });
    }
  }, []);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const urlParams = new URLSearchParams(location.search);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/getListings?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      const urlParams = new URLSearchParams();
      urlParams.set('searchTerm', sidebarData.searchTerm);
      urlParams.set('type', sidebarData.type);
      urlParams.set('parking', sidebarData.parking);
      urlParams.set('furnished', sidebarData.furnished);
      urlParams.set('offer', sidebarData.offer);
      
      // Conditionally add beds/baths to URL only if they have a value
      if (sidebarData.bedrooms) {
        urlParams.set('bedrooms', sidebarData.bedrooms);
      }
      if (sidebarData.bathrooms) {
        urlParams.set('bathrooms', sidebarData.bathrooms);
      }
      
      urlParams.set('sort', sidebarData.sort);
      urlParams.set('order', sidebarData.order);
      const searchQuery = urlParams.toString();
      navigate(`/search?${searchQuery}`, { replace: true });
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [sidebarData, navigate]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    if (id === 'all' || id === 'rent' || id === 'sale') {
      setSidebarData({ ...sidebarData, type: id });
    } else if (id === 'searchTerm') {
      setSidebarData({ ...sidebarData, searchTerm: value });
    } else if (id === 'parking' || id === 'furnished' || id === 'offer') {
      setSidebarData({ ...sidebarData, [id]: checked });
    } else if (id === 'bedrooms' || id === 'bathrooms') { // Added
      setSidebarData({ ...sidebarData, [id]: value });
    } else if (id === 'sort_order') {
      const [sort, order] = value.split('_');
      setSidebarData({ ...sidebarData, sort: sort || 'created_at', order: order || 'desc' });
    }
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/getListings?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };

  return (
    <div className='flex flex-col md:flex-row'>
      <div className='md:w-96 md:min-h-screen p-6 bg-white md:shadow-md'>
        <div className='flex flex-col gap-8'>
          <div className='flex flex-col gap-2'>
            <label className='whitespace-nowrap font-semibold text-slate-700'>Search Term:</label>
            <input
              type='text'
              id='searchTerm'
              placeholder='City, Address, etc...'
              className='border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-slate-400 transition'
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>

          <div className='flex flex-col gap-2'>
            <label className='font-semibold text-slate-700'>Type:</label>
            <div className='flex gap-2 flex-wrap'>
              <ToggleButton id="all" checked={sidebarData.type === 'all'} onChange={handleChange}>Rent & Sale</ToggleButton>
              <ToggleButton id="rent" checked={sidebarData.type === 'rent'} onChange={handleChange}>Rent</ToggleButton>
              <ToggleButton id="sale" checked={sidebarData.type === 'sale'} onChange={handleChange}>Sale</ToggleButton>
            </div>
          </div>
          
          <div className='flex flex-col gap-2'>
            <label className='font-semibold text-slate-700'>Amenities:</label>
            <div className='flex gap-4 flex-wrap'>
              <ToggleButton id="parking" checked={sidebarData.parking} onChange={handleChange}>Parking</ToggleButton>
              <ToggleButton id="furnished" checked={sidebarData.furnished} onChange={handleChange}>Furnished</ToggleButton>
            </div>
          </div>
          
          {/* --- NEW: Bedrooms and Bathrooms filters --- */}
          <div className='flex flex-col gap-2'>
            <label className='font-semibold text-slate-700'>Rooms</label>
            <div className='flex gap-4 items-center'>
              <div className='flex items-center gap-2'>
                  <label htmlFor='bedrooms' className='text-sm'>Beds</label>
                  <input
                    type='number'
                    id='bedrooms'
                    min='1'
                    max='10'
                    placeholder='Any'
                    className='border rounded-lg p-2 w-20 text-center'
                    value={sidebarData.bedrooms}
                    onChange={handleChange}
                  />
              </div>
              <div className='flex items-center gap-2'>
                  <label htmlFor='bathrooms' className='text-sm'>Baths</label>
                  <input
                    type='number'
                    id='bathrooms'
                    min='1'
                    max='10'
                    placeholder='Any'
                    className='border rounded-lg p-2 w-20 text-center'
                    value={sidebarData.bathrooms}
                    onChange={handleChange}
                  />
              </div>
            </div>
          </div>
          
          <div className='flex flex-col gap-2'>
            <label className='font-semibold text-slate-700'>Offer:</label>
            <div className='flex gap-2'>
                <ToggleButton id="offer" checked={sidebarData.offer} onChange={handleChange}>Include Offers</ToggleButton>
            </div>
          </div>

          <div className='flex flex-col gap-2'>
            <label className='font-semibold text-slate-700'>Sort:</label>
            <select
              onChange={handleChange}
              value={`${sidebarData.sort}_${sidebarData.order}`}
              id='sort_order'
              className='border rounded-lg p-3 bg-white focus:outline-none focus:ring-2 focus:ring-slate-400 transition'
            >
              <option value='createdAt_desc'>Latest</option>
              <option value='createdAt_asc'>Oldest</option>
              <option value='regularPrice_desc'>Price high to low</option>
              <option value='regularPrice_asc'>Price low to high</option>
            </select>
          </div>
        </div>
      </div>

      <div className='flex-1 p-6'>
        <h1 className='text-3xl font-bold text-slate-800 mb-6'>
          Available Listings
        </h1>
        <div className='flex flex-wrap gap-6'>
          {!loading && listings.length === 0 && (
            <p className='text-xl text-slate-700'>No listings found!</p>
          )}
          {loading && (
            <p className='text-xl text-slate-700 text-center w-full'>
              Loading...
            </p>
          )}

          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}

          {showMore && (
            <button
              onClick={onShowMoreClick}
              className='text-green-700 hover:underline p-7 text-center w-full'
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const ToggleButton = ({ id, checked, onChange, children }) => (
    <label htmlFor={id} className={`
        px-4 py-2 border rounded-full cursor-pointer transition-colors duration-300 text-sm font-medium
        ${checked ? 'bg-slate-700 text-white border-slate-700' : 'bg-white text-slate-700 border-gray-300 hover:bg-gray-50'}
    `}>
        <input 
            type="checkbox" 
            id={id} 
            className="sr-only"
            onChange={onChange}
            checked={checked}
        />
        {children}
    </label>
);