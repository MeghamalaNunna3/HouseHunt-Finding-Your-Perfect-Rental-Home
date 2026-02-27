import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className='bg-white mt-16'> {/* Added mt-16 for top margin */}
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {/* Logo and About Section */}
          <div className='md:col-span-1'>
            <Link to='/' className='font-bold text-2xl'>
              <span className='text-slate-500'>Safe</span>
              <span className='text-slate-700'>House</span>
            </Link>
            <p className='text-slate-500 mt-4 text-sm leading-relaxed'>
              Your trusted partner in finding a secure and perfect place to call home.
            </p>
            <div className='flex space-x-4 mt-6'>
              <a href='#' className='text-slate-400 hover:text-slate-600 transition-colors'><FaFacebook size={20} /></a>
              <a href='#' className='text-slate-400 hover:text-slate-600 transition-colors'><FaTwitter size={20} /></a>
              <a href='#' className='text-slate-400 hover:text-slate-600 transition-colors'><FaInstagram size={20} /></a>
              <a href='#' className='text-slate-400 hover:text-slate-600 transition-colors'><FaLinkedin size={20} /></a>
            </div>
          </div>

          {/* Links Section */}
          <div className='md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-8'>
            <div>
              <h3 className='text-sm font-semibold text-slate-800 tracking-wider uppercase mb-4'>Company</h3>
              <ul className='space-y-3 text-slate-600'>
                <li><Link to='/about' className='hover:text-slate-900 transition-colors'>About Us</Link></li>
                <li><Link to='/careers' className='hover:text-slate-900 transition-colors'>Careers</Link></li>
                <li><Link to='/press' className='hover:text-slate-900 transition-colors'>Press</Link></li>
              </ul>
            </div>
            <div>
              <h3 className='text-sm font-semibold text-slate-800 tracking-wider uppercase mb-4'>Listings</h3>
              <ul className='space-y-3 text-slate-600'>
                <li><Link to='/search?type=rent' className='hover:text-slate-900 transition-colors'>For Rent</Link></li>
                <li><Link to='/search?type=sale' className='hover:text-slate-900 transition-colors'>For Sale</Link></li>
                <li><Link to='/search?offer=true' className='hover:text-slate-900 transition-colors'>Offers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className='text-sm font-semibold text-slate-800 tracking-wider uppercase mb-4'>Support</h3>
              <ul className='space-y-3 text-slate-600'>
                <li><Link to='/contact' className='hover:text-slate-900 transition-colors'>Contact</Link></li>
                <li><Link to='/faq' className='hover:text-slate-900 transition-colors'>FAQ</Link></li>
                <li><Link to='/profile' className='hover:text-slate-900 transition-colors'>My Account</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Copyright Bar */}
        <div className='mt-12 pt-8 border-t border-slate-200'>
          <p className='text-center text-slate-500 text-sm'>
            &copy; {new Date().getFullYear()} SafeHouse. All Rights Reserved. Dhaka, Bangladesh.
          </p>
        </div>
      </div>
    </footer>
  );
}