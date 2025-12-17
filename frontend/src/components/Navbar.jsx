import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, LogOut, User, LayoutDashboard, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className='fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50'>
            <div className='max-w-7xl mx-auto flex items-center justify-between py-4 px-6'>

                <Link to="/" className='flex items-center gap-2'>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <h1 className='text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight'>
                        SmartLearn
                    </h1>
                </Link>

                {/* Desktop Menu */}
                <ul className='hidden md:flex items-center gap-8 text-sm font-medium text-gray-600'>
                    <li><Link to="/" className="hover:text-blue-600 transition-colors">Home</Link></li>
                    <li><Link to="/courses" className="hover:text-blue-600 transition-colors">Courses</Link></li>
                    <li><Link to="/articles" className="hover:text-blue-600 transition-colors">Articles</Link></li>
                    <li><Link to="/games" className="hover:text-blue-600 transition-colors">Games</Link></li>
                </ul>

                <div className="hidden md:flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-4">
                            {user.role === 'admin' ? (
                                <Link to="/admin/dashboard" className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600">
                                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                                </Link>
                            ) : user.role === 'instructor' ? (
                                <Link to="/instructor/dashboard" className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600">
                                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                                </Link>
                            ) : (
                                <Link to="/dashboard" className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600">
                                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                                </Link>
                            )}

                            <Link to="/profile" className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600">
                                <User className="w-4 h-4" /> Profile
                            </Link>
                            
                            <button 
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                            >
                                <LogOut className="w-4 h-4" /> Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                                Log in
                            </Link>
                            <Link to="/register" className='px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all shadow-lg shadow-blue-600/20'>
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button 
                    className="md:hidden p-2 text-gray-600"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 space-y-4">
                    <Link to="/" className="block text-sm font-medium text-gray-600">Home</Link>
                    <Link to="/courses" className="block text-sm font-medium text-gray-600">Courses</Link>
                    <Link to="/articles" className="block text-sm font-medium text-gray-600">Articles</Link>
                    <Link to="/games" className="block text-sm font-medium text-gray-600">Games</Link>
                    <div className="pt-4 border-t border-gray-100">
                        {user ? (
                            <div className="space-y-3">
                                <Link to="/profile" className="block text-sm font-medium text-gray-600">Profile</Link>
                                {user.role === 'admin' ? (
                                    <Link to="/admin/dashboard" className="block text-sm font-medium text-gray-600">Dashboard</Link>
                                ) : user.role === 'instructor' ? (
                                    <Link to="/instructor/dashboard" className="block text-sm font-medium text-gray-600">Dashboard</Link>
                                ) : (
                                    <Link to="/dashboard" className="block text-sm font-medium text-gray-600">Dashboard</Link>
                                )}
                                <button onClick={handleLogout} className="block w-full text-left text-sm font-medium text-red-600">Logout</button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <Link to="/login" className="block text-center py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg">Log in</Link>
                                <Link to="/register" className="block text-center py-2 text-sm font-medium text-white bg-blue-600 rounded-lg">Get Started</Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;