/**
 * Vehicle Service
 *
 * Pure utility functions for vehicle data operations.
 * All functions receive the current vehicles array and return a new array,
 * keeping state management in the component layer (useState).
 *
 * Swap these implementations for API calls when the backend is ready —
 * the component layer does not need to change.
 */

import initialVehicles from '../data/vehicles'

// ─── ID generation ────────────────────────────────────────────────────────────

/**
 * Returns the next available numeric ID given an existing array.
 * @param {Array} vehicles
 * @returns {number}
 */
export const getNextId = (vehicles) => {
  if (vehicles.length === 0) return 1
  return Math.max(...vehicles.map((v) => v.id)) + 1
}

// ─── Seed ─────────────────────────────────────────────────────────────────────

/**
 * Returns the initial mock dataset.
 * Call once on component mount to populate state.
 * @returns {Array}
 */
export const loadVehicles = () => [...initialVehicles]

// ─── CRUD ─────────────────────────────────────────────────────────────────────

/**
 * Adds a new vehicle to the list.
 * Assigns a generated ID; ignores any id in vehicleData.
 *
 * @param {Array}  vehicles    - Current vehicles array
 * @param {Object} vehicleData - New vehicle fields (no id required)
 * @returns {Array} New array with the vehicle appended
 */
export const addVehicle = (vehicles, vehicleData) => {
  const newVehicle = {
    ...vehicleData,
    id: getNextId(vehicles),
  }
  return [...vehicles, newVehicle]
}

/**
 * Updates an existing vehicle by id.
 * Non-matching entries are returned unchanged.
 *
 * @param {Array}  vehicles    - Current vehicles array
 * @param {number} id          - ID of the vehicle to update
 * @param {Object} vehicleData - Updated fields (partial or full)
 * @returns {Array} New array with the updated vehicle
 */
export const updateVehicle = (vehicles, id, vehicleData) => {
  return vehicles.map((v) => (v.id === id ? { ...v, ...vehicleData, id } : v))
}

/**
 * Removes a vehicle by id.
 *
 * @param {Array}  vehicles - Current vehicles array
 * @param {number} id       - ID of the vehicle to remove
 * @returns {Array} New array without the deleted vehicle
 */
export const deleteVehicle = (vehicles, id) => {
  return vehicles.filter((v) => v.id !== id)
}

// ─── Validation ───────────────────────────────────────────────────────────────

/**
 * Checks whether a registration number is already taken.
 *
 * @param {Array}        vehicles           - Current vehicles array
 * @param {string}       registrationNumber - Value to check
 * @param {number|null}  excludeId          - Exclude this id (for edit mode)
 * @returns {boolean} true if the number is a duplicate
 */
export const isRegistrationDuplicate = (vehicles, registrationNumber, excludeId = null) => {
  return vehicles.some(
    (v) =>
      v.registrationNumber.toLowerCase() === registrationNumber.toLowerCase() &&
      v.id !== excludeId,
  )
}

// ─── Search & Filter ──────────────────────────────────────────────────────────

/**
 * Filters vehicles by search query (matches registration number, name, or model).
 *
 * @param {Array}  vehicles - Vehicles to search
 * @param {string} query    - Free-text query
 * @returns {Array}
 */
export const searchVehicles = (vehicles, query) => {
  if (!query || query.trim() === '') return vehicles
  const q = query.trim().toLowerCase()
  return vehicles.filter(
    (v) =>
      v.registrationNumber.toLowerCase().includes(q) ||
      v.vehicleName.toLowerCase().includes(q) ||
      v.vehicleModel.toLowerCase().includes(q),
  )
}

/**
 * Filters vehicles by type and/or status.
 * Pass empty string '' to skip a filter.
 *
 * @param {Array}  vehicles - Vehicles to filter
 * @param {string} type     - Vehicle type filter value
 * @param {string} status   - Status filter value
 * @returns {Array}
 */
export const filterVehicles = (vehicles, type, status) => {
  return vehicles.filter((v) => {
    const matchesType = !type || v.vehicleType === type
    const matchesStatus = !status || v.status === status
    return matchesType && matchesStatus
  })
}

/**
 * Sorts vehicles by a given column key.
 *
 * @param {Array}  vehicles  - Vehicles to sort
 * @param {string} key       - Object key to sort by
 * @param {'asc'|'desc'} dir - Sort direction
 * @returns {Array} New sorted array
 */
export const sortVehicles = (vehicles, key, dir) => {
  if (!key) return vehicles
  return [...vehicles].sort((a, b) => {
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
 * Slices a vehicles array to a single page.
 *
 * @param {Array}  vehicles    - Full (already filtered/sorted) array
 * @param {number} currentPage - 1-based page index
 * @param {number} pageSize    - Rows per page
 * @returns {{ pageData: Array, totalPages: number }}
 */
export const paginateVehicles = (vehicles, currentPage, pageSize) => {
  const totalPages = Math.max(1, Math.ceil(vehicles.length / pageSize))
  const safePage = Math.min(currentPage, totalPages)
  const start = (safePage - 1) * pageSize
  const pageData = vehicles.slice(start, start + pageSize)
  return { pageData, totalPages, currentPage: safePage }
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const VEHICLE_TYPES = ['Truck', 'Van', 'Bus', 'Mini Truck', 'Trailer']

export const VEHICLE_STATUSES = ['Available', 'On Trip', 'In Shop', 'Retired']

/**
 * Maps a status value to a CoreUI badge color.
 * @param {string} status
 * @returns {string} CoreUI color name
 */
export const getStatusColor = (status) => {
  const map = {
    Available: 'success',
    'On Trip': 'primary',
    'In Shop': 'warning',
    Retired: 'danger',
  }
  return map[status] || 'secondary'
}
