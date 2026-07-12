/**
 * Driver Service
 *
 * Pure utility functions for driver data operations.
 * All functions receive the current drivers array and return a new array,
 * keeping state management in the component layer (useState).
 *
 * Swap these implementations for API calls when the backend is ready —
 * the component layer does not need to change.
 */

import initialDrivers from '../data/drivers'

// ─── ID generation ────────────────────────────────────────────────────────────

/**
 * Returns the next available numeric ID given an existing array.
 * @param {Array} drivers
 * @returns {number}
 */
export const getNextId = (drivers) => {
  if (drivers.length === 0) return 1
  return Math.max(...drivers.map((d) => d.id)) + 1
}

// ─── Seed ─────────────────────────────────────────────────────────────────────

/**
 * Returns the initial mock dataset.
 * Call once on component mount to populate state.
 * @returns {Array}
 */
export const loadDrivers = () => [...initialDrivers]

// ─── CRUD ─────────────────────────────────────────────────────────────────────

/**
 * Adds a new driver to the list.
 * Assigns a generated ID; ignores any id in driverData.
 *
 * @param {Array}  drivers    - Current drivers array
 * @param {Object} driverData - New driver fields (no id required)
 * @returns {Array} New array with the driver appended
 */
export const addDriver = (drivers, driverData) => {
  const newDriver = {
    ...driverData,
    id: getNextId(drivers),
  }
  return [...drivers, newDriver]
}

/**
 * Updates an existing driver by id.
 * Non-matching entries are returned unchanged.
 *
 * @param {Array}  drivers    - Current drivers array
 * @param {number} id         - ID of the driver to update
 * @param {Object} driverData - Updated fields (partial or full)
 * @returns {Array} New array with the updated driver
 */
export const updateDriver = (drivers, id, driverData) => {
  return drivers.map((d) => (d.id === id ? { ...d, ...driverData, id } : d))
}

/**
 * Removes a driver by id.
 *
 * @param {Array}  drivers - Current drivers array
 * @param {number} id      - ID of the driver to remove
 * @returns {Array} New array without the deleted driver
 */
export const deleteDriver = (drivers, id) => {
  return drivers.filter((d) => d.id !== id)
}

// ─── Validation ───────────────────────────────────────────────────────────────

/**
 * Checks whether a license number is already taken.
 *
 * @param {Array}        drivers       - Current drivers array
 * @param {string}       licenseNumber - Value to check
 * @param {number|null}  excludeId     - Exclude this id (for edit mode)
 * @returns {boolean} true if the number is a duplicate
 */
export const isLicenseDuplicate = (drivers, licenseNumber, excludeId = null) => {
  return drivers.some(
    (d) =>
      d.licenseNumber.toLowerCase() === licenseNumber.toLowerCase() &&
      d.id !== excludeId,
  )
}

// ─── Search & Filter ──────────────────────────────────────────────────────────

/**
 * Filters drivers by search query (matches driver name, license number).
 *
 * @param {Array}  drivers - Drivers to search
 * @param {string} query   - Free-text query
 * @returns {Array}
 */
export const searchDrivers = (drivers, query) => {
  if (!query || query.trim() === '') return drivers
  const q = query.trim().toLowerCase()
  return drivers.filter(
    (d) =>
      d.driverName.toLowerCase().includes(q) ||
      d.licenseNumber.toLowerCase().includes(q) ||
      d.contactNumber.includes(q),
  )
}

/**
 * Filters drivers by license category and/or status.
 * Pass empty string '' to skip a filter.
 *
 * @param {Array}  drivers         - Drivers to filter
 * @param {string} licenseCategory - License category filter value
 * @param {string} status          - Status filter value
 * @returns {Array}
 */
export const filterDrivers = (drivers, licenseCategory, status) => {
  return drivers.filter((d) => {
    const matchesCategory = !licenseCategory || d.licenseCategory === licenseCategory
    const matchesStatus = !status || d.status === status
    return matchesCategory && matchesStatus
  })
}

/**
 * Sorts drivers by a given column key.
 *
 * @param {Array}  drivers  - Drivers to sort
 * @param {string} key      - Object key to sort by
 * @param {'asc'|'desc'} dir - Sort direction
 * @returns {Array} New sorted array
 */
export const sortDrivers = (drivers, key, dir) => {
  if (!key) return drivers
  return [...drivers].sort((a, b) => {
    const valA = a[key]
    const valB = b[key]
    if (typeof valA === 'number' && typeof valB === 'number') {
      return dir === 'asc' ? valA - valB : valB - valA
    }
    const strA = String(valA).toLowerCase()
    const strB = String(valB).toLowerCase()
    if (strA < strB) return dir === 'asc' ? -1 : 1
    if (strA > strB) return dir === 'asc' ? 1 : -1
    return 0
  })
}

// ─── Pagination ───────────────────────────────────────────────────────────────

/**
 * Slices a drivers array to a single page.
 *
 * @param {Array}  drivers     - Full (already filtered/sorted) array
 * @param {number} currentPage - 1-based page index
 * @param {number} pageSize    - Rows per page
 * @returns {{ pageData: Array, totalPages: number }}
 */
export const paginateDrivers = (drivers, currentPage, pageSize) => {
  const totalPages = Math.max(1, Math.ceil(drivers.length / pageSize))
  const safePage = Math.min(currentPage, totalPages)
  const start = (safePage - 1) * pageSize
  const pageData = drivers.slice(start, start + pageSize)
  return { pageData, totalPages, currentPage: safePage }
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const LICENSE_CATEGORIES = ['LMV', 'HMV', 'Transport', 'Heavy Transport']

export const DRIVER_STATUSES = ['Available', 'On Trip', 'Off Duty', 'Suspended']

/**
 * Maps a status value to a CoreUI badge color.
 * @param {string} status
 * @returns {string} CoreUI color name
 */
export const getStatusColor = (status) => {
  const map = {
    Available: 'success',
    'On Trip': 'primary',
    'Off Duty': 'secondary',
    Suspended: 'danger',
  }
  return map[status] || 'secondary'
}

/**
 * Returns badge color for safety score.
 * @param {number} score
 * @returns {string} CoreUI color name
 */
export const getSafetyScoreColor = (score) => {
  if (score >= 90) return 'success'
  if (score >= 75) return 'info'
  if (score >= 60) return 'warning'
  return 'danger'
}
