'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '../../store/auth'
import api from '../../lib/api'
import { TrophyIcon, BookOpenIcon, PlusCircleIcon, PlayCircleIcon } from '@heroicons/react/24/solid'

export default function Dashboard() {
  const router = useRouter()
  const { user, authReady } = useAuthStore()
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [availableCourses, setAvailableCourses] = useState([])
  const [enrollingId, setEnrollingId] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authReady) return
    if (!user) { router.push('/auth/login'); return }
    fetchData()
  }, [authReady, user])

  const fetchData = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('accessToken')
      const headers = { Authorization: `Bearer ${token}` }

      const [subjectsRes, enrollmentsRes] = await Promise.all([
        api.get('/subjects'),
        api.get('/enrollments', { headers })
      ])

      const subjects = subjectsRes.data || []
      const enrollments = enrollmentsRes.data || []

      console.log('subjects:', subjects.length, 'enrollments:', enrollments.length, enrollments)

      const enrolledIds = new Set(enrollments.map(e => Number(e.subject_id)))
      setEnrolledCourses(subjects.filter(s => enrolledIds.has(Number(s.id))))
      setAvailableCourses(subjects.filter(s => !enrolledIds.has(Number(s.id))))
    } catch (err) {
      console.error('fetchData error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async (courseId) => {
    setEnrollingId(courseId)
    try {
      const token = localStorage.getItem('accessToken')
      await api.post(`/enrollments/${courseId}`, {}, { headers: { Authorization: `Bearer ${token}` } })
      await fetchData()
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to enroll')
    } finally {
      setEnrollingId(null)
    }
  }

  if (!authReady || loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-white text-xl">Loading...</div>
    </div>
  )

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="glass-card rounded-3xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-white mb-1">Welcome back, {user?.name || 'Student'}!</h1>
          <p className="text-red-200">Ready to continue your learning journey?</p>
        </div>

        {/* My Enrollments */}
        <div className="glass-card rounded-3xl p-8 mb-8">
          <div className="flex items-center mb-6">
            <TrophyIcon className="w-8 h-8 text-yellow-400 mr-3" />
            <h2 className="text-2xl font-bold text-white">My Enrollments</h2>
            <span className="ml-3 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">{enrolledCourses.length}</span>
          </div>

          {enrolledCourses.length === 0 ? (
            <div className="text-center py-10">
              <BookOpenIcon className="w-14 h-14 text-white/20 mx-auto mb-3" />
              <p className="text-white/50">No enrollments yet — enroll in a course below</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map(course => (
                <div key={course.id} onClick={() => router.push(`/subjects/${course.id}`)}
                  className="glass-card-sub rounded-2xl p-6 cursor-pointer hover:scale-105 transition-all border border-green-500/30">
                  <div className="h-24 bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl mb-4 flex items-center justify-center text-5xl">
                    {course.thumbnail_url
                      ? <img src={course.thumbnail_url} className="w-full h-full object-cover rounded-xl" alt={course.title} />
                      : '📚'}
                  </div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-base font-bold text-white flex-1">{course.title}</h3>
                    <span className="ml-2 bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">Enrolled</span>
                  </div>
                  <p className="text-white/40 text-sm line-clamp-2 mb-3">{course.description}</p>
                  <div className="flex items-center text-green-400 text-sm font-medium">
                    <PlayCircleIcon className="w-4 h-4 mr-1" /> Continue Learning
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Available Courses */}
        {availableCourses.length > 0 && (
          <div className="glass-card rounded-3xl p-8">
            <div className="flex items-center mb-6">
              <PlusCircleIcon className="w-8 h-8 text-blue-400 mr-3" />
              <h2 className="text-2xl font-bold text-white">Available Courses</h2>
              <span className="ml-3 bg-blue-500 text-white text-sm font-bold px-3 py-1 rounded-full">{availableCourses.length}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableCourses.map(course => (
                <div key={course.id} className="glass-card-sub rounded-2xl p-6 border border-white/10">
                  <div className="h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl mb-4 flex items-center justify-center text-5xl overflow-hidden">
                    {course.thumbnail_url
                      ? <img src={course.thumbnail_url} className="w-full h-full object-cover rounded-xl" alt={course.title} />
                      : '📖'}
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">{course.title}</h3>
                  {course.instructor_name && <p className="text-white/30 text-xs mb-2">by {course.instructor_name}</p>}
                  <p className="text-white/40 text-sm line-clamp-2 mb-4">{course.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-green-400 text-sm font-semibold">{course.is_free ? 'Free' : `$${course.price_usd}`}</span>
                    <button onClick={() => handleEnroll(course.id)} disabled={enrollingId === course.id}
                      className="bg-gradient-to-r from-red-500 to-pink-600 text-white text-sm px-4 py-2 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50">
                      {enrollingId === course.id ? 'Enrolling...' : 'Enroll Now'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
