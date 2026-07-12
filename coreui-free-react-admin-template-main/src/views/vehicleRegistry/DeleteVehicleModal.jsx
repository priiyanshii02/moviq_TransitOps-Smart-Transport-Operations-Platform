/**
 * DeleteVehicleModal Component
 *
 * Confirmation modal shown before deleting a vehicle.
 * Calls onConfirm when the user clicks "Delete".
 */

import React from 'react'
import PropTypes from 'prop-types'
import {
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilWarning } from '@coreui/icons'

const DeleteVehicleModal = ({ visible, vehicle, onConfirm, onClose }) => {
  if (!vehicle) return null

  return (
    <CModal visible={visible} onClose={onClose} alignment="center" backdrop="static">
      <CModalHeader>
        <CModalTitle className="text-danger d-flex align-items-center gap-2">
          <CIcon icon={cilWarning} />
          Delete Vehicle
        </CModalTitle>
      </CModalHeader>

      <CModalBody>
        <p className="mb-1">Are you sure you want to delete this vehicle?</p>
        <p className="fw-semibold mb-0">
          {vehicle.registrationNumber} — {vehicle.vehicleName} ({vehicle.vehicleModel})
        </p>
        <p className="small text-body-secondary mt-2 mb-0">This action cannot be undone.</p>
      </CModalBody>

      <CModalFooter>
        <CButton color="secondary" variant="outline" onClick={onClose}>
          Cancel
        </CButton>
        <CButton color="danger" onClick={onConfirm}>
          Delete
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

DeleteVehicleModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  vehicle: PropTypes.object,
  onConfirm: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}

DeleteVehicleModal.defaultProps = {
  vehicle: null,
}

export default DeleteVehicleModal
