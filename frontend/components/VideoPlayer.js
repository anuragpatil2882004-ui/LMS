'use client'

import { useState } from 'react'
import { PlayCircleIcon, CheckCircleIcon } from '@heroicons/react/24/solid'

export default function VideoPlayer({ video, onComplete, onProgress }) {
  const [isCompleted, setIsCompleted] = useState(video.is_completed || false)

  console.log('=== VideoPlayer Debug ===')
  console.log('Video object:', video)
  console.log('YouTube URL:', video?.youtube_url)
  
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null
    
    try {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
      const match = url.match(regExp)
      
      if (match && match[2].length === 11) {
        const videoId = match[2]
        console.log('YouTube Video ID:', videoId)
        // Enhanced embed URL with better parameters
        return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&start=${video.last_position_seconds || 0}&rel=0&modestbranding=1`
      }
    } catch (e) {
      console.error('Error extracting YouTube ID:', e)
    }
    
    return null
  }

  const embedUrl = getYouTubeEmbedUrl(video.youtube_url)
  console.log('Embed URL:', embedUrl)

  if (!embedUrl) {
    return (
      <div className="bg-white shadow-xl rounded-2xl p-8 text-center">
        <div className="text-red-600 text-lg font-semibold mb-2">Invalid Video URL</div>
        <p className="text-gray-600">This video cannot be played.</p>
        {video.youtube_url && (
          <pre className="text-xs text-gray-400 mt-4 break-all bg-gray-100 p-2 rounded">{video.youtube_url}</pre>
        )}
      </div>
    )
  }

  const handleMarkComplete = () => {
    setIsCompleted(true)
    onComplete()
  }

  return (
    <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
        <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
          <PlayCircleIcon className="w-8 h-8" />
          <span>{video.title}</span>
        </h2>
      </div>

      {/* YouTube Iframe */}
      <div className="relative w-full" style={{ paddingBottom: '56.25%', height: 0 }}>
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={embedUrl}
          title={video.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          onLoad={(e) => console.log('Iframe loaded successfully')}
          onError={(e) => console.error('Iframe error:', e)}
        />
      </div>

      {/* Video Info Section */}
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Lesson Details</h3>
          {!isCompleted && (
            <button
              onClick={handleMarkComplete}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <CheckCircleIcon className="w-5 h-5" />
              <span>Mark as Complete</span>
            </button>
          )}
          {isCompleted && (
            <div className="flex items-center text-green-600">
              <CheckCircleIcon className="w-5 h-5 mr-2" />
              <span className="font-medium">Completed</span>
            </div>
          )}
        </div>
        
        {video.description && (
          <p className="text-gray-600 leading-relaxed">{video.description}</p>
        )}
      </div>
    </div>
  )
}