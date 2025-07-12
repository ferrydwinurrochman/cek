"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { UserCreationModal } from "@/components/user-creation-modal"
import { PageCreationModal } from "@/components/page-creation-modal"
import { PageEditModal } from "@/components/page-edit-modal"
import { UserSettingsModal } from "@/components/user-settings-modal"
import { RoleManagementModal } from "@/components/role-management-modal"
import { PermissionManager } from "@/lib/permissions"
import type { User, Page, ActivityLog } from "@/lib/auth"
import {
  getAllUsers,
  getAllPages,
  getDashboardStats,
  getActivityLogs,
  updateUserStatus,
  deleteUser,
  deletePage,
  getUserById,
  getPageById,
} from "@/lib/auth"
import {
  Users,
  FileText,
  BarChart3,
  UserPlus,
  CheckCircle,
  Plus,
  Activity,
  TrendingUp,
  Clock,
  Shield,
  Crown,
  Database,
  Server,
  AlertTriangle,
  Zap,
  Globe,
  Eye,
  Edit,
  ArrowLeft,
} from "lucide-react"
import { PageViewer } from "@/components/page-viewer"
import { EnhancedVisualEditor } from "@/components/enhanced-visual-editor"

interface SuperAdminDashboardProps {
  user: User
  onLogout: () => void
}

type SuperAdminPage =
  | "dashboard"
  | "users"
  | "pages"
  | "roles"
  | "system"
  | "analytics"
  | "user-detail"
  | "page-detail"
  | "page-view"
  | "user-pages"
  | "user-page-view"
  | "user-page-edit"

