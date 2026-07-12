/**
 * DriverManagement Page
 *
 * Main entry point for the Driver Management module.
 * Owns all state: driver list, search query, filters, and modal visibility.
 * Sub-components (DriverTable, DriverFilters, modals) receive only what they need.
 */

import React, { useState, useEffect, useMemo } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CToast,
  CToastBody,
  CToaster,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPlus, cilSearch, cilFilter } from '@coreui/icons'

import DriverFilters from './DriverFilters'
import DriverTable from './DriverTable'
import AddEditDriverModal from './AddEditDriverModal'
import ViewDriverModal from './ViewDriverModal'
import DeleteDriverModal from './DeleteDriverModal'

import {
  loadDrivers,
  addDriver,
  updateDriver,
  deleteDriver,
  searchDrivers,
  filterDrivers,
} from '../../services/driverService'

// ─── Toast helper ─────────────────────────────────────────────────────────────

const makeToast = (message, color = 'success') => (
  <CToast autohide delay={3000} visible color={color} className="text-white">
    <CToastBody>{message}</CToastBody>
  </CToast>
)

// ─── Component ────────────────────────────────────────────────────────────────

const DriverManagement = () => {
  // ── Data state ──────────────────────────────────────────────────────────────
  const [drivers, setDrivers] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({ licenseCategory: '', status: '' })
  const [showFilters, setShowFilters] = useState(false)

  // ── Modal state ─────────────────────────────────────────────────────────────
  const [addEditModal, setAddEditModal] = useState({ visible: false, driver: null })
  const [viewModal, setViewModal] = useState({ visible: false, driver: null })
  const [deleteModal, setDeleteModal] = useState({ visible: false, driver: null })

  // ── Toast state ─────────────────────────────────────────────────────────────
  const [toasts, setToasts] = useState([])

  const pushToast = (message, color) =>
    setToasts((prev) => [...prev, { id: Date.now(), content: makeToast(message, color) }])

  // ── Seed data on mount ──────────────────────────────────────────────────────
  useEffect(() => {
    setDrivers(loadDrivers())
  }, [])

  // ── Derived: filtered + searched list ───────────────────────────────────────
  const displayedDrivers = useMemo(() => {
    const afterSearch = searchDrivers(drivers, searchQuery)
    return filterDrivers(afterSearch, filters.licenseCategory, filters.status)
  }, [drivers, searchQuery, filters])

  // ── CRUD handlers ────────────────────────────────────────────────────────────

  const handleSave = (driverData) => {
    if (addEditModal.driver) {
      // Edit mode
      setDrivers((prev) => updateDriver(prev, addEditModal.driver.id, driverData))
      pushToast('Driver updated successfully.', 'success')
    } else {
      // Add mode
      setDrivers((prev) => addDriver(prev, driverData))
      pushToast('Driver added successfully.', 'success')
    }
    setAddEditModal({ visible: false, driver: null })
  }

  const handleDelete = () => {
    setDrivers((prev) => deleteDriver(prev, deleteModal.driver.id))
    pushToast('Driver deleted.', 'danger')
    setDeleteModal({ visible: false, driver: null })
  }

  // ── Modal openers ────────────────────────────────────────────────────────────

  const openAdd = () => setAddEditModal({ visible: true, driver: null })
  const openEdit = (driver) => setAddEditModal({ visible: true, driver })
  const openView = (driver) => setViewModal({ visible: true, driver })
  const openDelete = (driver) => setDeleteModal({ visible: true, driver })

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Page header ───────────────────────────────────────────────────── */}
      <CRow className="mb-4 align-items-center">
        <CCol>
          <h2 className="mb-0 fw-bold">Driver Management</h2>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0 mt-1">
              <li className="breadcrumb-item">
                <a href="#/dashboard">Dashboard</a>
              </li>
              <li className="breadcrumb-item">
                <a href="#/dashboard/fleet-management/vehicle-registry">Fleet Management</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Driver Management
              </li>
            </ol>
          </nav>
        </CCol>

        {/* Top-right controls */}
        <CCol xs="auto" className="d-flex gap-2 flex-wrap justify-content-end">
          <CInputGroup style={{ width: 220 }}>
            <CInputGroupText>
              <CIcon icon={cilSearch} />
            </CInputGroupText>
            <CFormInput
              placeholder="Search drivers…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search drivers"
            />
          </CInputGroup>

          <CButton
            color={showFilters ? 'secondary' : 'outline-secondary'}
            onClick={() => setShowFilters((v) => !v)}
            title="Toggle filters"
          >
            <CIcon icon={cilFilter} className="me-1" />
            Filter
          </CButton>

          <CButton color="primary" onClick={openAdd}>
            <CIcon icon={cilPlus} className="me-1" />
            Add Driver
          </CButton>
        </CCol>
      </CRow>

      {/* ── Summary chips ─────────────────────────────────────────────────── */}
      <CRow className="mb-3 g-3">
        {[
          { label: 'Total', count: drivers.length, color: 'text-primary' },
          {
            label: 'Available',
            count: drivers.filter((d) => d.status === 'Available').length,
            color: 'text-success',
          },
          {
            label: 'On Trip',
            count: drivers.filter((d) => d.status === 'On Trip').length,
            color: 'text-primary',
          },
          {
            label: 'Off Duty',
            count: drivers.filter((d) => d.status === 'Off Duty').length,
            color: 'text-secondary',
          },
          {
            label: 'Suspended',
            count: drivers.filter((d) => d.status === 'Suspended').length,
            color: 'text-danger',
          },
        ].map(({ label, count, color }) => (
          <CCol key={label} xs={6} sm={4} md={2}>
            <div className="border rounded p-2 text-center bg-body-tertiary">
              <div className={`fs-4 fw-bold ${color}`}>{count}</div>
              <div className="small text-body-secondary">{label}</div>
            </div>
          </CCol>
        ))}
      </CRow>

      {/* ── Filters (collapsible) ─────────────────────────────────────────── */}
      {showFilters && (
        <CCard className="mb-3">
          <CCardBody className="pb-1">
            <DriverFilters filters={filters} onChange={setFilters} />
          </CCardBody>
        </CCard>
      )}

      {/* ── Main table card ───────────────────────────────────────────────── */}
      <CCard className="mb-4">
        <CCardHeader className="d-flex align-items-center justify-content-between">
          <strong>Drivers</strong>
          <span className="small text-body-secondary">
            {displayedDrivers.length} of {drivers.length} drivers
          </span>
        </CCardHeader>
        <CCardBody>
          <DriverTable
            drivers={displayedDrivers}
            onView={openView}
            onEdit={openEdit}
            onDelete={openDelete}
          />
        </CCardBody>
      </CCard>

      {/* ── Modals ────────────────────────────────────────────────────────── */}
      <AddEditDriverModal
        visible={addEditModal.visible}
        driver={addEditModal.driver}
        allDrivers={drivers}
        onSave={handleSave}
        onClose={() => setAddEditModal({ visible: false, driver: null })}
      />

      <ViewDriverModal
        visible={viewModal.visible}
        driver={viewModal.driver}
        onClose={() => setViewModal({ visible: false, driver: null })}
      />

      <DeleteDriverModal
        visible={deleteModal.visible}
        driver={deleteModal.driver}
        onConfirm={handleDelete}
        onClose={() => setDeleteModal({ visible: false, driver: null })}
      />

      {/* ── Toast notifications ───────────────────────────────────────────── */}
      <CToaster
        placement="bottom-end"
        push={toasts.at(-1)?.content}
        key={toasts.at(-1)?.id}
      />
    </>
  )
}

export default DriverManagement
