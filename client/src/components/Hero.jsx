import React, { useContext, useRef } from 'react'
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const Hero = () => {
  const { setSearchFilter, setIsSearched } = useContext(AppContext);
  const titleRef = useRef(null);
  const locationRef = useRef(null);

  const OnSearch = () => {
    setSearchFilter({
      title: titleRef.current.value,
      location: locationRef.current.value,
    });
    setIsSearched(true);
    console.log({
      title: titleRef.current.value,
      location: locationRef.current.value,
    });
  };

  return (
    <div className="container 2xl:px-20 mx-auto my-6 sm:my-10 ">
      <div className="bg-gradient-to-r from-purple-800 to-purple-950 text-white py-10 sm:py-16 text-center mx-2 rounded-xl">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium mb-4">
          Multiple Jobs To Apply 
        </h2>
        <p className="mb-8 max-w-xl mx-auto text-xs sm:text-sm font-light px-2 sm:px-5">
          Your Next Big Career Move Starts Right Here - Explore the Best Job
          Opportunities And Take FirstStep Towards Your Future!
        </p>
        <div className="flex flex-col sm:flex-row sm:justify-between items-center bg-white rounded text-gray-600 max-w-xl pl-2 sm:pl-4 mx-2 sm:mx-auto gap-2 sm:gap-0">
          <div className="flex items-center w-full sm:w-auto">
            <img className="h-4 sm:h-5" src={assets.search_icon} alt="" />
            <input
              type="text"
              placeholder="Search for jobs"
              className="max-sm:text-xs p-2 rounded outline-none w-full"
              ref={titleRef}
            />
          </div>
          <div className="flex items-center w-full sm:w-auto">
            <img className="h-4 sm:h-5" src={assets.location_icon} alt="" />
            <input
              type="text"
              placeholder="Location"
              className="max-sm:text-xs p-2 rounded outline-none w-full"
              ref={locationRef}
            />
          </div>
          <button
            onClick={OnSearch}
            className="bg-blue-600 px-4 sm:px-6 py-2 text-white m-1 rounded w-full sm:w-auto"
          >
            Search
          </button>
        </div>
      </div>
      <div className="border border-gray-300 shadow-md mx-2 mt-5 p-4 sm:p-6 rounded-md flex flex-col sm:flex-row items-center gap-4 sm:gap-0">
        <div className="flex flex-wrap justify-center gap-4 lg:gap-16 items-center w-full">
          <p className="font-medium w-full sm:w-auto text-center sm:text-left">Trusted by</p>
          <img className="h-6" src={assets.microsoft_logo} alt="" />
          <img className="h-6" src={assets.walmart_logo} alt="" />
          <img className="h-6" src={assets.accenture_logo} alt="" />
          <img className="h-6" src={assets.samsung_logo} alt="" />
          <img className="h-6" src={assets.amazon_logo} alt="" />
          <img className="h-6" src={assets.adobe_logo} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
