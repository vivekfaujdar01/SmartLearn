import { Link, useNavigate } from 'react-router-dom'; // React Router components for navigation
import { useAuth } from '../context/AuthContext'; // Custom hook to access authentication context
import { useTheme } from '../context/ThemeContext'; // Custom hook to access theme context
import { BookOpen, LogOut, User, LayoutDashboard, Menu, X, Sun, Moon } from 'lucide-react'; // Icons for UI elements
import { useState } from 'react'; // React hook for managing component state

// Navbar component - Global navigation bar displayed on all pages
const Navbar = () => {
    const { user, logout } = useAuth(); // Get user data and logout function from auth context
    const { theme, toggleTheme } = useTheme(); // Get current theme and toggle function from theme context
    const navigate = useNavigate(); // Hook for programmatic navigation
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State to toggle mobile menu visibility

    // Handler for logout button - logs out user and redirects to home
    const handleLogout = () => {
        logout(); // Call logout function from auth context
        navigate('/'); // Redirect to homepage after logout
    };

    return (
        // Fixed navbar with glassmorphism effect (backdrop blur)
        <nav className='fixed top-0 w-full bg-card/80 backdrop-blur-md border-b border-border z-50'>
            <div className='max-w-7xl mx-auto flex items-center justify-between py-4 px-6'>

                {/* Logo and brand name - links to homepage */}
                <Link to="/" className='flex items-center gap-2 logo-tilt'>
                    <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center tilt-icon">
                        <BookOpen className="w-5 h-5 text-primary-foreground" /> {/* Book icon */}
                    </div>
                    <h1 className='text-xl font-bold text-foreground tracking-tight'>
                        SmartLearn
                    </h1>
                </Link>

                {/* Desktop Menu - hidden on mobile (md:flex) */}
                <ul className='hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground'>
                    <li><Link to="/" className="nav-tilt-link hover:text-primary transition-colors">Home</Link></li>
                    <li><Link to="/courses" className="nav-tilt-link hover:text-primary transition-colors">Courses</Link></li>
                    <li><Link to="/articles" className="nav-tilt-link hover:text-primary transition-colors">Articles</Link></li>
                    {/* Games link - only visible when user is logged in */}
                    {user && (
                        <li>
                            <Link to="/games/tictactoe" className="nav-tilt-link hover:text-primary transition-colors flex items-center gap-1">
                                Games
                            </Link>
                        </li>
                    )}
                </ul>

                {/* Desktop right section - theme toggle and auth buttons */}
                <div className="hidden md:flex items-center gap-4">
                    {/* Theme Toggle Button - switches between light/dark mode */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground transition-all duration-300 tilt-icon"
                        aria-label="Toggle theme"
                    >
                        {/* Show moon icon in light mode, sun icon in dark mode */}
                        {theme === 'light' ? (
                            <Moon className="w-5 h-5 transition-transform duration-300 hover:rotate-12" />
                        ) : (
                            <Sun className="w-5 h-5 transition-transform duration-300 hover:rotate-45" />
                        )}
                    </button>

                    {/* Conditional rendering based on auth status */}
                    {user ? (
                        // Logged-in user menu
                        <div className="flex items-center gap-4">
                            {/* Dashboard link - routes to role-specific dashboard */}
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

                            {/* Profile link */}
                            <Link to="/profile" className="flex items-center gap-2 text-sm font-medium text-foreground nav-tilt-link">
                                <User className="w-4 h-4" /> Profile
                            </Link>
                            
                            {/* Logout button */}
                            <button 
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-500/10 hover:bg-red-500/20 rounded-lg tilt-button"
                            >
                                <LogOut className="w-4 h-4" /> Logout
                            </button>
                        </div>
                    ) : (
                        // Guest user menu - login and register buttons
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

                {/* Mobile Menu Toggle Button - hamburger/X icon */}
                <button 
                    className="md:hidden p-2 text-foreground tilt-icon"
                    onClick={() => setIsMenuOpen(!isMenuOpen)} // Toggle mobile menu
                >
                    {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>


            {/* Mobile Menu - slides down when open */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-border bg-card px-6 py-4 space-y-4">
                    {/* Navigation links */}
                    <Link to="/" className="block text-sm font-medium text-muted-foreground menu-tilt">Home</Link>
                    <Link to="/courses" className="block text-sm font-medium text-muted-foreground menu-tilt">Courses</Link>
                    <Link to="/articles" className="block text-sm font-medium text-muted-foreground menu-tilt">Articles</Link>
                    {/* Games link - only for logged-in users */}
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

                    {/* Mobile auth section */}
                    <div className="pt-4 border-t border-border">
                        {user ? (
                            // Logged-in user mobile menu
                            <div className="space-y-3">
                                <Link to="/profile" className="block text-sm font-medium text-muted-foreground menu-tilt">Profile</Link>
                                {/* Role-specific dashboard link */}
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
                            // Guest user mobile menu
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