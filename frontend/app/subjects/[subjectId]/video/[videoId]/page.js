'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuthStore } from '../../../../../store/auth'
import api from '../../../../../lib/api'
import VideoPlayer from '../../../../../components/VideoPlayer'
import Sidebar from '../../../../../components/Sidebar'
import AIAssistant from '../../../../../components/AIAssistant'
import { BookOpenIcon, CheckCircleIcon, XMarkIcon, AcademicCapIcon } from '@heroicons/react/24/solid'

export default function VideoPage() {
  const { subjectId, videoId } = useParams()
  const router = useRouter()
  const { user, accessToken } = useAuthStore()
  const [video, setVideo] = useState(null)
  const [subjectTree, setSubjectTree] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [showEnrollModal, setShowEnrollModal] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    checkEnrollmentAndFetch()
  }, [user, subjectId, videoId])

  const checkEnrollmentAndFetch = async () => {
    try {
      // Check if user is enrolled
      const enrollmentsRes = await api.get('/enrollments', {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      
      const enrolledSubjects = enrollmentsRes.data.map(enrollment => enrollment.subject_id)
      const enrolled = enrolledSubjects.includes(parseInt(subjectId))
      
      setIsEnrolled(enrolled)
      
      if (!enrolled) {
        // Show enrollment modal instead of auto-enrolling
        setShowEnrollModal(true)
      }
      
      // Fetch video and tree data (auto-enrollment happens on backend for /tree endpoint)
      const [videoRes, treeRes] = await Promise.all([
        api.get(`/videos/${videoId}`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        }),
        api.get(`/subjects/${subjectId}/tree`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
      ])
      setVideo(videoRes.data)
      setSubjectTree(treeRes.data)
    } catch (err) {
      console.error('Error:', err)
      setError('Failed to load video')
    } finally {
      setLoading(false)
    }
  }

  const handleManualEnroll = async () => {
    try {
      await api.post(`/enrollments/${subjectId}`, {}, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      
      setIsEnrolled(true)
      setShowEnrollModal(false)
      
      // Refresh data
      checkEnrollmentAndFetch()
      
      alert(`✅ Successfully enrolled in this course!`)
    } catch (err) {
      console.error('Enrollment error:', err)
      alert(err.response?.data?.error || 'Failed to enroll in course')
    }
  }

  const handleVideoComplete = async () => {
    try {
      await api.post(`/progress/videos/${videoId}`, {
        is_completed: true
      }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      // Refresh data
      fetchData()
    } catch (err) {
      console.error('Failed to update progress')
    }
  }

  const handleProgressUpdate = async (position) => {
    try {
      await api.post(`/progress/videos/${videoId}`, {
        last_position_seconds: position
      }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
    } catch (err) {
      console.error('Failed to update progress')
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-white text-xl">Loading...</div></div>
  if (error) return <div className="min-h-screen flex items-center justify-center"><div className="text-red-400 text-xl">{error}</div></div>
  if (!video) return <div className="min-h-screen flex items-center justify-center"><div className="text-white text-xl">Video not found</div></div>

  return (
    <>
      <div className="min-h-screen flex">
        <Sidebar subjectTree={subjectTree} currentVideoId={videoId} subjectId={subjectId} />
        <div className="flex-1">
          <div className="max-w-4xl mx-auto py-6 px-4">
            <VideoPlayer
              video={video}
              onComplete={handleVideoComplete}
              onProgress={handleProgressUpdate}
            />
            
            {/* Enrollment Status Banner */}
            {!isEnrolled && (
              <div className="mt-6 glass-card p-6 border-l-4 border-yellow-500">
                <div className="flex items-start space-x-4">
                  <div className="text-yellow-400 text-2xl">⚠️</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2">Not Enrolled Yet</h3>
                    <p className="text-white/70 mb-4">You need to enroll in this course to access all videos and track your progress.</p>
                    <button
                      onClick={handleManualEnroll}
                      className="btn-primary inline-flex items-center"
                    >
                      <BookOpenIcon className="w-5 h-5 mr-2" />
                      Enroll Now - It's Free!
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {isEnrolled && (
              <div className="mt-6 glass-card-sub p-4 border-l-4 border-green-500">
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="w-6 h-6 text-green-400" />
                  <span className="text-white font-medium">You're enrolled in this course! Keep learning!</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <AIAssistant video={video} />
      
      {/* Enrollment Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-8 relative animate-pulse">
            <button
              onClick={() => setShowEnrollModal(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AcademicCapIcon className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Start Your Learning Journey!</h2>
              <p className="text-white/70">Enroll in this course to unlock all videos and track your progress.</p>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3 text-white/80">
                <CheckCircleIcon className="w-5 h-5 text-green-400" />
                <span>Access to all course videos</span>
              </div>
              <div className="flex items-center space-x-3 text-white/80">
                <CheckCircleIcon className="w-5 h-5 text-green-400" />
                <span>Track your progress</span>
              </div>
              <div className="flex items-center space-x-3 text-white/80">
                <CheckCircleIcon className="w-5 h-5 text-green-400" />
                <span>Learn at your own pace</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={handleManualEnroll}
                className="btn-primary w-full py-4 text-lg font-semibold"
              >
                Enroll Now - Free
              </button>
              <button
                onClick={() => setShowEnrollModal(false)}
                className="btn-secondary w-full py-4 text-lg"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}