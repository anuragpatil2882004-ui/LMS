import CourseList from '../components/CourseList'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-black/50 to-pink-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 drop-shadow-lg">
              Elite<span className="text-red-400">Learn</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto drop-shadow-md">
              Master new skills with our premium learning platform. Structured courses, expert instructors, and personalized progress tracking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary text-lg">
                Start Learning Today
              </button>
              <button className="btn-secondary text-lg">
                Explore Courses
              </button>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-red-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Courses Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Featured Courses
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Choose from our carefully curated collection of premium courses designed by industry experts.
          </p>
        </div>
        <CourseList />
      </div>

      {/* Stats Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="glass-card p-8">
              <div className="text-5xl font-bold text-red-400 mb-2">500+</div>
              <div className="text-white/90">Students Enrolled</div>
            </div>
            <div className="glass-card p-8">
              <div className="text-5xl font-bold text-pink-400 mb-2">50+</div>
              <div className="text-white/90">Expert Courses</div>
            </div>
            <div className="glass-card p-8">
              <div className="text-5xl font-bold text-red-300 mb-2">24/7</div>
              <div className="text-white/90">Learning Support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}