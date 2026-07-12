/**
 * ViewDriverModal Component
 *
 * Read-only modal that displays all details for a single driver.
 */

import React from 'react'
import PropTypes from 'prop-types'
import {
  CBadge,
  CButton,
  CCol,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import { getStatusColor, getSafetyScoreColor } from '../../services/driverService'

const DetailRow = ({ label, value }) => (
  <CCol xs={12} sm={6} className="mb-3">
    <div className="small text-body-secondary fw-semibold text-uppercase mb-1">{label}</div>
    <div className="fs-6">{value}</div>
  </CCol>
)

DetailRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.node.isRequired,
}

const ViewDriverModal = ({ visible, driver, onClose }) => {
  if (!driver) return null

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
  }

  return (
    <CModal visible={visible} onClose={onClose} size="lg" alignment="center">
      <CModalHeader>
        <CModalTitle>
          Driver Details —{' '}
          <span className="text-primary">{driver.driverName}</span>
        </CModalTitle>
      </CModalHeader>

      <CModalBody>
        <CRow>
          <DetailRow label="Driver Name" value={driver.driverName} />
          <DetailRow label="License Number" value={driver.licenseNumber} />
          <DetailRow label="License Category" value={driver.licenseCategory} />
          <DetailRow label="License Expiry Date" value={formatDate(driver.licenseExpiryDate)} />
          <DetailRow label="Contact Number" value={driver.contactNumber} />
          <DetailRow
            label="Safety Score"
            value={
              <CBadge color={getSafetyScoreColor(driver.safetyScore)} shape="rounded-pill" className="px-3 py-2">
                {driver.safetyScore}
              </CBadge>
            }
          />
          <DetailRow
            label="Status"
            value={
              <CBadge color={getStatusColor(driver.status)} shape="rounded-pill">
                {driver.status}
              </CBadge>
            }
          />
        </CRow>
      </CModalBody>

      <CModalFooter>
        <CButton color="secondary" variant="outline" onClick={onClose}>
          Close
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

ViewDriverModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  driver: PropTypes.object,
  onClose: PropTypes.func.isRequired,
}

ViewDriverModal.defaultProps = {
  driver: null,
}

export default ViewDriverModal
