import React from 'react'
import Button from '../../Buttons/Button'
import { useAppSelector } from '@/app/redux/store'

const NavRightOptions = () => {
  const { self } = useAppSelector((state) => state.auth)
  return (
    <div className="lg:flex items-center gap-6 text-black hidden">
      <p className='text-nowrap capitalize'>Welcome, {self?.user.fullName}</p>
      <Button
        height="h-[35px]"
        buttonStyle="custom"
        customClasses="text-white bg-base rounded-lg"
        label="logout"
        onClick={() => ({})}
      />
    </div>
  )
}

export default NavRightOptions
