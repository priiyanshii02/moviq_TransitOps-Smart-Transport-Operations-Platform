/**
 * VehicleFilters Component
 *
 * Renders a row of select dropdowns for filtering the vehicle table
 * by Vehicle Type and Status. Calls the parent onChange handler
 * whenever either value changes so the table updates immediately.
 */

import React from 'react'
import PropTypes from 'prop-types'
import { CCol, CFormLabel, CFormSelect, CRow } from '@coreui/react'
import { VEHICLE_TYPES, VEHICLE_STATUSES } from '../../services/vehicleService'

const VehicleFilters = ({ filters, onChange }) => {
  const handleChange = (field, value) => {
    onChange({ ...filters, [field]: value })
  }

  return (
    <CRow className="mb-3 g-3 align-items-end">
      <CCol xs={12} sm={6} md={4} lg={3}>
        <CFormLabel htmlFor="filterType" className="fw-semibold">
          Vehicle Type
        </CFormLabel>
        <CFormSelect
          id="filterType"
          value={filters.vehicleType}
          onChange={(e) => handleChange('vehicleType', e.target.value)}
        >
          <option value="">All Types</option>
          {VEHICLE_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
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
          {VEHICLE_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </CFormSelect>
      </CCol>
    </CRow>
  )
}

VehicleFilters.propTypes = {
  filters: PropTypes.shape({
    vehicleType: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
}

export default VehicleFilters
