import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { BookOpen, LogOut, User, LayoutDashboard, Menu, X, Sun, Moon } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className='fixed top-0 w-full bg-card/80 backdrop-blur-md border-b border-border z-50'>
            <div className='max-w-7xl mx-auto flex items-center justify-between py-4 px-6'>

                <Link to="/" className='flex items-center gap-2'>
                    <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <h1 className='text-xl font-bold text-foreground tracking-tight'>
                        SmartLearn
                    </h1>
                </Link>

                {/* Desktop Menu */}
                <ul className='hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground'>
                    <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
                    <li><Link to="/courses" className="hover:text-primary transition-colors">Courses</Link></li>
                    <li><Link to="/articles" className="hover:text-primary transition-colors">Articles</Link></li>
                    {user && (
                        <li>
                            <Link to="/games/tictactoe" className="hover:text-primary transition-colors flex items-center gap-1">
                                Games
                            </Link>
                        </li>
                    )}
                </ul>

                <div className="hidden md:flex items-center gap-4">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground transition-all duration-300"
                        aria-label="Toggle theme"
                    >
                        {theme === 'light' ? (
                            <Moon className="w-5 h-5 transition-transform duration-300 hover:rotate-12" />
                        ) : (
                            <Sun className="w-5 h-5 transition-transform duration-300 hover:rotate-45" />
                        )}
                    </button>

                    {user ? (
                        <div className="flex items-center gap-4">
                            {user.role === 'admin' ? (
                                <Link to="/admin/dashboard" className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary">
                                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                                </Link>
                            ) : user.role === 'instructor' ? (
                                <Link to="/instructor/dashboard" className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary">
                                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                                </Link>
                            ) : (
                                <Link to="/dashboard" className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary">
                                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                                </Link>
                            )}

                            <Link to="/profile" className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary">
                                <User className="w-4 h-4" /> Profile
                            </Link>
                            
                            <button 
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
                            >
                                <LogOut className="w-4 h-4" /> Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                                Log in
                            </Link>
                            <Link to="/register" className='px-5 py-2.5 gradient-primary text-primary-foreground text-sm font-medium rounded-lg transition-all shadow-lg'>
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button 
                    className="md:hidden p-2 text-foreground"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-border bg-card px-6 py-4 space-y-4">
                    <Link to="/" className="block text-sm font-medium text-muted-foreground hover:text-primary">Home</Link>
                    <Link to="/courses" className="block text-sm font-medium text-muted-foreground hover:text-primary">Courses</Link>
                    <Link to="/articles" className="block text-sm font-medium text-muted-foreground hover:text-primary">Articles</Link>
                    {user && (
                        <Link to="/games/tictactoe" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary">
                            Games
                        </Link>
                    )}
                    
                    {/* Mobile Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"
                    >
                        {theme === 'light' ? (
                            <><Moon className="w-4 h-4" /> Dark Mode</>
                        ) : (
                            <><Sun className="w-4 h-4" /> Light Mode</>
                        )}
                    </button>

                    <div className="pt-4 border-t border-border">
                        {user ? (
                            <div className="space-y-3">
                                <Link to="/profile" className="block text-sm font-medium text-muted-foreground hover:text-primary">Profile</Link>
                                {user.role === 'admin' ? (
                                    <Link to="/admin/dashboard" className="block text-sm font-medium text-muted-foreground hover:text-primary">Dashboard</Link>
                                ) : user.role === 'instructor' ? (
                                    <Link to="/instructor/dashboard" className="block text-sm font-medium text-muted-foreground hover:text-primary">Dashboard</Link>
                                ) : (
                                    <Link to="/dashboard" className="block text-sm font-medium text-muted-foreground hover:text-primary">Dashboard</Link>
                                )}
                                <button onClick={handleLogout} className="block w-full text-left text-sm font-medium text-red-500">Logout</button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <Link to="/login" className="block text-center py-2 text-sm font-medium text-muted-foreground border border-border rounded-lg hover:border-primary">Log in</Link>
                                <Link to="/register" className="block text-center py-2 text-sm font-medium text-primary-foreground gradient-primary rounded-lg">Get Started</Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;