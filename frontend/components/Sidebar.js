'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BookOpenIcon } from '@heroicons/react/24/solid'

export default function Sidebar({ subjectTree, currentVideoId, subjectId }) {
  const [expandedSections, setExpandedSections] = useState({})

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  const isVideoUnlocked = (sectionIndex, videoIndex, videos) => {
    // First video is always unlocked
    if (sectionIndex === 0 && videoIndex === 0) return true

    // Check previous video in same section
    if (videoIndex > 0) {
      return videos[videoIndex - 1].is_completed
    }

    // Check last video of previous section
    const prevSection = subjectTree[sectionIndex - 1]
    if (prevSection) {
      const lastVideo = prevSection.videos[prevSection.videos.length - 1]
      return lastVideo.is_completed
    }

    return false
  }

  return (
    <div className="w-80 glass-card-sub shadow-lg h-screen overflow-y-auto border-r border-white/10">
      <div className="p-4">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center">
          <BookOpenIcon className="w-6 h-6 mr-2 text-red-400" />
          Course Content
        </h2>
        {subjectTree.map((section, sectionIndex) => (
          <div key={section.id} className="mb-4">
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full text-left p-3 rounded-xl hover:bg-white/5 transition-colors flex items-center justify-between group"
            >
              <span className="font-medium text-white group-hover:text-red-300">{section.title}</span>
              <span className="text-sm text-white/60 group-hover:text-white">
                {expandedSections[section.id] ? '−' : '+'}
              </span>
            </button>
            {expandedSections[section.id] && (
              <div className="ml-2 mt-2 space-y-1">
                {section.videos.map((video, videoIndex) => {
                  const isUnlocked = isVideoUnlocked(sectionIndex, videoIndex, section.videos)
                  const isCurrent = video.id.toString() === currentVideoId

                  return (
                    <Link
                      key={video.id}
                      href={isUnlocked ? `/subjects/${subjectId}/video/${video.id}` : '#'}
                      className={`block p-3 rounded-lg flex items-center transition-all ${
                        isCurrent
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : isUnlocked
                          ? 'hover:bg-white/5 text-white/80 hover:text-white'
                          : 'text-white/30 cursor-not-allowed'
                      }`}
                    >
                      {video.is_completed ? (
                        <span className="text-green-400 mr-2">✓</span>
                      ) : isUnlocked ? (
                        <span className={`w-4 h-4 border-2 rounded-full mr-2 inline-block ${
                          isCurrent ? 'border-red-400' : 'border-white/40'
                        }`}></span>
                      ) : (
                        <span className="text-white/30 mr-2">🔒</span>
                      )}
                      <span className="text-sm line-clamp-1">{video.title}</span>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}