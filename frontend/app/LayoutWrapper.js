'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAuthStore } from '../store/auth'
import AIAssistant from '../components/AIAssistant'
import {
  HomeIcon,
  ChartBarIcon,
  AcademicCapIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'

export default function LayoutWrapper({ children }) {
  const pathname = usePathname()
  const { user, logout, initializeAuth } = useAuthStore()
  const [selectedVideo, setSelectedVideo] = useState(null)

  useEffect(() => {
    initializeAuth()
  }, [])

  // Hide navigation on auth pages
  const isAuthPage = pathname?.startsWith('/auth')
  const isHomePage = pathname === '/'

  // Get current video for AI Assistant when on video page
  useEffect(() => {
    if (pathname?.includes('/video/')) {
      // Extract video ID from URL - this is a simplified approach
      const match = pathname.match(/\/video\/(\d+)/)
      if (match) {
        setSelectedVideo({ id: match[1], title: 'Current Lesson' })
      }
    } else {
      setSelectedVideo(null)
    }
  }, [pathname])

  if (isAuthPage) {
    return (
      <>
        {children}
        <AIAssistant video={selectedVideo} />
      </>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar Navigation */}
      {!isHomePage && (
        <div className="w-64 glass-card-sub fixed h-full left-0 top-0 z-40">
          <div className="p-6">
            <Link href="/" className="flex items-center space-x-2 mb-8">
              <AcademicCapIcon className="w-10 h-10 text-red-400" />
              <span className="text-2xl font-bold text-white">EliteLearn</span>
            </Link>

            <nav className="space-y-2">
              <Link
                href="/"
                className={`sidebar-item ${pathname === '/' ? 'active' : ''}`}
              >
                <HomeIcon className="w-5 h-5 mr-3" />
                <span>Home</span>
              </Link>

              {user && (
                <>
                  <Link
                    href="/dashboard"
                    className={`sidebar-item ${pathname === '/dashboard' ? 'active' : ''}`}
                  >
                    <ChartBarIcon className="w-5 h-5 mr-3" />
                    <span>Dashboard</span>
                  </Link>

                  <Link
                    href="/profile"
                    className={`sidebar-item ${pathname === '/profile' ? 'active' : ''}`}
                  >
                    <UserCircleIcon className="w-5 h-5 mr-3" />
                    <span>Profile</span>
                  </Link>

                  <button
                    onClick={() => logout()}
                    className="sidebar-item w-full text-left"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                    <span>Logout</span>
                  </button>
                </>
              )}

              {!user && (
                <>
                  <Link
                    href="/auth/login"
                    className="sidebar-item"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                    <span>Login</span>
                  </Link>

                  <Link
                    href="/auth/register"
                    className="sidebar-item"
                  >
                    <UserCircleIcon className="w-5 h-5 mr-3" />
                    <span>Register</span>
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`flex-1 ${!isHomePage ? 'ml-64' : ''}`}>
        {children}
      </div>

      {/* AI Assistant - Available on all pages */}
      <AIAssistant video={selectedVideo} />
    </div>
  )
}
