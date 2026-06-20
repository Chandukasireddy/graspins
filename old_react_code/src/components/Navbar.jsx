import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { close, logo, menu } from '../assets'
import { navLinks } from '../constants'

const Navbar = () => {
  const [toggle, setToggle] = useState(false)
  const location = useLocation()

  const isHomePage = location.pathname === '/'

  return (
    <nav className='w-full flex py-6 justify-between items-center navbar'>
      <Link to="/">
        <img src={logo} alt='Graspins' className='w-[200px] h-[60px] cursor-pointer'/>
      </Link>
      <ul className='list-none sm:flex hidden justify-end items-center flex-1'>
        {isHomePage ? (
          navLinks.map((nav, i) => (
            <li 
              key={nav.id}
              className={`font-poppins font-normal cursor-pointer text-[16px] ${i === navLinks.length - 1 ? 'mr-0' : 'mr-10'} text-white`}
            >
              <a href={`#${nav.id}`}>
                {nav.title}
              </a>
            </li>        
          ))
        ) : (
          <li className='font-poppins font-normal cursor-pointer text-[16px] text-white'>
            <Link to="/">Home</Link>
          </li>
        )}
      </ul>
      <div className='sm:hidden flex flex-1 justify-end items-center'>
        <img
          src={toggle ? close : menu}
          alt='menu'
          className='w-[28px] h-[28px] object-contain'
          onClick={() => setToggle((previous) => !previous)}
        />
        <div className={`${toggle ? 'flex' : 'hidden'} p-6 bg-black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] rounded-xl sidebar`}>
          <ul className='list-none flex flex-col justify-end items-center flex-1'>
            {isHomePage ? (
              navLinks.map((nav, i) => (
                <li 
                  key={nav.id}
                  className={`font-poppins font-normal cursor-pointer text-[16px] ${i === navLinks.length - 1 ? 'mr-0' : 'mb-4'} text-white`}
                >
                  <a href={`#${nav.id}`}>
                    {nav.title}
                  </a>
                </li>        
              ))
            ) : (
              <li className='font-poppins font-normal cursor-pointer text-[16px] text-white mb-4'>
                <Link to="/">Home</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
