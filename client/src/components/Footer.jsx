import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='container px-4 2xl:p-20 mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 py-3 mt-20 text-center sm:text-left'>
        <div className="flex items-center justify-center sm:justify-start w-full sm:w-auto mb-2 sm:mb-0">
          <img src={assets.vite_logo} alt="NaukriVerse Symbol" height={40} width={40} />
          <span className="font-bold text-xl ml-2">JobMate AI</span>
        </div>
        <p className='w-full sm:flex-1 border-1 border-gray-400 pl-0 sm:pl-4 text-xs sm:text-sm text-gray-500 mb-2 sm:mb-0'>
            Copyright @dhruvjain527@gmail.com | All rights reserved.
        </p>
        <div className='flex gap-2.5 justify-center sm:justify-end w-full sm:w-auto'>
            <img width={32} src={assets.facebook_icon} alt="" />
            <img width={32} src={assets.twitter_icon} alt="" />
            <img width={32} src={assets.instagram_icon} alt="" />
        </div>
    </div>
  )
}

export default Footer