'use client'
import { useAuthContext } from '@/app/provider';
import { SidebarTrigger } from '@/components/ui/sidebar'
import Image from 'next/image'
import React from 'react'

function AppHeader() {
    const {user} = useAuthContext();
  return (
    <div className='p-3 rounded-full flex justify-between items-center'>
        <SidebarTrigger/>
        {user?.pictureURL && (
        <Image
          src={user.pictureURL}
          alt='user'
          height={40}
          width={40}
          className='rounded-full'
        />
      )}
    </div>
  )
}

export default AppHeader