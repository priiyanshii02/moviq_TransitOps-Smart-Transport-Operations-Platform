/**
 * ViewVehicleModal Component
 *
 * Read-only modal that displays all details for a single vehicle.
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
import { getStatusColor } from '../../services/vehicleService'

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

const ViewVehicleModal = ({ visible, vehicle, onClose }) => {
  if (!vehicle) return null

  const formatNum = (n) => (n === 0 ? '—' : n.toLocaleString('en-IN'))

  return (
    <CModal visible={visible} onClose={onClose} size="lg" alignment="center">
      <CModalHeader>
        <CModalTitle>
          Vehicle Details —{' '}
          <span className="text-primary">{vehicle.registrationNumber}</span>
        </CModalTitle>
      </CModalHeader>

      <CModalBody>
        <CRow>
          <DetailRow label="Registration Number" value={vehicle.registrationNumber} />
          <DetailRow label="Vehicle Name" value={vehicle.vehicleName} />
          <DetailRow label="Vehicle Model" value={vehicle.vehicleModel} />
          <DetailRow label="Vehicle Type" value={vehicle.vehicleType} />
          <DetailRow
            label="Max Load Capacity"
            value={vehicle.maxLoadCapacity === 0 ? '— (Passenger)' : `${formatNum(vehicle.maxLoadCapacity)} kg`}
          />
          <DetailRow label="Odometer" value={`${formatNum(vehicle.odometer)} km`} />
          <DetailRow
            label="Acquisition Cost"
            value={`₹ ${vehicle.acquisitionCost.toLocaleString('en-IN')}`}
          />
          <DetailRow
            label="Status"
            value={
              <CBadge color={getStatusColor(vehicle.status)} shape="rounded-pill">
                {vehicle.status}
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

ViewVehicleModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  vehicle: PropTypes.object,
  onClose: PropTypes.func.isRequired,
}

ViewVehicleModal.defaultProps = {
  vehicle: null,
}

export default ViewVehicleModal
