import React, {useEffect, useState} from 'react'
import { Link, useLocation, useNavigate} from 'react-router-dom'
import { FaTimes, FaSun, FaMoon, FaBars } from 'react-icons/fa';
import "../../App.css"

/**
 * Navbar component provides navigation links and handles mobile responsiveness.
 * It dynamically changes its appearance based on the current route and user authentication status.
 */
const Navbar = ({children}) => {
    // State to control the visibility of the mobile navigation menu.
    const [isOpen, setIsOpen] = useState(false);
    // State to check if the current page is the home page.
    const[isHome, setIsHome] = useState(false);
    // State to check if the current page is the dashboard.
    const[isDashboard, setIsDashboard] = useState(false);
    // Hook to get the current location object from react-router-dom.
    const location = useLocation();
    // Hook to programmatically navigate.
    const Navigate = useNavigate();

    /**
     * Handles user logout by removing the authentication token from local storage
     * and redirecting the user to the home page.
     */
    const handleLogout = () => {
        localStorage.removeItem("authToken");
        Navigate("/");
    }

    // useEffect hook to update isHome and isDashboard states based on the current URL.
    useEffect(() => {
        setIsHome(location.pathname === "/");
        setIsDashboard(location.pathname === "/dashboard");
    }, [location]); // Re-run effect when the location changes.

   

    


    
  return (
    <div >
        {/* Main navigation bar. The text color changes based on whether it's the home page. */}
        <nav className={`${isHome? "text-orange-400": "" } w-full  backdrop-blur-xl z-50 bg-white/10  h-14 md:h-18 lg:h-18 fixed  top-0 left-0`}>
           <div className=' mx-auto pr-5  md:w-[90%] lg:w-[95%] p-2 justify-between flex items-center'>
                <div> {/* Logo Section */}
                    <Link to={"/"}>
                        <img src= "/orangeLogo.webp" alt="Casted! Publications Logo"  loading='eager' decoding='async' fetchPriority='low'
                        className=' h-10  w-25 md:w-35 lg:w-35 lg:h-auto md:h-15  '
                        width="140"
                        height="56"
                        />
                    </Link>
                </div>

                    {/* Desktop navigation links. Hidden on small screens. */}
                <div className='hidden md:flex lg:flex'>
                    {
                        // If on the dashboard, show a logout button; otherwise, show regular navigation links.
                        isDashboard  ?( <button onClick={handleLogout} className='px-4 py-2 bg-orange-400 rounded-lg font-medium cursor-pointer  text-white'> Logout </button>) :(
                        <ul className= {`${isHome ? "text-orange-400" : "text-orange-400"} font-medium flex gap-4`}>
                            <li className='transform transition-transform link-underline duration-300 hover:scale-103'> <Link to={"/"}>Home</Link></li>
                            <li className='transform transition-transform link-underline duration-300 hover:scale-103'> <Link to={"/blog"}>Blog</Link> </li>
                            <li className='transform transition-transform link-underline duration-300 hover:scale-103'><Link to={"/about"}> About</Link></li>
                            <li className='transform transition-transform link-underline duration-300 hover:scale-103'><Link to={"/admin"}> Admin</Link></li>
                            
                        </ul>

                        )
                    }
                </div>


                {/* Hamburger Menu icon for mobile view. */}
                <div className='md:hidden lg:hidden relative z-50 '>
                    <button  className="cursor-pointer" aria-label="Toggle Menu" onClick ={()=> setIsOpen(!isOpen)}>
                        {/* Toggles between FaTimes (X icon) and FaBars (hamburger icon) based on isOpen state. */}
                        {isOpen ? (
                            <FaTimes size={17} className={isHome ? 'text-orange-400' : 'text-orange-400'} />
                        ) : (
                            <FaBars size={17} className={isHome ? 'text-orange-400' : 'text-orange-400'} />
                        )}
                    </button>
                </div>

                {/* Mobile Menu Items. Hidden by default and shown when isOpen is true. */}
                <div className={` ${isOpen ? "flex" : "hidden"}  absolute text-orange-400 bg-white top-0 left-0 w-full h-screen  md:hidden lg:hidden `}>                   
                    <ul className='flex flex-col w-full  mx-auto items-center space-y-20 py-40 px-6  '>
                        {/* Mobile navigation links. Clicking a link closes the mobile menu. */}
                        <li className='font-medium transform transition-transform duration-300 hover:scale-103'> <Link to={"/"} onClick={()=> setIsOpen(false)}>Home</Link></li>
                        <li className='font-medium transform transition-transform duration-300 hover:scale-103'> <Link to={"/blog"} onClick={()=> setIsOpen(false)}>Blog</Link> </li>
                        <li className='font-medium transform transition-transform duration-300 hover:scale-103'><Link to={"/about"} onClick={()=> setIsOpen(false)}> About</Link></li>
                        <li className='font-medium transform transition-transform duration-300 hover:scale-103'><Link to={"/admin"} onClick={ ()=> setIsOpen(false)}> Admin</Link></li>
                    </ul>
                </div>

                
           </div>
        </nav>

        {/* Renders children components, typically the main content of the page, with top padding. */}
        <div className=''> {children}</div>

    </div>
  )
}

export default Navbar;