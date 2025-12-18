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

                <Link to="/" className='flex items-center gap-2 logo-tilt'>
                    <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center tilt-icon">
                        <BookOpen className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <h1 className='text-xl font-bold text-foreground tracking-tight'>
                        SmartLearn
                    </h1>
                </Link>

                {/* Desktop Menu */}
                <ul className='hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground'>
                    <li><Link to="/" className="nav-tilt-link hover:text-primary transition-colors">Home</Link></li>
                    <li><Link to="/courses" className="nav-tilt-link hover:text-primary transition-colors">Courses</Link></li>
                    <li><Link to="/articles" className="nav-tilt-link hover:text-primary transition-colors">Articles</Link></li>
                    {user && (
                        <li>
                            <Link to="/games/tictactoe" className="nav-tilt-link hover:text-primary transition-colors flex items-center gap-1">
                                Games
                            </Link>
                        </li>
                    )}
                </ul>

                <div className="hidden md:flex items-center gap-4">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground transition-all duration-300 tilt-icon"
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
                                <Link to="/admin/dashboard" className="flex items-center gap-2 text-sm font-medium text-foreground nav-tilt-link">
                                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                                </Link>
                            ) : user.role === 'instructor' ? (
                                <Link to="/instructor/dashboard" className="flex items-center gap-2 text-sm font-medium text-foreground nav-tilt-link">
                                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                                </Link>
                            ) : (
                                <Link to="/dashboard" className="flex items-center gap-2 text-sm font-medium text-foreground nav-tilt-link">
                                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                                </Link>
                            )}

                            <Link to="/profile" className="flex items-center gap-2 text-sm font-medium text-foreground nav-tilt-link">
                                <User className="w-4 h-4" /> Profile
                            </Link>
                            
                            <button 
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-500/10 hover:bg-red-500/20 rounded-lg tilt-button"
                            >
                                <LogOut className="w-4 h-4" /> Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-sm font-medium text-muted-foreground nav-tilt-link">
                                Log in
                            </Link>
                            <Link to="/register" className='px-5 py-2.5 gradient-primary text-primary-foreground text-sm font-medium rounded-lg tilt-button shadow-lg glow-hover'>
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button 
                    className="md:hidden p-2 text-foreground tilt-icon"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>


            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-border bg-card px-6 py-4 space-y-4">
                    <Link to="/" className="block text-sm font-medium text-muted-foreground menu-tilt">Home</Link>
                    <Link to="/courses" className="block text-sm font-medium text-muted-foreground menu-tilt">Courses</Link>
                    <Link to="/articles" className="block text-sm font-medium text-muted-foreground menu-tilt">Articles</Link>
                    {user && (
                        <Link to="/games/tictactoe" className="flex items-center gap-2 text-sm font-medium text-muted-foreground menu-tilt">
                            Games
                        </Link>
                    )}
                    
                    {/* Mobile Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="flex items-center gap-2 text-sm font-medium text-muted-foreground menu-tilt"
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
                                <Link to="/profile" className="block text-sm font-medium text-muted-foreground menu-tilt">Profile</Link>
                                {user.role === 'admin' ? (
                                    <Link to="/admin/dashboard" className="block text-sm font-medium text-muted-foreground menu-tilt">Dashboard</Link>
                                ) : user.role === 'instructor' ? (
                                    <Link to="/instructor/dashboard" className="block text-sm font-medium text-muted-foreground menu-tilt">Dashboard</Link>
                                ) : (
                                    <Link to="/dashboard" className="block text-sm font-medium text-muted-foreground menu-tilt">Dashboard</Link>
                                )}
                                <button onClick={handleLogout} className="block w-full text-left text-sm font-medium text-red-500 menu-tilt">Logout</button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <Link to="/login" className="block text-center py-2 text-sm font-medium text-muted-foreground border border-border rounded-lg tilt-button">Log in</Link>
                                <Link to="/register" className="block text-center py-2 text-sm font-medium text-primary-foreground gradient-primary rounded-lg tilt-button glow-hover">Get Started</Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;