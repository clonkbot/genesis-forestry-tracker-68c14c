import { useState, useEffect } from 'react'
import './styles.css'

interface TreeRecord {
  id: string
  species: string
  datePlanted: string
  location: string
  height: number
  health: 'excellent' | 'good' | 'fair' | 'poor'
  notes: string
}

interface Activity {
  id: string
  type: 'planting' | 'watering' | 'pruning' | 'inspection' | 'harvest'
  date: string
  description: string
  treeId?: string
}

const defaultTrees: TreeRecord[] = [
  { id: '1', species: 'Douglas Fir', datePlanted: '2024-03-15', location: 'North Ridge - Block A', height: 2.4, health: 'excellent', notes: 'Strong growth pattern' },
  { id: '2', species: 'Western Red Cedar', datePlanted: '2024-02-20', location: 'Valley Floor - Block C', height: 1.8, health: 'good', notes: 'Adapting well to soil' },
  { id: '3', species: 'Sitka Spruce', datePlanted: '2024-01-10', location: 'Coastal Section - Block B', height: 3.1, health: 'excellent', notes: 'Excellent moisture retention' },
  { id: '4', species: 'Western Hemlock', datePlanted: '2023-11-05', location: 'North Ridge - Block A', height: 2.9, health: 'fair', notes: 'Needs additional nutrients' },
  { id: '5', species: 'Noble Fir', datePlanted: '2024-04-02', location: 'Highland Area - Block D', height: 1.2, health: 'good', notes: 'Recently transplanted' },
]

const defaultActivities: Activity[] = [
  { id: '1', type: 'inspection', date: '2024-04-10', description: 'Quarterly health assessment of Block A completed', treeId: '1' },
  { id: '2', type: 'watering', date: '2024-04-08', description: 'Irrigation system check and manual watering of new plantings' },
  { id: '3', type: 'planting', date: '2024-04-02', description: 'Planted 15 Noble Fir saplings in Highland Area', treeId: '5' },
  { id: '4', type: 'pruning', date: '2024-03-28', description: 'Removed dead branches from mature specimens in Block C' },
]

const healthColors = {
  excellent: 'bg-emerald-500',
  good: 'bg-lime-500',
  fair: 'bg-amber-500',
  poor: 'bg-red-500',
}

const activityIcons = {
  planting: '🌱',
  watering: '💧',
  pruning: '✂️',
  inspection: '🔍',
  harvest: '🪵',
}