export default function SuperAdminDashboard({ user, onLogout }: SuperAdminDashboardProps) {
  const [currentPage, setCurrentPage] = useState<SuperAdminPage>("dashboard")
  const [users, setUsers] = useState<User[]>([])
  const [pages, setPages] = useState<Page[]>([])
  const [activities, setActivities] = useState<ActivityLog[]>([])
  const [stats, setStats] = useState<any>({})
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedPage, setSelectedPage] = useState<Page | null>(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [showPageModal, setShowPageModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [viewingPage, setViewingPage] = useState<Page | null>(null)
  const [showUserSettingsModal, setShowUserSettingsModal] = useState(false)
  const [selectedUserForSettings, setSelectedUserForSettings] = useState<User | null>(null)
  const [viewingUserPage, setViewingUserPage] = useState<{ user: User; page: Page } | null>(null)
  const [editingUserPage, setEditingUserPage] = useState<{ user: User; page: Page } | null>(null)

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const loadData = () => {
    setUsers(getAllUsers())
    setPages(getAllPages())
    setActivities(getActivityLogs(20))
    setStats(getDashboardStats())
  }

  const handleUserStatusToggle = (userId: string, currentStatus: boolean) => {
    updateUserStatus(userId, !currentStatus)
    loadData()
  }

  const handleDeleteUser = (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      deleteUser(userId)
      loadData()
    }
  }

  const handleDeletePage = (pageId: string) => {
    if (confirm("Are you sure you want to delete this page?")) {
      deletePage(pageId, user.id)
      loadData()
    }
  }

  const handleViewUser = (userId: string) => {
    const userData = getUserById(userId)
    setSelectedUser(userData)
    setCurrentPage("user-detail")
  }

  const handleViewPage = (pageId: string) => {
    const pageData = getPageById(pageId)
    setSelectedPage(pageData)
    setCurrentPage("page-detail")
  }

  const handleEditPage = (pageData: Page) => {
    setSelectedPage(pageData)
    setShowEditModal(true)
  }

  const handleViewPageContent = (page: Page) => {
    setViewingPage(page)
    setCurrentPage("page-view")
  }

  const handleUserSettings = (userData: User) => {
    setSelectedUserForSettings(userData)
    setShowUserSettingsModal(true)
  }

  const handleViewUserPage = (userData: User, page: Page) => {
    setViewingUserPage({ user: userData, page })
    setCurrentPage("user-page-view")
  }

  const handleEditUserPage = (userData: User, page: Page) => {
    setEditingUserPage({ user: userData, page })
    setCurrentPage("user-page-edit")
  }

  const sidebarItems = [
    { id: "dashboard", label: "Super Dashboard", icon: Crown },
    { id: "users", label: "User Management", icon: Users },
    { id: "pages", label: "Page Management", icon: FileText },
    { id: "roles", label: "Role & Permissions", icon: Shield },
    { id: "system", label: "System Control", icon: Server },
    { id: "analytics", label: "Advanced Analytics", icon: BarChart3 },
    { id: "user-pages", label: "User Access", icon: Database },
  ]

  const sidebar = (
    <nav className="px-4 space-y-2">
      {sidebarItems.map((item) => {
        const Icon = item.icon
        return (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id as SuperAdminPage)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
              currentPage === item.id
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                : "text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900 dark:hover:to-pink-900"
            }`}
          >
            <Icon size={20} />
            <span className="font-medium">{item.label}</span>
          </button>
        )
      })}
    </nav>
  )

  const renderContent = () => {
    switch (currentPage) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Super Admin Control Center</h2>
                  <p className="text-gray-600 dark:text-gray-400">Complete system oversight and control</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg shadow-lg">
                  <span className="text-sm font-medium">SUPER ADMIN</span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Last updated: {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>

            {/* Super Admin Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Total Users",
                  value: stats.totalUsers || 0,
                  icon: Users,
                  color: "from-blue-500 to-blue-600",
                  change: `+${stats.recentRegistrations || 0} this month`,
                  description: "All system users",
                },
                {
                  title: "System Pages",
                  value: stats.totalPages || 0,
                  icon: FileText,
                  color: "from-green-500 to-green-600",
                  change: `${stats.activePages || 0} active`,
                  description: "Dashboard pages",
                },
                {
                  title: "Active Roles",
                  value: PermissionManager.getAllRoles().length,
                  icon: Shield,
                  color: "from-purple-500 to-purple-600",
                  change: "Permission system",
                  description: "User roles defined",
                },
                {
                  title: "System Health",
                  value: "100%",
                  icon: Zap,
                  color: "from-orange-500 to-orange-600",
                  change: "All systems operational",
                  description: "Uptime status",
                },
              ].map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div
                    key={stat.title}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 animate-fade-in hover:shadow-xl transition-all duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-800 dark:text-white">{stat.value}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{stat.description}</p>
                      </div>
                      <div
                        className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center shadow-lg`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                      <TrendingUp size={14} />
                      <span>{stat.change}</span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* System Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">System Activity</h3>
                </div>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {activities.map((activity) => {
                    const activityUser = users.find((u) => u.id === activity.userId)
                    return (
                      <div
                        key={activity.id}
                        className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg"
                      >
                        <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-800 dark:text-white">
                            <span className="font-medium">{activityUser?.name || "System"}</span> {activity.details}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <Clock size={12} />
                            <span>{activity.timestamp.toLocaleString()}</span>
                            {activity.ipAddress && <span>• {activity.ipAddress}</span>}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-orange-600" />
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Quick Actions</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setShowUserModal(true)}
                    className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg"
                  >
                    <UserPlus className="w-6 h-6 mx-auto mb-2" />
                    <span className="text-sm font-medium">Add User</span>
                  </button>
                  <button
                    onClick={() => setShowPageModal(true)}
                    className="p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg"
                  >
                    <Plus className="w-6 h-6 mx-auto mb-2" />
                    <span className="text-sm font-medium">Add Page</span>
                  </button>
                  <button
                    onClick={() => setShowRoleModal(true)}
                    className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
                  >
                    <Shield className="w-6 h-6 mx-auto mb-2" />
                    <span className="text-sm font-medium">Manage Roles</span>
                  </button>
                  <button
                    onClick={() => setCurrentPage("system")}
                    className="p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg"
                  >
                    <Server className="w-6 h-6 mx-auto mb-2" />
                    <span className="text-sm font-medium">System Control</span>
                  </button>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2">System Status</h3>
                  <p className="text-purple-100">
                    All systems operational • Last check: {new Date().toLocaleTimeString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">99.9%</div>
                    <div className="text-sm text-purple-100">Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{stats.dailyTraffic || 0}</div>
                    <div className="text-sm text-purple-100">Daily Requests</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{stats.activeUsers || 0}</div>
                    <div className="text-sm text-purple-100">Active Users</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case "system":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <Server className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">System Control Panel</h2>
                  <p className="text-gray-600 dark:text-gray-400">Advanced system management and monitoring</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg">
                <span className="text-sm font-medium">SYSTEM ADMIN</span>
              </div>
            </div>

            {/* System Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white">System Health</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">All services running</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Database</span>
                    <span className="text-green-600 dark:text-green-400">Online</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">API Server</span>
                    <span className="text-green-600 dark:text-green-400">Online</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">File Storage</span>
                    <span className="text-green-600 dark:text-green-400">Online</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white">Database Status</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Performance metrics</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Connections</span>
                    <span className="text-blue-600 dark:text-blue-400">24/100</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Query Time</span>
                    <span className="text-blue-600 dark:text-blue-400">12ms avg</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Storage Used</span>
                    <span className="text-blue-600 dark:text-blue-400">2.4GB</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white">Security Alerts</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Recent security events</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Failed Logins</span>
                    <span className="text-yellow-600 dark:text-yellow-400">3 today</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Blocked IPs</span>
                    <span className="text-red-600 dark:text-red-400">2 active</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Last Scan</span>
                    <span className="text-green-600 dark:text-green-400">2h ago</span>
                  </div>
                </div>
              </div>
            </div>

            {/* System Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">System Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                  <Database className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">Backup Database</span>
                </button>
                <button className="p-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors">
                  <CheckCircle className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">Health Check</span>
                </button>
                <button className="p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/40 transition-colors">
                  <AlertTriangle className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">View Logs</span>
                </button>
                <button className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
                  <Server className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">Restart Services</span>
                </button>
              </div>
            </div>
          </div>
        )

      case "user-pages":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">User Access Control</h2>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Monitor and manage all user page access with live preview
              </div>
            </div>

            {/* Enhanced User Pages Grid with "View As User" capability */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {users
                .filter((u) => u.role === "user" || u.role === "viewer" || u.role === "editor")
                .map((userData) => (
                  <div
                    key={userData.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{userData.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{userData.username}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                            userData.role === "editor"
                              ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                              : userData.role === "viewer"
                                ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                          }`}
                        >
                          {userData.role}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            userData.isActive
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          }`}
                        >
                          {userData.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Assigned Pages</span>
                        <span className="font-medium text-gray-800 dark:text-white">
                          {userData.assignedPages?.length || 0} pages
                        </span>
                      </div>

                      {userData.assignedPages && userData.assignedPages.length > 0 ? (
                        <div className="space-y-2">
                          {userData.assignedPages.map((pageId) => {
                            const page = pages.find((p) => p.id === pageId)
                            if (!page) return null

                            return (
                              <div
                                key={pageId}
                                className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-100 dark:border-purple-800"
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                      page.type === "powerbi"
                                        ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
                                        : page.type === "spreadsheet"
                                          ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                                          : "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400"
                                    }`}
                                  >
                                    {page.type === "powerbi" ? (
                                      <BarChart3 size={14} />
                                    ) : page.type === "spreadsheet" ? (
                                      <FileText size={14} />
                                    ) : (
                                      <Globe size={14} />
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-800 dark:text-white text-sm">{page.title}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                      {page.type.toUpperCase()} • {page.subType?.toUpperCase()}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleViewUserPage(userData, page)}
                                    className="px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded hover:from-purple-600 hover:to-pink-600 transition-all duration-200 text-xs flex items-center gap-1 shadow-sm"
                                    title="View as User - Experience page exactly as they see it"
                                  >
                                    <Users size={10} />
                                    View As User
                                  </button>
                                  <button
                                    onClick={() => handleEditUserPage(userData, page)}
                                    className="px-2 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded hover:from-orange-600 hover:to-red-600 transition-all duration-200 text-xs flex items-center gap-1 shadow-sm"
                                    title="Live Edit - Modify UI/layout in real-time"
                                  >
                                    <Edit size={10} />
                                    Live Edit
                                  </button>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500 dark:text-gray-400 italic">No pages assigned</p>
                        </div>
                      )}

                      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                        <button
                          onClick={() => handleUserSettings(userData)}
                          className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors text-sm font-medium"
                        >
                          Manage Access
                        </button>
                        <button
                          onClick={() => handleViewUser(userData.id)}
                          className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
                        >
                          <Eye size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Advanced Features Panel */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Super Admin Powers</h3>
                  <p className="text-purple-100">
                    Full control over user experiences and real-time UI editing capabilities
                  </p>
                </div>
                <div className="flex items-center gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold">{users.filter((u) => u.isActive).length}</div>
                    <div className="text-sm text-purple-100">Active Users</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{pages.filter((p) => p.isActive).length}</div>
                    <div className="text-sm text-purple-100">Live Pages</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">∞</div>
                    <div className="text-sm text-purple-100">Full Access</div>
                  </div>
                </div>
              </div>
            </div>

            {users.filter((u) => u.role === "user" || u.role === "viewer" || u.role === "editor").length === 0 && (
              <div className="text-center py-12">
                <Crown className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">No Users Found</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Create users to manage their page access and experiences.
                </p>
              </div>
            )}
          </div>
        )
      case "user-page-view":
        if (!viewingUserPage) return null
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setCurrentPage("user-pages")}
                  className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">User Experience Preview</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Super Admin View • Full Control • Real-time Preview
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEditUserPage(viewingUserPage.user, viewingUserPage.page)}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-colors flex items-center gap-2 shadow-lg"
                >
                  <Edit size={16} />
                  Live Edit UI
                </button>
                <div className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-medium">
                  Super Admin
                </div>
              </div>
            </div>

            <PageViewer
              page={viewingUserPage.page}
              onBack={() => setCurrentPage("user-pages")}
              onEdit={() => handleEditUserPage(viewingUserPage.user, viewingUserPage.page)}
              canEdit={true}
              viewingAsUser={viewingUserPage.user}
              currentUser={user}
            />
          </div>
        )
      case "user-page-edit":
        if (!editingUserPage) return null
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setCurrentPage("user-pages")}
                  className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Live UI Editor: {editingUserPage.user.name}'s {editingUserPage.page.title}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Advanced Visual Editor • Drag & Drop • Real-time Changes
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full text-sm font-medium flex items-center gap-1 shadow-lg">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  Live Editing Active
                </div>
              </div>
            </div>

            <EnhancedVisualEditor
              page={editingUserPage.page}
              userId={user.id}
              user={user}
              onSave={(updatedPage) => {
                loadData()
                setCurrentPage("user-pages")
              }}
              onClose={() => setCurrentPage("user-pages")}
            />
          </div>
        )

      // Add other cases for users, pages, roles, analytics, etc. similar to admin dashboard but with super admin styling
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Crown className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Super Admin Feature</h3>
              <p className="text-gray-600 dark:text-gray-400">This feature is under development.</p>
            </div>
          </div>
        )
    }
  }

  return (
    <>
      <DashboardLayout user={user} title="Super Admin - Dashboard Shipment JNE" sidebar={sidebar} onLogout={onLogout}>
        {renderContent()}
      </DashboardLayout>

      <UserCreationModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        onSuccess={() => {
          loadData()
          setShowUserModal(false)
        }}
      />

      <PageCreationModal
        isOpen={showPageModal}
        onClose={() => setShowPageModal(false)}
        onSuccess={() => {
          loadData()
          setShowPageModal(false)
        }}
        userId={user.id}
      />

      <PageEditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={() => {
          loadData()
          setShowEditModal(false)
        }}
        page={selectedPage}
        userId={user.id}
      />

      <UserSettingsModal
        isOpen={showUserSettingsModal}
        onClose={() => setShowUserSettingsModal(false)}
        onSuccess={() => {
          loadData()
          setShowUserSettingsModal(false)
        }}
        user={selectedUserForSettings}
      />

      <RoleManagementModal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        onSuccess={() => {
          loadData()
          setShowRoleModal(false)
        }}
      />
    </>
  )
}
