import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLocationPin, cilTruck, cilPeople } from '@coreui/icons'

const Trips = () => {
  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    vehicle: '',
    driver: '',
    cargoWeight: '',
    plannedDistance: '',
  })

  const [error, setError] = useState('')
  const [selectedVehicle, setSelectedVehicle] = useState(null)

  // Dummy data for vehicles and drivers
  const vehicles = [
    { id: 'MH-12-AB-3456', name: 'MH-12-AB-3456', capacity: 500, currentLoad: 0, status: 'Available' },
    { id: 'DL-01-XY-7890', name: 'DL-01-XY-7890', capacity: 300, currentLoad: 0, status: 'Available' },
    { id: 'KA-05-CD-1234', name: 'KA-05-CD-1234', capacity: 800, currentLoad: 500, status: 'On Trip' },
  ]

  const drivers = [
    { id: '1', name: 'John Doe', status: 'Available' },
    { id: '2', name: 'Jane Smith', status: 'Available' },
    { id: '3', name: 'Mike Johnson', status: 'On Trip' },
  ]

  // Live trips data
  const liveTrips = [
    {
      id: 'TRP001',
      route: 'Gandhinagar Depot -> Ahmedabad Hub',
      status: 'Dispatched',
      vehicle: 'MH-05 / AB12',
      progress: 45,
    },
    {
      id: 'TRP004',
      route: 'Vadodara Industrial Area -> Gujarat Warehouse',
      status: 'Draft',
      vehicle: 'TN-05 / SLF87',
      progress: 0,
    },
    {
      id: 'TRP006',
      route: 'Mumbai -> Kolki Depot',
      status: 'Cancelled',
      vehicle: 'Unassigned',
      progress: 0,
    },
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Vehicle capacity validation
    if (name === 'vehicle') {
      const vehicle = vehicles.find((v) => v.id === value)
      setSelectedVehicle(vehicle)
      validateCapacity(formData.cargoWeight, vehicle)
    }

    if (name === 'cargoWeight') {
      validateCapacity(value, selectedVehicle)
    }
  }

  const validateCapacity = (weight, vehicle) => {
    if (vehicle && weight) {
      const numWeight = parseFloat(weight)
      if (numWeight + vehicle.currentLoad > vehicle.capacity) {
        setError(
          `Capacity exceeded by ${numWeight + vehicle.currentLoad - vehicle.capacity} kg - dispatch blocked`,
        )
      } else {
        setError('')
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (error) {
      alert('Cannot dispatch: ' + error)
      return
    }
    console.log('Trip Created:', formData)
    alert('Trip dispatched successfully!')
    // Reset form
    setFormData({
      source: '',
      destination: '',
      vehicle: '',
      driver: '',
      cargoWeight: '',
      plannedDistance: '',
    })
    setSelectedVehicle(null)
    setError('')
  }

  const getStatusBadge = (status) => {
    const colors = {
      Dispatched: 'info',
      Draft: 'secondary',
      Cancelled: 'danger',
    }
    return <CBadge color={colors[status] || 'secondary'}>{status}</CBadge>
  }

  const getLifecycleStep = (status) => {
    const steps = ['Dispatched', 'Completed', 'Cancelled']
    return steps.indexOf(status)
  }

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Trip Dispatcher</strong>
            </CCardHeader>
            <CCardBody>
              <CRow>
                {/* Left Side - Create Trip Form */}
                <CCol md={5}>
                  <h6 className="mb-3">CREATE TRIP</h6>
                  <CForm onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="source">Source (Departure Location)</CFormLabel>
                      <CFormInput
                        type="text"
                        id="source"
                        name="source"
                        placeholder="Gandhinagar Depot"
                        value={formData.source}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <CFormLabel htmlFor="destination">Destination</CFormLabel>
                      <CFormInput
                        type="text"
                        id="destination"
                        name="destination"
                        placeholder="Ahmedabad Hub"
                        value={formData.destination}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <CFormLabel htmlFor="vehicle">Vehicle (Available Only)</CFormLabel>
                      <CFormSelect
                        id="vehicle"
                        name="vehicle"
                        value={formData.vehicle}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Vehicle...</option>
                        {vehicles
                          .filter((v) => v.status === 'Available')
                          .map((vehicle) => (
                            <option key={vehicle.id} value={vehicle.id}>
                              {vehicle.name} - {vehicle.capacity} kg capacity
                            </option>
                          ))}
                      </CFormSelect>
                    </div>

                    <div className="mb-3">
                      <CFormLabel htmlFor="driver">Driver (Available Only)</CFormLabel>
                      <CFormSelect
                        id="driver"
                        name="driver"
                        value={formData.driver}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Driver...</option>
                        {drivers
                          .filter((d) => d.status === 'Available')
                          .map((driver) => (
                            <option key={driver.id} value={driver.id}>
                              {driver.name}
                            </option>
                          ))}
                      </CFormSelect>
                    </div>

                    <div className="mb-3">
                      <CFormLabel htmlFor="cargoWeight">Cargo Weight (kg)</CFormLabel>
                      <CFormInput
                        type="number"
                        id="cargoWeight"
                        name="cargoWeight"
                        placeholder="0.0"
                        value={formData.cargoWeight}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <CFormLabel htmlFor="plannedDistance">Planned Distance (km)</CFormLabel>
                      <CFormInput
                        type="number"
                        id="plannedDistance"
                        name="plannedDistance"
                        placeholder="0.0"
                        value={formData.plannedDistance}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {selectedVehicle && (
                      <div className="mb-3 p-3 border rounded">
                        <div>
                          <strong>Vehicle Capacity:</strong> {selectedVehicle.capacity} kg
                        </div>
                        <div>
                          <strong>Cargo Weight:</strong> {formData.cargoWeight || 0} kg
                        </div>
                        {error && (
                          <CAlert color="danger" className="mt-2 mb-0">
                            ✖ {error}
                          </CAlert>
                        )}
                      </div>
                    )}

                    <div className="d-flex gap-2">
                      <CButton type="submit" color="primary" disabled={!!error}>
                        Dispatch (Scheduled)
                      </CButton>
                      <CButton type="button" color="secondary" variant="outline">
                        Cancel
                      </CButton>
                    </div>
                  </CForm>
                </CCol>

                {/* Right Side - Live Board */}
                <CCol md={7}>
                  <h6 className="mb-3">LIVE BOARD</h6>

                  {/* Trip Lifecycle */}
                  <div className="mb-4">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <small className="text-muted">TRIP LIFECYCLE</small>
                    </div>
                    <div className="d-flex align-items-center justify-content-between position-relative">
                      <div className="position-absolute top-50 start-0 end-0 border-top"></div>
                      <div
                        className="d-flex flex-column align-items-center position-relative"
                        style={{ zIndex: 1 }}
                      >
                        <div
                          className="rounded-circle bg-info d-flex align-items-center justify-center"
                          style={{ width: '40px', height: '40px' }}
                        >
                          <span className="text-white">●</span>
                        </div>
                        <small className="mt-1">Dispatched</small>
                      </div>
                      <div
                        className="d-flex flex-column align-items-center position-relative"
                        style={{ zIndex: 1 }}
                      >
                        <div
                          className="rounded-circle bg-secondary border d-flex align-items-center justify-center"
                          style={{ width: '40px', height: '40px' }}
                        >
                          <span className="text-white">○</span>
                        </div>
                        <small className="mt-1">Completed</small>
                      </div>
                      <div
                        className="d-flex flex-column align-items-center position-relative"
                        style={{ zIndex: 1 }}
                      >
                        <div
                          className="rounded-circle bg-secondary border d-flex align-items-center justify-center"
                          style={{ width: '40px', height: '40px' }}
                        >
                          <span className="text-white">○</span>
                        </div>
                        <small className="mt-1">Cancelled</small>
                      </div>
                    </div>
                  </div>

                  {/* Live Trips Table */}
                  <CTable hover responsive>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>Trip ID</CTableHeaderCell>
                        <CTableHeaderCell>Route</CTableHeaderCell>
                        <CTableHeaderCell>Status</CTableHeaderCell>
                        <CTableHeaderCell>Vehicle</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {liveTrips.map((trip) => (
                        <CTableRow key={trip.id}>
                          <CTableDataCell>
                            <strong>{trip.id}</strong>
                          </CTableDataCell>
                          <CTableDataCell>
                            <div className="d-flex align-items-center">
                              <CIcon icon={cilLocationPin} size="sm" className="me-2" />
                              <div>
                                <div>{trip.route}</div>
                                {trip.progress > 0 && (
                                  <div className="progress mt-1" style={{ height: '4px' }}>
                                    <div
                                      className="progress-bar bg-info"
                                      style={{ width: `${trip.progress}%` }}
                                    ></div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CTableDataCell>
                          <CTableDataCell>{getStatusBadge(trip.status)}</CTableDataCell>
                          <CTableDataCell>
                            <div className="d-flex align-items-center">
                              {trip.vehicle !== 'Unassigned' && (
                                <CIcon icon={cilTruck} size="sm" className="me-2" />
                              )}
                              {trip.vehicle}
                            </div>
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>

                  <div className="mt-3">
                    <small className="text-muted">
                      On Complete: whereby a fuel log is required to Vehicle & Driver Available
                    </small>
                  </div>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Trips
