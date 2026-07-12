/**
 * VehicleRegistry Page
 *
 * Main entry point for the Vehicle Registry module.
 * Owns all state: vehicle list, search query, filters, and modal visibility.
 * Sub-components (VehicleTable, VehicleFilters, modals) receive only what they need.
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

import VehicleFilters from './VehicleFilters'
import VehicleTable from './VehicleTable'
import AddEditVehicleModal from './AddEditVehicleModal'
import ViewVehicleModal from './ViewVehicleModal'
import DeleteVehicleModal from './DeleteVehicleModal'

import {
  loadVehicles,
  addVehicle,
  updateVehicle,
  deleteVehicle,
  searchVehicles,
  filterVehicles,
} from '../../services/vehicleService'

// ─── Toast helper ─────────────────────────────────────────────────────────────

const makeToast = (message, color = 'success') => (
  <CToast autohide delay={3000} visible color={color} className="text-white">
    <CToastBody>{message}</CToastBody>
  </CToast>
)

// ─── Component ────────────────────────────────────────────────────────────────

const VehicleRegistry = () => {
  // ── Data state ──────────────────────────────────────────────────────────────
  const [vehicles, setVehicles] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({ vehicleType: '', status: '' })
  const [showFilters, setShowFilters] = useState(false)

  // ── Modal state ─────────────────────────────────────────────────────────────
  const [addEditModal, setAddEditModal] = useState({ visible: false, vehicle: null })
  const [viewModal, setViewModal] = useState({ visible: false, vehicle: null })
  const [deleteModal, setDeleteModal] = useState({ visible: false, vehicle: null })

  // ── Toast state ─────────────────────────────────────────────────────────────
  const [toasts, setToasts] = useState([])

  const pushToast = (message, color) =>
    setToasts((prev) => [...prev, { id: Date.now(), content: makeToast(message, color) }])

  // ── Seed data on mount ──────────────────────────────────────────────────────
  useEffect(() => {
    setVehicles(loadVehicles())
  }, [])

  // ── Derived: filtered + searched list ───────────────────────────────────────
  const displayedVehicles = useMemo(() => {
    const afterSearch = searchVehicles(vehicles, searchQuery)
    return filterVehicles(afterSearch, filters.vehicleType, filters.status)
  }, [vehicles, searchQuery, filters])

  // ── CRUD handlers ────────────────────────────────────────────────────────────

  const handleSave = (vehicleData) => {
    if (addEditModal.vehicle) {
      // Edit mode
      setVehicles((prev) => updateVehicle(prev, addEditModal.vehicle.id, vehicleData))
      pushToast('Vehicle updated successfully.', 'success')
    } else {
      // Add mode
      setVehicles((prev) => addVehicle(prev, vehicleData))
      pushToast('Vehicle added successfully.', 'success')
    }
    setAddEditModal({ visible: false, vehicle: null })
  }

  const handleDelete = () => {
    setVehicles((prev) => deleteVehicle(prev, deleteModal.vehicle.id))
    pushToast('Vehicle deleted.', 'danger')
    setDeleteModal({ visible: false, vehicle: null })
  }

  // ── Modal openers ────────────────────────────────────────────────────────────

  const openAdd = () => setAddEditModal({ visible: true, vehicle: null })
  const openEdit = (vehicle) => setAddEditModal({ visible: true, vehicle })
  const openView = (vehicle) => setViewModal({ visible: true, vehicle })
  const openDelete = (vehicle) => setDeleteModal({ visible: true, vehicle })

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Page header ───────────────────────────────────────────────────── */}
      <CRow className="mb-4 align-items-center">
        <CCol>
          <h2 className="mb-0 fw-bold">Vehicle Registry</h2>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0 mt-1">
              <li className="breadcrumb-item">
                <a href="#/dashboard">Dashboard</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Vehicle Registry
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
              placeholder="Search vehicles…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search vehicles"
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
            Add Vehicle
          </CButton>
        </CCol>
      </CRow>

      {/* ── Summary chips ─────────────────────────────────────────────────── */}
      <CRow className="mb-3 g-3">
        {[
          { label: 'Total', count: vehicles.length, color: 'text-primary' },
          {
            label: 'Available',
            count: vehicles.filter((v) => v.status === 'Available').length,
            color: 'text-success',
          },
          {
            label: 'On Trip',
            count: vehicles.filter((v) => v.status === 'On Trip').length,
            color: 'text-primary',
          },
          {
            label: 'In Shop',
            count: vehicles.filter((v) => v.status === 'In Shop').length,
            color: 'text-warning',
          },
          {
            label: 'Retired',
            count: vehicles.filter((v) => v.status === 'Retired').length,
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
            <VehicleFilters filters={filters} onChange={setFilters} />
          </CCardBody>
        </CCard>
      )}

      {/* ── Main table card ───────────────────────────────────────────────── */}
      <CCard className="mb-4">
        <CCardHeader className="d-flex align-items-center justify-content-between">
          <strong>Vehicles</strong>
          <span className="small text-body-secondary">
            {displayedVehicles.length} of {vehicles.length} vehicles
          </span>
        </CCardHeader>
        <CCardBody>
          <VehicleTable
            vehicles={displayedVehicles}
            onView={openView}
            onEdit={openEdit}
            onDelete={openDelete}
          />
        </CCardBody>
      </CCard>

      {/* ── Modals ────────────────────────────────────────────────────────── */}
      <AddEditVehicleModal
        visible={addEditModal.visible}
        vehicle={addEditModal.vehicle}
        allVehicles={vehicles}
        onSave={handleSave}
        onClose={() => setAddEditModal({ visible: false, vehicle: null })}
      />

      <ViewVehicleModal
        visible={viewModal.visible}
        vehicle={viewModal.vehicle}
        onClose={() => setViewModal({ visible: false, vehicle: null })}
      />

      <DeleteVehicleModal
        visible={deleteModal.visible}
        vehicle={deleteModal.vehicle}
        onConfirm={handleDelete}
        onClose={() => setDeleteModal({ visible: false, vehicle: null })}
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

export default VehicleRegistry
