'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuthStore } from '../store/auth'
import api from '../lib/api'
import { BookOpenIcon, ClockIcon, UserGroupIcon, CurrencyDollarIcon, StarIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'

export default function CourseList() {
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user } = useAuthStore()

  useEffect(() => {
    fetchSubjects()
  }, [])

  const fetchSubjects = async () => {
    try {
      const response = await api.get('/subjects')
      setSubjects(response.data)
    } catch (err) {
      setError('Failed to load courses')
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (level) => {
    const stars = level === 'Beginner' ? 1 : level === 'Intermediate' ? 2 : 3
    return (
      <div className="flex items-center">
        {[1, 2, 3].map((star) => (
          <StarIconSolid
            key={star}
            className={`w-4 h-4 ${star <= stars ? 'text-yellow-400' : 'text-white/20'}`}
          />
        ))}
        <span className="ml-1 text-sm text-white/80">{level}</span>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="glass-card p-6 max-w-md mx-auto">
          <div className="text-red-400 text-lg font-semibold mb-2">Error Loading Courses</div>
          <div className="text-white/70">{error}</div>
          <button
            onClick={fetchSubjects}
            className="mt-4 btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {subjects.map((subject) => (
        <div key={subject.id} className="glass-card-sub group hover:scale-105 transition-all duration-300 overflow-hidden">
          {/* Course Thumbnail with Gradient Overlay */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
            <img
              src={subject.thumbnail_url || `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop`}
              alt={subject.title}
              className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute top-4 right-4 z-20">
              {subject.is_free ? (
                <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg shadow-green-500/30 border border-white/20">
                  FREE
                </span>
              ) : (
                <span className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg shadow-red-500/30 border border-white/20">
                  ${subject.price_usd}
                </span>
              )}
            </div>
            <div className="absolute bottom-4 left-4 z-20">
              <span className="bg-white/10 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs font-medium border border-white/20">
                {subject.category}
              </span>
            </div>
          </div>

          {/* Course Content */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              {renderStars(subject.level)}
              <div className="flex items-center text-white/60 text-sm">
                <ClockIcon className="w-4 h-4 mr-1" />
                {subject.duration_hours}h
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-3 line-clamp-2 leading-tight">
              {subject.title}
            </h3>

            <p className="text-white/70 text-sm mb-5 line-clamp-3 leading-relaxed">
              {subject.description}
            </p>

            <div className="flex items-center justify-between mb-5 pb-5 border-b border-white/10">
              <div className="flex items-center text-white/80 text-sm">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center mr-2">
                  <UserGroupIcon className="w-4 h-4" />
                </div>
                <span className="line-clamp-1">{subject.instructor_name}</span>
              </div>
              <div className="text-white/60 text-sm">
                📚 {subject.total_videos || 0} videos
              </div>
            </div>

            {/* Action Button */}
            <Link
              href={user ? `/subjects/${subject.id}` : '/auth/login'}
              className="w-full btn-primary flex items-center justify-center group-hover:scale-105 transition-transform relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                {user ? (
                  <>
                    <BookOpenIcon className="w-5 h-5 mr-2" />
                    {subject.is_free ? 'View Course' : 'View Course'}
                  </>
                ) : (
                  <>
                    <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
                    Login to Access
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}