function App() {
  const [trees, setTrees] = useState<TreeRecord[]>(defaultTrees)
  const [activities, setActivities] = useState<Activity[]>(defaultActivities)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'trees' | 'activities' | 'add'>('dashboard')
  const [showAddTree, setShowAddTree] = useState(false)
  const [showAddActivity, setShowAddActivity] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const stats = {
    totalTrees: trees.length,
    healthyTrees: trees.filter(t => t.health === 'excellent' || t.health === 'good').length,
    recentActivities: activities.filter(a => {
      const activityDate = new Date(a.date)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return activityDate >= weekAgo
    }).length,
    avgHeight: (trees.reduce((acc, t) => acc + t.height, 0) / trees.length).toFixed(1),
  }

  const filteredTrees = trees.filter(tree =>
    tree.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tree.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddTree = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newTree: TreeRecord = {
      id: Date.now().toString(),
      species: formData.get('species') as string,
      datePlanted: formData.get('datePlanted') as string,
      location: formData.get('location') as string,
      height: parseFloat(formData.get('height') as string),
      health: formData.get('health') as TreeRecord['health'],
      notes: formData.get('notes') as string,
    }
    setTrees([newTree, ...trees])
    setShowAddTree(false)
    e.currentTarget.reset()
  }

  const handleAddActivity = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newActivity: Activity = {
      id: Date.now().toString(),
      type: formData.get('type') as Activity['type'],
      date: formData.get('date') as string,
      description: formData.get('description') as string,
    }
    setActivities([newActivity, ...activities])
    setShowAddActivity(false)
    e.currentTarget.reset()
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-stone-900 via-stone-800 to-emerald-950 text-stone-100 transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      {/* Texture overlay */}
      <div className="fixed inset-0 bg-noise opacity-[0.03] pointer-events-none" />

      {/* Decorative elements */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-80 h-80 bg-lime-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="relative border-b border-stone-700/50 backdrop-blur-sm bg-stone-900/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-lime-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <span className="text-xl sm:text-2xl">🌲</span>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight font-display">Genesis Forestry</h1>
                <p className="text-stone-400 text-xs sm:text-sm tracking-wide">Sustainable Forest Management</p>
              </div>
            </div>
            <nav className="flex gap-1 sm:gap-2 bg-stone-800/50 rounded-xl p-1 overflow-x-auto">
              {(['dashboard', 'trees', 'activities'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                    activeTab === tab
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                      : 'text-stone-400 hover:text-stone-200 hover:bg-stone-700/50'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24">
        {activeTab === 'dashboard' && (
          <div className="space-y-6 sm:space-y-8 animate-fadeIn">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              <StatCard
                label="Total Trees"
                value={stats.totalTrees}
                icon="🌲"
                gradient="from-emerald-500/20 to-emerald-600/10"
              />
              <StatCard
                label="Healthy Trees"
                value={stats.healthyTrees}
                icon="✨"
                gradient="from-lime-500/20 to-lime-600/10"
              />
              <StatCard
                label="This Week"
                value={stats.recentActivities}
                icon="📋"
                gradient="from-amber-500/20 to-amber-600/10"
                suffix=" activities"
              />
              <StatCard
                label="Avg Height"
                value={stats.avgHeight}
                icon="📏"
                gradient="from-sky-500/20 to-sky-600/10"
                suffix="m"
              />
            </div>

            {/* Recent Activity & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="lg:col-span-2 bg-stone-800/40 backdrop-blur-sm rounded-2xl border border-stone-700/50 p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  Recent Activity
                </h2>
                <div className="space-y-3">
                  {activities.slice(0, 4).map((activity, idx) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-stone-700/30 rounded-xl hover:bg-stone-700/50 transition-colors"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <span className="text-xl sm:text-2xl">{activityIcons[activity.type]}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-stone-200 text-sm sm:text-base">{activity.description}</p>
                        <p className="text-stone-500 text-xs mt-1">{new Date(activity.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-900/40 to-stone-800/40 backdrop-blur-sm rounded-2xl border border-emerald-700/30 p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-semibold mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => { setActiveTab('trees'); setShowAddTree(true); }}
                    className="w-full px-4 py-3 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-medium transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5 text-sm sm:text-base"
                  >
                    🌱 Add New Tree
                  </button>
                  <button
                    onClick={() => { setActiveTab('activities'); setShowAddActivity(true); }}
                    className="w-full px-4 py-3 bg-stone-700 hover:bg-stone-600 text-stone-200 rounded-xl font-medium transition-all hover:-translate-y-0.5 text-sm sm:text-base"
                  >
                    📝 Log Activity
                  </button>
                  <button
                    onClick={() => setActiveTab('trees')}
                    className="w-full px-4 py-3 bg-stone-700/50 hover:bg-stone-700 text-stone-300 rounded-xl font-medium transition-all text-sm sm:text-base"
                  >
                    🔍 View All Trees
                  </button>
                </div>
              </div>
            </div>

            {/* Health Overview */}
            <div className="bg-stone-800/40 backdrop-blur-sm rounded-2xl border border-stone-700/50 p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold mb-4">Forest Health Overview</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {(['excellent', 'good', 'fair', 'poor'] as const).map((health) => {
                  const count = trees.filter(t => t.health === health).length
                  const percentage = ((count / trees.length) * 100).toFixed(0)
                  return (
                    <div key={health} className="bg-stone-700/30 rounded-xl p-3 sm:p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-3 h-3 rounded-full ${healthColors[health]}`} />
                        <span className="text-stone-300 capitalize text-sm sm:text-base">{health}</span>
                      </div>
                      <p className="text-xl sm:text-2xl font-bold text-stone-100">{count}</p>
                      <p className="text-stone-500 text-xs sm:text-sm">{percentage}% of total</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trees' && (
          <div className="space-y-4 sm:space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold">Tree Registry</h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search trees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-stone-800/60 border border-stone-700 rounded-xl text-stone-200 placeholder-stone-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors text-sm sm:text-base"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500">🔍</span>
                </div>
                <button
                  onClick={() => setShowAddTree(true)}
                  className="px-4 sm:px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-medium transition-all shadow-lg shadow-emerald-500/20 text-sm sm:text-base"
                >
                  + Add Tree
                </button>
              </div>
            </div>

            {showAddTree && (
              <div className="bg-stone-800/60 backdrop-blur-sm rounded-2xl border border-stone-700/50 p-4 sm:p-6 animate-slideDown">
                <h3 className="text-base sm:text-lg font-semibold mb-4">Add New Tree</h3>
                <form onSubmit={handleAddTree} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    name="species"
                    type="text"
                    placeholder="Species"
                    required
                    className="px-4 py-2.5 bg-stone-700/50 border border-stone-600 rounded-xl text-stone-200 placeholder-stone-500 focus:outline-none focus:border-emerald-500 text-sm sm:text-base"
                  />
                  <input
                    name="location"
                    type="text"
                    placeholder="Location"
                    required
                    className="px-4 py-2.5 bg-stone-700/50 border border-stone-600 rounded-xl text-stone-200 placeholder-stone-500 focus:outline-none focus:border-emerald-500 text-sm sm:text-base"
                  />
                  <input
                    name="datePlanted"
                    type="date"
                    required
                    className="px-4 py-2.5 bg-stone-700/50 border border-stone-600 rounded-xl text-stone-200 focus:outline-none focus:border-emerald-500 text-sm sm:text-base"
                  />
                  <input
                    name="height"
                    type="number"
                    step="0.1"
                    placeholder="Height (m)"
                    required
                    className="px-4 py-2.5 bg-stone-700/50 border border-stone-600 rounded-xl text-stone-200 placeholder-stone-500 focus:outline-none focus:border-emerald-500 text-sm sm:text-base"
                  />
                  <select
                    name="health"
                    required
                    className="px-4 py-2.5 bg-stone-700/50 border border-stone-600 rounded-xl text-stone-200 focus:outline-none focus:border-emerald-500 text-sm sm:text-base"
                  >
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                  <input
                    name="notes"
                    type="text"
                    placeholder="Notes (optional)"
                    className="px-4 py-2.5 bg-stone-700/50 border border-stone-600 rounded-xl text-stone-200 placeholder-stone-500 focus:outline-none focus:border-emerald-500 text-sm sm:text-base"
                  />
                  <div className="sm:col-span-2 flex gap-3 justify-end">
                    <button
                      type="button"
                      onClick={() => setShowAddTree(false)}
                      className="px-4 sm:px-6 py-2.5 bg-stone-700 hover:bg-stone-600 text-stone-300 rounded-xl font-medium transition-colors text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 sm:px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-medium transition-colors text-sm sm:text-base"
                    >
                      Add Tree
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid gap-3 sm:gap-4">
              {filteredTrees.map((tree, idx) => (
                <div
                  key={tree.id}
                  className="bg-stone-800/40 backdrop-blur-sm rounded-2xl border border-stone-700/50 p-4 sm:p-6 hover:border-emerald-700/50 transition-all hover:shadow-lg hover:shadow-emerald-900/20"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-emerald-500/20 to-lime-500/10 flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0">
                        🌲
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-stone-100 text-base sm:text-lg">{tree.species}</h3>
                        <p className="text-stone-400 text-xs sm:text-sm truncate">{tree.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm ml-16 sm:ml-0">
                      <div className="text-center">
                        <p className="text-stone-500">Height</p>
                        <p className="font-semibold text-stone-200">{tree.height}m</p>
                      </div>
                      <div className="text-center">
                        <p className="text-stone-500">Planted</p>
                        <p className="font-semibold text-stone-200">{new Date(tree.datePlanted).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${healthColors[tree.health]}`} />
                        <span className="capitalize text-stone-300 hidden sm:inline">{tree.health}</span>
                      </div>
                    </div>
                  </div>
                  {tree.notes && (
                    <p className="mt-3 text-stone-500 text-xs sm:text-sm ml-16 sm:ml-0">{tree.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'activities' && (
          <div className="space-y-4 sm:space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold">Activity Log</h2>
              <button
                onClick={() => setShowAddActivity(true)}
                className="px-4 sm:px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-medium transition-all shadow-lg shadow-emerald-500/20 text-sm sm:text-base"
              >
                + Log Activity
              </button>
            </div>

            {showAddActivity && (
              <div className="bg-stone-800/60 backdrop-blur-sm rounded-2xl border border-stone-700/50 p-4 sm:p-6 animate-slideDown">
                <h3 className="text-base sm:text-lg font-semibold mb-4">Log New Activity</h3>
                <form onSubmit={handleAddActivity} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <select
                    name="type"
                    required
                    className="px-4 py-2.5 bg-stone-700/50 border border-stone-600 rounded-xl text-stone-200 focus:outline-none focus:border-emerald-500 text-sm sm:text-base"
                  >
                    <option value="planting">🌱 Planting</option>
                    <option value="watering">💧 Watering</option>
                    <option value="pruning">✂️ Pruning</option>
                    <option value="inspection">🔍 Inspection</option>
                    <option value="harvest">🪵 Harvest</option>
                  </select>
                  <input
                    name="date"
                    type="date"
                    required
                    className="px-4 py-2.5 bg-stone-700/50 border border-stone-600 rounded-xl text-stone-200 focus:outline-none focus:border-emerald-500 text-sm sm:text-base"
                  />
                  <textarea
                    name="description"
                    placeholder="Description"
                    required
                    rows={3}
                    className="sm:col-span-2 px-4 py-2.5 bg-stone-700/50 border border-stone-600 rounded-xl text-stone-200 placeholder-stone-500 focus:outline-none focus:border-emerald-500 resize-none text-sm sm:text-base"
                  />
                  <div className="sm:col-span-2 flex gap-3 justify-end">
                    <button
                      type="button"
                      onClick={() => setShowAddActivity(false)}
                      className="px-4 sm:px-6 py-2.5 bg-stone-700 hover:bg-stone-600 text-stone-300 rounded-xl font-medium transition-colors text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 sm:px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-medium transition-colors text-sm sm:text-base"
                    >
                      Log Activity
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="space-y-3 sm:space-y-4">
              {activities.map((activity, idx) => (
                <div
                  key={activity.id}
                  className="bg-stone-800/40 backdrop-blur-sm rounded-2xl border border-stone-700/50 p-4 sm:p-6 hover:border-emerald-700/50 transition-all"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-stone-700/50 to-stone-800/50 flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0">
                      {activityIcons[activity.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                        <h3 className="font-semibold text-stone-100 capitalize text-base sm:text-lg">{activity.type}</h3>
                        <span className="text-stone-500 text-xs sm:text-sm">
                          {new Date(activity.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-stone-400 mt-1 text-sm sm:text-base">{activity.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 py-3 sm:py-4 bg-stone-900/80 backdrop-blur-sm border-t border-stone-800/50">
        <p className="text-center text-stone-600 text-xs">
          Requested by <span className="text-stone-500">@Salmong</span> · Built by <span className="text-stone-500">@clonkbot</span>
        </p>
      </footer>
    </div>
  )
}

function StatCard({ label, value, icon, gradient, suffix = '' }: { label: string; value: number | string; icon: string; gradient: string; suffix?: string }) {
  return (
    <div className={`bg-gradient-to-br ${gradient} backdrop-blur-sm rounded-2xl border border-stone-700/30 p-4 sm:p-6 hover:scale-[1.02] transition-transform`}>
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <span className="text-stone-400 text-xs sm:text-sm">{label}</span>
        <span className="text-xl sm:text-2xl">{icon}</span>
      </div>
      <p className="text-2xl sm:text-3xl font-bold text-stone-100">
        {value}{suffix}
      </p>
    </div>
  )
}

export default App
