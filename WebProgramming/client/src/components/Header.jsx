import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <header className="bg-slate-200 shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container max-w-6xl mx-auto px-4 py-2 flex flex-row items-center justify-between gap-4 flex-wrap">
        {/* Logo */}
        <Link
          to="/"
          className="font-bold text-sm sm:text-xl flex flex-wrap cursor-pointer flex-shrink-0"
        >
          <span className="text-slate-500">Safe</span>
          <span className="text-slate-700">House</span>
        </Link>

        {/* Search Box */}
        <form onSubmit={handleSubmit} className="relative flex-grow min-w-0 group max-w-sm">
          <div className="relative z-10">
            <input
              type="text"
              name="search"
              id="search"
              placeholder="Search..."
              className="w-full rounded-full py-2 pl-4 pr-10 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:shadow-md transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type='submit' className='absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 cursor-pointer hover:text-slate-700 bg-transparent border-none'>
              <FaSearch />
            </button>
          </div>
        </form>

        {/* Navigation Links */}
        <nav className="flex gap-4 items-center flex-shrink-0">
          <Link
            to="/"
            className="hidden sm:inline-block text-slate-700 relative cursor-pointer"
          >
            <span className="nav-link">Home</span>
          </Link>
          <Link to="/about" className="text-slate-700 relative cursor-pointer">
            <span className="nav-link">About</span>
          </Link>

          {/* --- "List Your Property" button --- */}
          <Link
            to={currentUser ? '/create-listing' : '/sign-in'}
            className="text-slate-700 px-4 py-2 rounded-lg font-semibold transition-colors duration-300 shadow-sm text-sm cta-button"
          >
            <span className="relative z-10">List Your Property</span>
          </Link>

          <Link to="/profile">
            {currentUser ? (
              <img
                src={currentUser.avatar}
                alt="Profile"
                className="rounded-full h-8 w-8 object-cover border-2 border-slate-400 hover:border-slate-500 transition"
              />
            ) : (
              <span className="nav-link">Sign In</span>
            )}
          </Link>
        </nav>
      </div>

      {/* Styles (remain the same) */}
      <style>{`
        /* ... your existing styles ... */
        .nav-link {
          position: relative;
          padding-bottom: 4px;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          width: 0%;
          height: 2px;
          background: linear-gradient(to right, #3b82f6, #60a5fa);
          transition: width 0.3s ease-in-out;
        }
        .nav-link:hover::after {
          width: 100%;
        }

        .cta-button {
          position: relative;
          overflow: hidden;
          background-color: #ffffff;
        }
        .cta-button:hover {
          background-color: #f3f4f6;
        }

        .cta-button::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 200%;
          aspect-ratio: 1 / 1;
          transform: translate(-50%, -50%);
          background: conic-gradient(
            #a855f7,
            #60a5fa,
            transparent 40%,
            transparent 100%
          );
          animation: rotate-border 2.5s linear infinite;
        }

        .cta-button::after {
          content: '';
          position: absolute;
          z-index: 0;
          inset: 2px;
          background: inherit;
          border-radius: 6px;
        }

        @keyframes rotate-border {
          0% {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          100% {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
      `}</style>
    </header>
  );
}