'use client'
import { useGetSelf } from '@/app/features/auth/authService'
import { getSession } from 'next-auth/react'
import React, { ReactNode, useEffect } from 'react'

const layout = ({ children }: { children: ReactNode }) => {
  useGetSelf()

  useEffect(() => {
    const storeToken = async () => {
      const session = await getSession()
      const token = (session?.user as { token: { token: string } })?.token
      if (token) {
        localStorage.setItem('token', JSON.stringify(token?.token))
      }
    }

    storeToken()
  }, [])

  return <div className="bg-light h-full">{children}</div>
}

export default layout
