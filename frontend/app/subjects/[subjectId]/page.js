'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuthStore } from '../../../store/auth'
import api from '../../../lib/api'
import { ClockIcon, UserGroupIcon, BookOpenIcon, PlayCircleIcon, CheckCircleIcon } from '@heroicons/react/24/solid'

export default function SubjectDetail() {
  const { subjectId } = useParams()
  const router = useRouter()
  const { user, accessToken } = useAuthStore()
  const [subject, setSubject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [courseTree, setCourseTree] = useState([])
  const [totalVideos, setTotalVideos] = useState(0)

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    fetchSubject()
  }, [user, subjectId])

  const fetchSubject = async () => {
    try {
      const response = await api.get(`/subjects/${subjectId}`)
      setSubject(response.data)
      
      // Fetch course tree to show preview
      const treeResponse = await api.get(`/subjects/${subjectId}/tree`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      setCourseTree(treeResponse.data)
      
      // Count total videos
      const total = treeResponse.data.reduce((acc, section) => acc + (section.videos?.length || 0), 0)
      setTotalVideos(total)
    } catch (err) {
      setError('Failed to load course details')
    } finally {
      setLoading(false)
    }
  }

  const handleStartCourse = async () => {
    try {
      console.log('Starting course:', subjectId)
      console.log('Access token:', accessToken)
      
      const response = await api.get(`/subjects/${subjectId}/first-video`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      
      console.log('First video response:', response.data)
      
      const firstVideo = response.data
      router.push(`/subjects/${subjectId}/video/${firstVideo.id}`)
    } catch (err) {
      console.error('Error starting course:', err)
      console.error('Error response:', err.response?.data)
      
      // Show specific error message
      let errorMsg = 'Failed to start course. '
      
      if (err.response?.status === 401) {
        errorMsg += 'Please login again.'
      } else if (err.response?.status === 403) {
        errorMsg += 'Access denied. Please subscribe to this course.'
      } else if (err.response?.status === 404) {
        errorMsg += 'No videos found in this course.'
      } else if (err.response?.data?.error) {
        errorMsg += err.response.data.error
      } else {
        errorMsg += 'Please try again or contact support.'
      }
      
      setError(errorMsg)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-500"></div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 max-w-md mx-auto text-center">
          <div className="text-red-400 text-lg font-semibold mb-2">Error</div>
          <div className="text-white/70">{error}</div>
          <button
            onClick={() => router.push('/')}
            className="mt-4 btn-primary"
          >
            Back to Courses
          </button>
        </div>
      </div>
    )
  }
  
  if (!subject) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Course Not Found</h2>
          <button
            onClick={() => router.push('/')}
            className="btn-primary"
          >
            Back to Courses
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-black/50 to-pink-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="bg-red-500/20 backdrop-blur-sm text-red-300 px-3 py-1 rounded-full text-sm font-semibold border border-white/10">
                  {subject.category}
                </span>
                <span className="bg-yellow-500/20 backdrop-blur-sm text-yellow-300 px-3 py-1 rounded-full text-sm font-semibold border border-white/10">
                  {subject.level}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                {subject.title}
              </h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                {subject.description}
              </p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center space-x-2 text-white/90">
                  <UserGroupIcon className="w-5 h-5" />
                  <span>{subject.instructor_name}</span>
                </div>
                <div className="flex items-center space-x-2 text-white/90">
                  <ClockIcon className="w-5 h-5" />
                  <span>{subject.duration_hours} hours</span>
                </div>
                <div className="flex items-center space-x-2 text-white/90">
                  <BookOpenIcon className="w-5 h-5" />
                  <span>{totalVideos} lessons</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleStartCourse}
                  className="inline-flex items-center justify-center space-x-2 btn-primary text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
                >
                  <PlayCircleIcon className="w-6 h-6" />
                  <span>{subject.is_free ? 'Start Learning Free' : 'Start Learning'}</span>
                </button>
                {subject.is_free && (
                  <div className="inline-flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-xl font-semibold text-lg shadow-lg border border-white/20">
                    <CheckCircleIcon className="w-6 h-6 mr-2" />
                    <span>FREE Course</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="glass-card p-8">
                <img
                  src={subject.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'}
                  alt={subject.title}
                  className="w-full h-64 object-cover rounded-xl shadow-lg mb-6"
                />
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-white">
                    <span className="text-sm font-medium">Course Price</span>
                    <span className="text-2xl font-bold">
                      {subject.is_free ? 'FREE' : `$${subject.price_usd}`}
                    </span>
                  </div>
                  <div className="h-px bg-white/20"></div>
                  <div className="text-sm text-white/70">
                    Lifetime access • Certificate of completion • Mobile friendly
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content Preview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-white mb-8">What You'll Learn</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courseTree.slice(0, 6).map((section, idx) => (
            <div key={section.id} className="glass-card-sub p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {idx + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">{section.title}</h3>
                  <p className="text-sm text-white/60">
                    {section.videos?.length || 0} lesson{(section.videos?.length || 0) !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Instructor Info */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Your Instructor</h2>
            <div className="flex items-center justify-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {subject.instructor_name?.charAt(0) || 'I'}
              </div>
              <div>
                <div className="text-xl font-semibold text-white">{subject.instructor_name}</div>
                <div className="text-white/70">Expert Instructor</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}