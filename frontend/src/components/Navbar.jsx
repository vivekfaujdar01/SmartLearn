
import { Link } from 'react-router-dom';

const Navbar = () => {
return (
    <nav className='fixed top-0 w-full bg-white shadow-sm z-50'>
        <div className='max-w-7xl mx-auto flex items-center justify-between py-4 px-6'>

            <div className='flex items-center gap-2'>
                <img src="/logo.png" alt="logo" className='w-8 h-8' />
                <h1 className='text-xl font-bold text-blue-600 tracking-wider'>
                    Smart Learn
                </h1>
            </div>

            <ul className='hidden md:flex gap-10 text-gray-700 font-medium'>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/">About</Link></li>
                <li><Link to="/">Contact</Link></li>

            </ul>

            <button className='px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition'>
                    Get Started
            </button>
        </div>
    </nav>
  )
};

export default Navbar;