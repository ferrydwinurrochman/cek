"use client"

import type React from "react"
import { useState } from "react"
import { createUser, getAllPages } from "@/lib/auth"
import { PermissionManager } from "@/lib/permissions"
import { X, User, Mail, Phone, Lock, UserCheck, Shield } from "lucide-react"

interface UserCreationModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function UserCreationModal({ isOpen, onClose, onSuccess }: UserCreationModalProps) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    phone: "",
    email: "",
    role: "user",
    assignedPages: [] as string[],
    customPermissions: [] as string[],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const pages = getAllPages()
  const roles = PermissionManager.getAllRoles()
  const permissions = PermissionManager.getPermissionsByCategory()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const success = createUser(formData)
      if (success) {
        onSuccess()
        onClose()
        setFormData({
          username: "",
          password: "",
          name: "",
          phone: "",
          email: "",
          role: "user",
          assignedPages: [],
          customPermissions: [],
        })
      } else {
        setError("Username already exists!")
      }
    } catch (err) {
      setError("Failed to create user")
    } finally {
      setLoading(false)
    }
  }

  const handlePageToggle = (pageId: string) => {
    setFormData((prev) => ({
      ...prev,
      assignedPages: prev.assignedPages.includes(pageId)
        ? prev.assignedPages.filter((id) => id !== pageId)
        : [...prev.assignedPages, pageId],
    }))
  }

  const handlePermissionToggle = (permissionId: string) => {
    setFormData((prev) => ({
      ...prev,
      customPermissions: prev.customPermissions.includes(permissionId)
        ? prev.customPermissions.filter((id) => id !== permissionId)
        : [...prev.customPermissions, permissionId],
    }))
  }

  const selectedRole = roles.find((r) => r.id === formData.role)
  const needsPageAssignment = formData.role === "user" || formData.role === "viewer"

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Create New User</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Basic Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <User size={16} className="inline mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <UserCheck size={16} className="inline mr-2" />
                  Username
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Mail size={16} className="inline mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Phone size={16} className="inline mr-2" />
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Lock size={16} className="inline mr-2" />
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Shield size={16} className="inline mr-2" />
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedRole && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">{selectedRole.name}</h4>
                <p className="text-sm text-blue-700 dark:text-blue-400 mb-2">{selectedRole.description}</p>
                <p className="text-xs text-blue-600 dark:text-blue-500">
                  This role includes {selectedRole.permissions.length} permissions
                </p>
              </div>
            )}
          </div>

          {/* Page Assignment */}
          {needsPageAssignment && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Page Access</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Select which pages this user can access</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                {pages.map((page) => (
                  <label key={page.id} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.assignedPages.includes(page.id)}
                      onChange={() => handlePageToggle(page.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{page.title}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{page.type.toUpperCase()}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Custom Permissions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Additional Permissions</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Grant additional permissions beyond the selected role
            </p>

            <div className="space-y-4 max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              {Object.entries(permissions).map(([category, categoryPermissions]) => (
                <div key={category}>
                  <h4 className="font-medium text-gray-800 dark:text-white mb-2 capitalize">{category} Permissions</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {categoryPermissions.map((permission) => (
                      <label
                        key={permission.id}
                        className="flex items-start gap-3 cursor-pointer p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={formData.customPermissions.includes(permission.id)}
                          onChange={() => handlePermissionToggle(permission.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-800 dark:text-white text-sm">{permission.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{permission.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create User"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
