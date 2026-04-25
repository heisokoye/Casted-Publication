// Import React library
import React from 'react'

// Define the Loader component
const Loader = () => {
  return (    
    // Main container for the loader, centered using flexbox
    <div className="flex justify-center z-50 items-center">
        {/* The spinning loader element */}
        <div className="animate-spin rounded-full h-5 w-5  border-b-2 border-black"></div>
    </div>
  )
}

// Export the Loader component as the default export
export default Loader