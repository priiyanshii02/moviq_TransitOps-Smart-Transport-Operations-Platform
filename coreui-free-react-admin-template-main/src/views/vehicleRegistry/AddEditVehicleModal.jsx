/**
 * AddEditVehicleModal Component
 *
 * Reusable modal for both adding a new vehicle and editing an existing one.
 * In add mode  → vehicle prop is null, title is "Add Vehicle".
 * In edit mode → vehicle prop is the existing object, title is "Edit Vehicle".
 *
 * Validates required fields and unique registration number before saving.
 */

import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  CButton,
  CCol,
  CForm,
  CFormFeedback,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import { VEHICLE_TYPES, VEHICLE_STATUSES, isRegistrationDuplicate } from '../../services/vehicleService'

const EMPTY_FORM = {
  registrationNumber: '',
  vehicleName: '',
  vehicleModel: '',
  vehicleType: '',
  maxLoadCapacity: '',
  odometer: '',
  acquisitionCost: '',
  status: '',
}

const AddEditVehicleModal = ({ visible, vehicle, allVehicles, onSave, onClose }) => {
  const isEditMode = vehicle !== null
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [validated, setValidated] = useState(false)

  // Populate form when opening in edit mode, or reset for add mode
  useEffect(() => {
    if (visible) {
      if (isEditMode && vehicle) {
        setForm({
          registrationNumber: vehicle.registrationNumber,
          vehicleName: vehicle.vehicleName,
          vehicleModel: vehicle.vehicleModel,
          vehicleType: vehicle.vehicleType,
          maxLoadCapacity: String(vehicle.maxLoadCapacity),
          odometer: String(vehicle.odometer),
          acquisitionCost: String(vehicle.acquisitionCost),
          status: vehicle.status,
        })
      } else {
        setForm(EMPTY_FORM)
      }
      setErrors({})
      setValidated(false)
    }
  }, [visible, vehicle, isEditMode])

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    // Clear field-level error on change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!form.registrationNumber.trim()) {
      newErrors.registrationNumber = 'Registration number is required.'
    } else if (
      isRegistrationDuplicate(allVehicles, form.registrationNumber.trim(), isEditMode ? vehicle.id : null)
    ) {
      newErrors.registrationNumber = 'This registration number is already in use.'
    }

    if (!form.vehicleName.trim()) newErrors.vehicleName = 'Vehicle name is required.'
    if (!form.vehicleModel.trim()) newErrors.vehicleModel = 'Vehicle model is required.'
    if (!form.vehicleType) newErrors.vehicleType = 'Please select a vehicle type.'
    if (!form.status) newErrors.status = 'Please select a status.'

    const capacity = Number(form.maxLoadCapacity)
    if (form.maxLoadCapacity === '' || isNaN(capacity) || capacity < 0) {
      newErrors.maxLoadCapacity = 'Enter a valid load capacity (0 or more).'
    }

    const odo = Number(form.odometer)
    if (form.odometer === '' || isNaN(odo) || odo < 0) {
      newErrors.odometer = 'Enter a valid odometer reading (0 or more).'
    }

    const cost = Number(form.acquisitionCost)
    if (form.acquisitionCost === '' || isNaN(cost) || cost < 0) {
      newErrors.acquisitionCost = 'Enter a valid acquisition cost (0 or more).'
    }

    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setValidated(true)
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSave({
      registrationNumber: form.registrationNumber.trim().toUpperCase(),
      vehicleName: form.vehicleName.trim(),
      vehicleModel: form.vehicleModel.trim(),
      vehicleType: form.vehicleType,
      maxLoadCapacity: Number(form.maxLoadCapacity),
      odometer: Number(form.odometer),
      acquisitionCost: Number(form.acquisitionCost),
      status: form.status,
    })
  }

  return (
    <CModal visible={visible} onClose={onClose} size="lg" backdrop="static" alignment="center">
      <CModalHeader>
        <CModalTitle>{isEditMode ? 'Edit Vehicle' : 'Add Vehicle'}</CModalTitle>
      </CModalHeader>

      <CForm noValidate onSubmit={handleSubmit}>
        <CModalBody>
          <CRow className="g-3">
            {/* Registration Number */}
            <CCol xs={12} md={6}>
              <CFormLabel htmlFor="regNumber">
                Registration Number <span className="text-danger">*</span>
              </CFormLabel>
              <CFormInput
                id="regNumber"
                placeholder="e.g. DL01AB1234"
                value={form.registrationNumber}
                onChange={(e) => handleChange('registrationNumber', e.target.value)}
                invalid={validated && !!errors.registrationNumber}
              />
              {errors.registrationNumber && (
                <CFormFeedback invalid>{errors.registrationNumber}</CFormFeedback>
              )}
            </CCol>

            {/* Vehicle Name */}
            <CCol xs={12} md={6}>
              <CFormLabel htmlFor="vehicleName">
                Vehicle Name <span className="text-danger">*</span>
              </CFormLabel>
              <CFormInput
                id="vehicleName"
                placeholder="e.g. Tata Prima"
                value={form.vehicleName}
                onChange={(e) => handleChange('vehicleName', e.target.value)}
                invalid={validated && !!errors.vehicleName}
              />
              {errors.vehicleName && (
                <CFormFeedback invalid>{errors.vehicleName}</CFormFeedback>
              )}
            </CCol>

            {/* Vehicle Model */}
            <CCol xs={12} md={6}>
              <CFormLabel htmlFor="vehicleModel">
                Vehicle Model <span className="text-danger">*</span>
              </CFormLabel>
              <CFormInput
                id="vehicleModel"
                placeholder="e.g. 5530.S"
                value={form.vehicleModel}
                onChange={(e) => handleChange('vehicleModel', e.target.value)}
                invalid={validated && !!errors.vehicleModel}
              />
              {errors.vehicleModel && (
                <CFormFeedback invalid>{errors.vehicleModel}</CFormFeedback>
              )}
            </CCol>

            {/* Vehicle Type */}
            <CCol xs={12} md={6}>
              <CFormLabel htmlFor="vehicleType">
                Vehicle Type <span className="text-danger">*</span>
              </CFormLabel>
              <CFormSelect
                id="vehicleType"
                value={form.vehicleType}
                onChange={(e) => handleChange('vehicleType', e.target.value)}
                invalid={validated && !!errors.vehicleType}
              >
                <option value="">Select type…</option>
                {VEHICLE_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </CFormSelect>
              {errors.vehicleType && (
                <CFormFeedback invalid>{errors.vehicleType}</CFormFeedback>
              )}
            </CCol>

            {/* Max Load Capacity */}
            <CCol xs={12} md={4}>
              <CFormLabel htmlFor="maxLoad">
                Max Load Capacity (kg) <span className="text-danger">*</span>
              </CFormLabel>
              <CFormInput
                id="maxLoad"
                type="number"
                min="0"
                placeholder="e.g. 30000"
                value={form.maxLoadCapacity}
                onChange={(e) => handleChange('maxLoadCapacity', e.target.value)}
                invalid={validated && !!errors.maxLoadCapacity}
              />
              {errors.maxLoadCapacity && (
                <CFormFeedback invalid>{errors.maxLoadCapacity}</CFormFeedback>
              )}
            </CCol>

            {/* Odometer */}
            <CCol xs={12} md={4}>
              <CFormLabel htmlFor="odometer">
                Odometer (km) <span className="text-danger">*</span>
              </CFormLabel>
              <CFormInput
                id="odometer"
                type="number"
                min="0"
                placeholder="e.g. 120450"
                value={form.odometer}
                onChange={(e) => handleChange('odometer', e.target.value)}
                invalid={validated && !!errors.odometer}
              />
              {errors.odometer && (
                <CFormFeedback invalid>{errors.odometer}</CFormFeedback>
              )}
            </CCol>

            {/* Acquisition Cost */}
            <CCol xs={12} md={4}>
              <CFormLabel htmlFor="acquisitionCost">
                Acquisition Cost (₹) <span className="text-danger">*</span>
              </CFormLabel>
              <CFormInput
                id="acquisitionCost"
                type="number"
                min="0"
                placeholder="e.g. 4200000"
                value={form.acquisitionCost}
                onChange={(e) => handleChange('acquisitionCost', e.target.value)}
                invalid={validated && !!errors.acquisitionCost}
              />
              {errors.acquisitionCost && (
                <CFormFeedback invalid>{errors.acquisitionCost}</CFormFeedback>
              )}
            </CCol>

            {/* Status */}
            <CCol xs={12} md={6}>
              <CFormLabel htmlFor="status">
                Status <span className="text-danger">*</span>
              </CFormLabel>
              <CFormSelect
                id="status"
                value={form.status}
                onChange={(e) => handleChange('status', e.target.value)}
                invalid={validated && !!errors.status}
              >
                <option value="">Select status…</option>
                {VEHICLE_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </CFormSelect>
              {errors.status && (
                <CFormFeedback invalid>{errors.status}</CFormFeedback>
              )}
            </CCol>
          </CRow>
        </CModalBody>

        <CModalFooter>
          <CButton color="secondary" variant="outline" onClick={onClose}>
            Cancel
          </CButton>
          <CButton color="primary" type="submit">
            {isEditMode ? 'Update Vehicle' : 'Save Vehicle'}
          </CButton>
        </CModalFooter>
      </CForm>
    </CModal>
  )
}

AddEditVehicleModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  vehicle: PropTypes.object,           // null = add mode
  allVehicles: PropTypes.array.isRequired,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}

AddEditVehicleModal.defaultProps = {
  vehicle: null,
}

export default AddEditVehicleModal
