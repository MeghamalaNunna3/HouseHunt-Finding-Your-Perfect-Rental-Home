import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa'; // 1. Import WhatsApp icon

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState('');

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);

  return (
    <>
      {landlord && (
        <div className='flex flex-col gap-2 mt-4'>
          <p>
            Contact <span className='font-semibold'>{landlord.username}</span>{' '}
            for{' '}
            <span className='font-semibold'>{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            name='message'
            id='message'
            rows='2'
            value={message}
            onChange={onChange}
            placeholder='Write your message here...'
            className='w-full border p-3 rounded-lg'
          ></textarea>

          {/* 2. Changed Link to generate a WhatsApp URL */}
          <a
            href={`https://wa.me/${listing.phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
              message
            )}`}
            target='_blank'
            rel='noopener noreferrer'
            className='bg-green-500 text-white text-center p-3 uppercase rounded-lg hover:bg-green-600 flex items-center justify-center gap-2'
          >
            <FaWhatsapp className='text-xl' />
            Send Message on WhatsApp
          </a>
        </div>
      )}
    </>
  );
}