import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CForm,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilDollar, cilCalendar, cilSettings, cilTruck } from '@coreui/icons'

const Maintenance = () => {
  const [vehicles] = useState([
    { id: 'V1', name: 'Tata Prima', regNo: 'MH-12-AB-1234', status: 'Available' },
    { id: 'V2', name: 'Mahindra Bolero Pickup', regNo: 'DL-01-CD-5678', status: 'Available' },
    { id: 'V3', name: 'Ashok Leyland Dost', regNo: 'KA-03-EF-9012', status: 'Available' },
    { id: 'V4', name: 'Eicher Pro 2049', regNo: 'MH-14-GH-3456', status: 'In Shop' },
    { id: 'V5', name: 'BharatBenz 2823R', regNo: 'GJ-01-IJ-7890', status: 'Available' },
    { id: 'V6', name: 'Force Traveller', regNo: 'MH-02-KL-2345', status: 'In Shop' },
  ])

  const [logs, setLogs] = useState([
    {
      id: 'LOG-001',
      vehicleId: 'V4',
      vehicleName: 'Eicher Pro 2049',
      regNo: 'MH-14-GH-3456',
      service: 'Brake Pad Replacement',
      cost: 4500,
      date: '2026-07-10',
      status: 'In Shop',
    },
    {
      id: 'LOG-002',
      vehicleId: 'V6',
      vehicleName: 'Force Traveller',
      regNo: 'MH-02-KL-2345',
      service: 'Engine Oil & Filter Change',
      cost: 3200,
      date: '2026-07-11',
      status: 'In Shop',
    },
    {
      id: 'LOG-003',
      vehicleId: 'V1',
      vehicleName: 'Tata Prima',
      regNo: 'MH-12-AB-1234',
      service: 'Tire Rotation & Balancing',
      cost: 1800,
      date: '2026-07-08',
      status: 'Completed',
    },
  ])

  const [selectedVehicleId, setSelectedVehicleId] = useState('')
  const [serviceType, setServiceType] = useState('')
  const [cost, setCost] = useState('')
  const [date, setDate] = useState('')
  const [status, setStatus] = useState('In Shop')

  const handleSave = (e) => {
    e.preventDefault()

    if (!selectedVehicleId || !serviceType || !cost || !date || !status) {
      return
    }

    const targetVehicle = vehicles.find((v) => v.id === selectedVehicleId)
    if (!targetVehicle) {
      return
    }

    const newLogId = `LOG-${Date.now().toString().slice(-4)}`

    const newRecord = {
      id: newLogId,
      vehicleId: selectedVehicleId,
      vehicleName: targetVehicle.name,
      regNo: targetVehicle.regNo,
      service: serviceType,
      cost: parseFloat(cost),
      date: date,
      status: status,
    }

    setLogs([newRecord, ...logs])

    setSelectedVehicleId('')
    setServiceType('')
    setCost('')
    setDate('')
    setStatus('In Shop')
  }

  const getBadgeColor = (statusVal) => {
    switch (statusVal) {
      case 'Available':
        return 'success'
      case 'In Shop':
        return 'warning'
      case 'Completed':
        return 'info'
      default:
        return 'secondary'
    }
  }

  return (
    <>
      <CRow>
        <CCol xs={12} lg={4} className="mb-4">
          <CCard className="shadow-sm">
            <CCardHeader className="bg-body-tertiary fw-semibold py-3 d-flex align-items-center">
              <CIcon icon={cilSettings} className="me-2" />
              Log New Maintenance
            </CCardHeader>
            <CCardBody>
              <CForm onSubmit={handleSave}>
                <div className="mb-3">
                  <CFormLabel className="form-label fw-semibold">Vehicle</CFormLabel>
                  <CFormSelect
                    value={selectedVehicleId}
                    onChange={(e) => setSelectedVehicleId(e.target.value)}
                    className="form-control-lg"
                  >
                    <option value="">Select Vehicle...</option>
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.regNo} - {v.name}
                      </option>
                    ))}
                  </CFormSelect>
                </div>

                <div className="mb-3">
                  <CFormLabel className="form-label fw-semibold">Service Type</CFormLabel>
                  <CFormSelect
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="form-control-lg"
                  >
                    <option value="">Select Service Type...</option>
                    <option value="Engine Oil Change">Engine Oil Change</option>
                    <option value="Brake Pad Replacement">Brake Pad Replacement</option>
                    <option value="Tire Rotation & Balancing">Tire Rotation & Balancing</option>
                    <option value="Battery Replacement">Battery Replacement</option>
                    <option value="AC Service & Recharge">AC Service & Recharge</option>
                    <option value="Suspension Repair">Suspension Repair</option>
                    <option value="Transmission Fluid Check">Transmission Fluid Check</option>
                    <option value="General Inspection">General Inspection</option>
                  </CFormSelect>
                </div>

                <div className="mb-3">
                  <CFormLabel className="form-label fw-semibold">Cost</CFormLabel>
                  <div className="input-group input-group-lg">
                    <span className="input-group-text bg-light border-end-0">
                      <CIcon icon={cilDollar} size="sm" />
                    </span>
                    <CFormInput
                      type="number"
                      placeholder="0.00"
                      value={cost}
                      onChange={(e) => setCost(e.target.value)}
                      step="0.01"
                      min="0"
                      className="border-start-0"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <CFormLabel className="form-label fw-semibold">Date</CFormLabel>
                  <div className="input-group input-group-lg">
                    <span className="input-group-text bg-light border-end-0">
                      <CIcon icon={cilCalendar} size="sm" />
                    </span>
                    <CFormInput
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="border-start-0"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <CFormLabel className="form-label fw-semibold">Status</CFormLabel>
                  <CFormSelect
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="form-control-lg"
                  >
                    <option value="In Shop">In Shop</option>
                    <option value="Completed">Completed</option>
                    <option value="Available">Available</option>
                  </CFormSelect>
                </div>

                <CButton
                  color="primary"
                  type="submit"
                  className="w-100 py-2 fw-semibold"
                  size="lg"
                >
                  Save Maintenance Record
                </CButton>
              </CForm>

              <hr className="my-3" />

              <div className="alert alert-info p-3 mb-0" role="alert">
                <small>
                  <strong>Note:</strong> Vehicles marked <span className="badge bg-warning me-1">In Shop</span> are removed from the
                  dispatcher selection pool.
                </small>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol xs={12} lg={8} className="mb-4">
          <CCard className="shadow-sm">
            <CCardHeader className="bg-body-tertiary fw-semibold py-3 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <CIcon icon={cilTruck} className="me-2" />
                Maintenance Log
              </div>
              <CBadge color="dark" shape="rounded-pill">
                {logs.length} Records
              </CBadge>
            </CCardHeader>
            <CCardBody className="p-0">
              <div className="table-responsive">
                <CTable hover responsive className="mb-0">
                  <CTableHead className="bg-body-tertiary">
                    <CTableRow>
                      <CTableHeaderCell className="fw-semibold">Vehicle</CTableHeaderCell>
                      <CTableHeaderCell className="fw-semibold">Service Type</CTableHeaderCell>
                      <CTableHeaderCell className="fw-semibold">Cost</CTableHeaderCell>
                      <CTableHeaderCell className="fw-semibold">Date</CTableHeaderCell>
                      <CTableHeaderCell className="fw-semibold">Status</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {logs.length === 0 ? (
                      <CTableRow>
                        <CTableDataCell colSpan={5} className="text-center py-4 text-muted">
                          No maintenance records found.
                        </CTableDataCell>
                      </CTableRow>
                    ) : (
                      logs.map((log) => (
                        <CTableRow key={log.id} className="align-middle">
                          <CTableDataCell>
                            <div className="fw-semibold">{log.vehicleName}</div>
                            <div className="text-muted small">{log.regNo}</div>
                          </CTableDataCell>
                          <CTableDataCell>{log.service}</CTableDataCell>
                          <CTableDataCell className="fw-semibold">₹{log.cost.toLocaleString()}</CTableDataCell>
                          <CTableDataCell className="text-nowrap">{log.date}</CTableDataCell>
                          <CTableDataCell>
                            <CBadge color={getBadgeColor(log.status)}>{log.status}</CBadge>
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    )}
                  </CTableBody>
                </CTable>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Maintenance