/**
 * DriverFilters Component
 *
 * Renders a row of select dropdowns for filtering the driver table
 * by License Category and Status. Calls the parent onChange handler
 * whenever either value changes so the table updates immediately.
 */

import React from 'react'
import PropTypes from 'prop-types'
import { CCol, CFormLabel, CFormSelect, CRow } from '@coreui/react'
import { LICENSE_CATEGORIES, DRIVER_STATUSES } from '../../services/driverService'

const DriverFilters = ({ filters, onChange }) => {
  const handleChange = (field, value) => {
    onChange({ ...filters, [field]: value })
  }

  return (
    <CRow className="mb-3 g-3 align-items-end">
      <CCol xs={12} sm={6} md={4} lg={3}>
        <CFormLabel htmlFor="filterCategory" className="fw-semibold">
          License Category
        </CFormLabel>
        <CFormSelect
          id="filterCategory"
          value={filters.licenseCategory}
          onChange={(e) => handleChange('licenseCategory', e.target.value)}
        >
          <option value="">All Categories</option>
          {LICENSE_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </CFormSelect>
      </CCol>

      <CCol xs={12} sm={6} md={4} lg={3}>
        <CFormLabel htmlFor="filterStatus" className="fw-semibold">
          Status
        </CFormLabel>
        <CFormSelect
          id="filterStatus"
          value={filters.status}
          onChange={(e) => handleChange('status', e.target.value)}
        >
          <option value="">All Statuses</option>
          {DRIVER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </CFormSelect>
      </CCol>
    </CRow>
  )
}

DriverFilters.propTypes = {
  filters: PropTypes.shape({
    licenseCategory: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
}

export default DriverFilters
