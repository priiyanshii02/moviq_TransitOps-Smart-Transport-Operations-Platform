/**
 * AddEditDriverModal Component
 *
 * Reusable modal for both adding a new driver and editing an existing one.
 * In add mode  → driver prop is null, title is "Add Driver".
 * In edit mode → driver prop is the existing object, title is "Edit Driver".
 *
 * Validates required fields, unique license number, safety score range, and contact number format.
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
import { LICENSE_CATEGORIES, DRIVER_STATUSES, isLicenseDuplicate } from '../../services/driverService'

const EMPTY_FORM = {
  driverName: '',
  licenseNumber: '',
  licenseCategory: '',
  licenseExpiryDate: '',
  contactNumber: '',
  safetyScore: '',
  status: '',
}

const AddEditDriverModal = ({ visible, driver, allDrivers, onSave, onClose }) => {
  const isEditMode = driver !== null
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [validated, setValidated] = useState(false)

  // Populate form when opening in edit mode, or reset for add mode
  useEffect(() => {
    if (visible) {
      if (isEditMode && driver) {
        setForm({
          driverName: driver.driverName,
          licenseNumber: driver.licenseNumber,
          licenseCategory: driver.licenseCategory,
          licenseExpiryDate: driver.licenseExpiryDate,
          contactNumber: driver.contactNumber,
          safetyScore: String(driver.safetyScore),
          status: driver.status,
        })
      } else {
        setForm(EMPTY_FORM)
      }
      setErrors({})
      setValidated(false)
    }
  }, [visible, driver, isEditMode])

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    // Clear field-level error on change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!form.driverName.trim()) newErrors.driverName = 'Driver name is required.'

    if (!form.licenseNumber.trim()) {
      newErrors.licenseNumber = 'License number is required.'
    } else if (
      isLicenseDuplicate(allDrivers, form.licenseNumber.trim(), isEditMode ? driver.id : null)
    ) {
      newErrors.licenseNumber = 'This license number is already in use.'
    }

    if (!form.licenseCategory) newErrors.licenseCategory = 'Please select a license category.'

    if (!form.licenseExpiryDate) {
      newErrors.licenseExpiryDate = 'License expiry date is required.'
    }

    if (!form.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required.'
    } else if (!/^\d{10}$/.test(form.contactNumber.trim())) {
      newErrors.contactNumber = 'Contact number must be exactly 10 digits.'
    }

    const score = Number(form.safetyScore)
    if (form.safetyScore === '' || isNaN(score) || score < 0 || score > 100) {
      newErrors.safetyScore = 'Safety score must be between 0 and 100.'
    }

    if (!form.status) newErrors.status = 'Please select a status.'

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
      driverName: form.driverName.trim(),
      licenseNumber: form.licenseNumber.trim().toUpperCase(),
      licenseCategory: form.licenseCategory,
      licenseExpiryDate: form.licenseExpiryDate,
      contactNumber: form.contactNumber.trim(),
      safetyScore: Number(form.safetyScore),
      status: form.status,
    })
  }

  return (
    <CModal visible={visible} onClose={onClose} size="lg" backdrop="static" alignment="center">
      <CModalHeader>
        <CModalTitle>{isEditMode ? 'Edit Driver' : 'Add Driver'}</CModalTitle>
      </CModalHeader>

      <CForm noValidate onSubmit={handleSubmit}>
        <CModalBody>
          <CRow className="g-3">
            {/* Driver Name */}
            <CCol xs={12} md={6}>
              <CFormLabel htmlFor="driverName">
                Driver Name <span className="text-danger">*</span>
              </CFormLabel>
              <CFormInput
                id="driverName"
                placeholder="e.g. Rahul Sharma"
                value={form.driverName}
                onChange={(e) => handleChange('driverName', e.target.value)}
                invalid={validated && !!errors.driverName}
              />
              {errors.driverName && (
                <CFormFeedback invalid>{errors.driverName}</CFormFeedback>
              )}
            </CCol>

            {/* License Number */}
            <CCol xs={12} md={6}>
              <CFormLabel htmlFor="licenseNumber">
                License Number <span className="text-danger">*</span>
              </CFormLabel>
              <CFormInput
                id="licenseNumber"
                placeholder="e.g. DL123456789"
                value={form.licenseNumber}
                onChange={(e) => handleChange('licenseNumber', e.target.value)}
                invalid={validated && !!errors.licenseNumber}
              />
              {errors.licenseNumber && (
                <CFormFeedback invalid>{errors.licenseNumber}</CFormFeedback>
              )}
            </CCol>

            {/* License Category */}
            <CCol xs={12} md={6}>
              <CFormLabel htmlFor="licenseCategory">
                License Category <span className="text-danger">*</span>
              </CFormLabel>
              <CFormSelect
                id="licenseCategory"
                value={form.licenseCategory}
                onChange={(e) => handleChange('licenseCategory', e.target.value)}
                invalid={validated && !!errors.licenseCategory}
              >
                <option value="">Select category…</option>
                {LICENSE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </CFormSelect>
              {errors.licenseCategory && (
                <CFormFeedback invalid>{errors.licenseCategory}</CFormFeedback>
              )}
            </CCol>

            {/* License Expiry Date */}
            <CCol xs={12} md={6}>
              <CFormLabel htmlFor="licenseExpiryDate">
                License Expiry Date <span className="text-danger">*</span>
              </CFormLabel>
              <CFormInput
                id="licenseExpiryDate"
                type="date"
                value={form.licenseExpiryDate}
                onChange={(e) => handleChange('licenseExpiryDate', e.target.value)}
                invalid={validated && !!errors.licenseExpiryDate}
              />
              {errors.licenseExpiryDate && (
                <CFormFeedback invalid>{errors.licenseExpiryDate}</CFormFeedback>
              )}
            </CCol>

            {/* Contact Number */}
            <CCol xs={12} md={6}>
              <CFormLabel htmlFor="contactNumber">
                Contact Number <span className="text-danger">*</span>
              </CFormLabel>
              <CFormInput
                id="contactNumber"
                type="tel"
                placeholder="e.g. 9876543210"
                value={form.contactNumber}
                onChange={(e) => handleChange('contactNumber', e.target.value)}
                invalid={validated && !!errors.contactNumber}
                maxLength={10}
              />
              {errors.contactNumber && (
                <CFormFeedback invalid>{errors.contactNumber}</CFormFeedback>
              )}
            </CCol>

            {/* Safety Score */}
            <CCol xs={12} md={6}>
              <CFormLabel htmlFor="safetyScore">
                Safety Score (0-100) <span className="text-danger">*</span>
              </CFormLabel>
              <CFormInput
                id="safetyScore"
                type="number"
                min="0"
                max="100"
                placeholder="e.g. 95"
                value={form.safetyScore}
                onChange={(e) => handleChange('safetyScore', e.target.value)}
                invalid={validated && !!errors.safetyScore}
              />
              {errors.safetyScore && (
                <CFormFeedback invalid>{errors.safetyScore}</CFormFeedback>
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
                {DRIVER_STATUSES.map((s) => (
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
            {isEditMode ? 'Update Driver' : 'Save Driver'}
          </CButton>
        </CModalFooter>
      </CForm>
    </CModal>
  )
}

AddEditDriverModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  driver: PropTypes.object,           // null = add mode
  allDrivers: PropTypes.array.isRequired,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}

AddEditDriverModal.defaultProps = {
  driver: null,
}

export default AddEditDriverModal
