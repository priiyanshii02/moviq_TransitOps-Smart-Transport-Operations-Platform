import React from 'react'
import classNames from 'classnames'

import {
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilLocationPin,
  cilSettings,
  cilCloudDownload,
} from '@coreui/icons'

import WidgetsDropdown from '../widgets/WidgetsDropdown'
import MainChart from './MainChart'

const Dashboard = () => {
  // Fleet Management Statistics - Dummy Data
  const fleetProgressStats = [
    { title: 'Active Vehicles', value: '45 Vehicles', percent: 90, color: 'success' },
    { title: 'Available', value: '28 Vehicles', percent: 62, color: 'info' },
    { title: 'In Maintenance', value: '5 Vehicles', percent: 11, color: 'warning' },
    { title: 'Active Trips', value: '12 Trips', percent: 27, color: 'danger' },
    { title: 'Fleet Utilization', value: '73.5%', percent: 73.5, color: 'primary' },
  ]

  // Recent Trips - Dummy Data
  const recentTrips = [
    {
      tripId: 'TRP-2024-001',
      vehicle: 'MH-12-AB-1234',
      driver: 'Rajesh Kumar',
      destination: 'Mumbai to Pune',
      status: 'completed',
    },
    {
      tripId: 'TRP-2024-002',
      vehicle: 'DL-01-CD-5678',
      driver: 'Amit Singh',
      destination: 'Delhi to Jaipur',
      status: 'in-progress',
    },
    {
      tripId: 'TRP-2024-003',
      vehicle: 'KA-03-EF-9012',
      driver: 'Priya Sharma',
      destination: 'Bangalore to Chennai',
      status: 'in-progress',
    },
    {
      tripId: 'TRP-2024-004',
      vehicle: 'MH-14-GH-3456',
      driver: 'Suresh Patel',
      destination: 'Nagpur to Hyderabad',
      status: 'pending',
    },
    {
      tripId: 'TRP-2024-005',
      vehicle: 'GJ-01-IJ-7890',
      driver: 'Deepak Mehta',
      destination: 'Ahmedabad to Surat',
      status: 'completed',
    },
  ]

  // Recent Maintenance - Dummy Data
  const recentMaintenance = [
    {
      vehicle: 'MH-02-KL-2345',
      issue: 'Engine Oil Change',
      workshop: 'Auto Care Center',
      status: 'completed',
    },
    {
      vehicle: 'DL-03-MN-6789',
      issue: 'Brake Pad Replacement',
      workshop: 'Service Station Plus',
      status: 'in-progress',
    },
    {
      vehicle: 'KA-05-OP-0123',
      issue: 'Tire Rotation',
      workshop: 'Quick Fix Garage',
      status: 'in-progress',
    },
    {
      vehicle: 'TN-09-QR-4567',
      issue: 'AC Repair',
      workshop: 'Express Auto Repair',
      status: 'pending',
    },
    {
      vehicle: 'UP-16-ST-8901',
      issue: 'Battery Replacement',
      workshop: 'Auto Care Center',
      status: 'completed',
    },
  ]

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { color: 'success', label: 'Completed' },
      'in-progress': { color: 'info', label: 'In Progress' },
      pending: { color: 'warning', label: 'Pending' },
    }
    const config = statusConfig[status] || { color: 'secondary', label: status }
    return <CBadge color={config.color}>{config.label}</CBadge>
  }

  return (
    <>
      <WidgetsDropdown className="mb-4" />
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 id="fleet-overview" className="card-title mb-0">
                Fleet Overview
              </h4>
              <div className="small text-body-secondary">January - July 2024</div>
            </CCol>
            <CCol sm={7} className="d-none d-md-block">
              <CButton color="primary" className="float-end">
                <CIcon icon={cilCloudDownload} />
              </CButton>
              <CButtonGroup className="float-end me-3">
                {['Day', 'Month', 'Year'].map((value) => (
                  <CButton
                    color="outline-secondary"
                    key={value}
                    className="mx-0"
                    active={value === 'Month'}
                  >
                    {value}
                  </CButton>
                ))}
              </CButtonGroup>
            </CCol>
          </CRow>
          <MainChart />
        </CCardBody>
        <CCardFooter>
          <CRow
            xs={{ cols: 1, gutter: 4 }}
            sm={{ cols: 2 }}
            lg={{ cols: 4 }}
            xl={{ cols: 5 }}
            className="mb-2 text-center"
          >
            {fleetProgressStats.map((item, index, items) => (
              <CCol
                className={classNames({
                  'd-none d-xl-block': index + 1 === items.length,
                })}
                key={index}
              >
                <div className="text-body-secondary">{item.title}</div>
                <div className="fw-semibold text-truncate">
                  {item.value} ({item.percent}%)
                </div>
                <CProgress thin className="mt-2" color={item.color} value={item.percent} />
              </CCol>
            ))}
          </CRow>
        </CCardFooter>
      </CCard>
      <CRow>
        <CCol xs={12} lg={6}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Recent Trips</strong>
            </CCardHeader>
            <CCardBody>
              <CTable align="middle" className="mb-0" hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Trip ID</CTableHeaderCell>
                    <CTableHeaderCell>Vehicle</CTableHeaderCell>
                    <CTableHeaderCell>Driver</CTableHeaderCell>
                    <CTableHeaderCell>Destination</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {recentTrips.map((trip, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>
                        <div className="fw-semibold">{trip.tripId}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex align-items-center">
                          <CIcon icon={cilSpeedometer} className="me-2" />
                          {trip.vehicle}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>{trip.driver}</CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex align-items-center">
                          <CIcon icon={cilLocationPin} className="me-2" />
                          {trip.destination}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>{getStatusBadge(trip.status)}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} lg={6}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Recent Maintenance</strong>
            </CCardHeader>
            <CCardBody>
              <CTable align="middle" className="mb-0" hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Vehicle</CTableHeaderCell>
                    <CTableHeaderCell>Issue</CTableHeaderCell>
                    <CTableHeaderCell>Workshop</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {recentMaintenance.map((maintenance, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>
                        <div className="d-flex align-items-center">
                          <CIcon icon={cilSpeedometer} className="me-2" />
                          {maintenance.vehicle}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex align-items-center">
                          <CIcon icon={cilSettings} className="me-2" />
                          {maintenance.issue}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>{maintenance.workshop}</CTableDataCell>
                      <CTableDataCell>{getStatusBadge(maintenance.status)}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
