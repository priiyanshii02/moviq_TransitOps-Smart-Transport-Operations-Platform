import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

const Settings = () => {
  const [generalSettings, setGeneralSettings] = useState({
    depotName: 'TransitOps Depot',
    currency: 'INR',
    distanceUnit: 'Kilometers',
  })

  const [rbacData] = useState([
    {
      role: 'Fleet Manager',
      fleet: '✓',
      drivers: '✓',
      trips: '−',
      fuelExpense: '−',
      analytics: '✓',
    },
    {
      role: 'Dispatcher',
      fleet: 'View',
      drivers: '−',
      trips: '✓',
      fuelExpense: '−',
      analytics: '−',
    },
    {
      role: 'Safety Officer',
      fleet: '−',
      drivers: '✓',
      trips: 'View',
      fuelExpense: '−',
      analytics: '−',
    },
    {
      role: 'Financial Analyst',
      fleet: 'View',
      drivers: '−',
      trips: '−',
      fuelExpense: '✓',
      analytics: '✓',
    },
  ])

  const handleDepotNameChange = (e) => {
    setGeneralSettings({
      ...generalSettings,
      depotName: e.target.value,
    })
  }

  const handleCurrencyChange = (e) => {
    setGeneralSettings({
      ...generalSettings,
      currency: e.target.value,
    })
  }

  const handleDistanceUnitChange = (e) => {
    setGeneralSettings({
      ...generalSettings,
      distanceUnit: e.target.value,
    })
  }

  const handleSaveChanges = () => {
    // Just update local state (no backend)
    console.log('Settings saved:', generalSettings)
  }

  return (
    <CRow>
      {/* Left Section - General Settings */}
      <CCol xs={12} md={5} className="mb-4">
        <CCard>
          <CCardBody>
            <h6 className="mb-4 fw-bold text-uppercase">General</h6>
            <CForm>
              <div className="mb-3">
                <CFormLabel className="form-label">Depot Name</CFormLabel>
                <CFormInput
                  type="text"
                  value={generalSettings.depotName}
                  onChange={handleDepotNameChange}
                  placeholder="Enter depot name"
                />
              </div>

              <div className="mb-3">
                <CFormLabel className="form-label">Currency</CFormLabel>
                <CFormSelect
                  value={generalSettings.currency}
                  onChange={handleCurrencyChange}
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </CFormSelect>
              </div>

              <div className="mb-4">
                <CFormLabel className="form-label">Distance Unit</CFormLabel>
                <CFormSelect
                  value={generalSettings.distanceUnit}
                  onChange={handleDistanceUnitChange}
                >
                  <option value="Kilometers">Kilometers</option>
                  <option value="Miles">Miles</option>
                </CFormSelect>
              </div>

              <CButton
                color="primary"
                onClick={handleSaveChanges}
                className="w-100"
              >
                Save Changes
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Right Section - RBAC Table */}
      <CCol xs={12} md={7} className="mb-4">
        <CCard>
          <CCardBody>
            <h6 className="mb-4 fw-bold text-uppercase">Role-Based Access (RBAC)</h6>
            <div className="table-responsive">
              <CTable striped hover className="mb-0">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Role</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Fleet</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Drivers</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Trips</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Fuel/Exp</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Analytics</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {rbacData.map((row, idx) => (
                    <CTableRow key={idx}>
                      <CTableDataCell>{row.role}</CTableDataCell>
                      <CTableDataCell className="text-center">{row.fleet}</CTableDataCell>
                      <CTableDataCell className="text-center">{row.drivers}</CTableDataCell>
                      <CTableDataCell className="text-center">{row.trips}</CTableDataCell>
                      <CTableDataCell className="text-center">{row.fuelExpense}</CTableDataCell>
                      <CTableDataCell className="text-center">{row.analytics}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Settings
