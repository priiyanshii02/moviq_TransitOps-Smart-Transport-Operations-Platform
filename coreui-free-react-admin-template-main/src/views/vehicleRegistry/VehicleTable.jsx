/**
 * VehicleTable Component
 *
 * Renders the paginated, sortable vehicle data table.
 * Pagination and sorting state are owned here; the parent
 * passes the already-filtered/searched vehicles array.
 */

import React, { useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import {
  CBadge,
  CButton,
  CButtonGroup,
  CPagination,
  CPaginationItem,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash, cilInfo, cilArrowTop, cilArrowBottom } from '@coreui/icons'
import { sortVehicles, paginateVehicles, getStatusColor } from '../../services/vehicleService'

const PAGE_SIZE = 8

// Column definitions — label, key, whether it is sortable
const COLUMNS = [
  { label: '#', key: null, sortable: false },
  { label: 'Reg. Number', key: 'registrationNumber', sortable: true },
  { label: 'Name / Model', key: 'vehicleName', sortable: true },
  { label: 'Type', key: 'vehicleType', sortable: true },
  { label: 'Max Load (kg)', key: 'maxLoadCapacity', sortable: true },
  { label: 'Odometer (km)', key: 'odometer', sortable: true },
  { label: 'Acq. Cost (₹)', key: 'acquisitionCost', sortable: true },
  { label: 'Status', key: 'status', sortable: true },
  { label: 'Actions', key: null, sortable: false },
]

const SortIcon = ({ column, sortKey, sortDir }) => {
  if (!column.sortable) return null
  if (sortKey !== column.key) {
    return <span className="ms-1 text-body-tertiary" style={{ fontSize: '0.7rem' }}>⇅</span>
  }
  return (
    <CIcon
      icon={sortDir === 'asc' ? cilArrowTop : cilArrowBottom}
      className="ms-1"
      style={{ width: 12, height: 12 }}
    />
  )
}

SortIcon.propTypes = {
  column: PropTypes.object.isRequired,
  sortKey: PropTypes.string,
  sortDir: PropTypes.string.isRequired,
}

const VehicleTable = ({ vehicles, onView, onEdit, onDelete }) => {
  const [sortKey, setSortKey] = useState('registrationNumber')
  const [sortDir, setSortDir] = useState('asc')
  const [currentPage, setCurrentPage] = useState(1)

  // Reset to page 1 whenever the vehicles array changes (filter / search)
  const prevLengthRef = React.useRef(vehicles.length)
  if (prevLengthRef.current !== vehicles.length) {
    prevLengthRef.current = vehicles.length
    // Defer the state update to avoid React warning about render-time setState
  }

  const handleSort = (key) => {
    if (!key) return
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
    setCurrentPage(1)
  }

  const sorted = useMemo(
    () => sortVehicles(vehicles, sortKey, sortDir),
    [vehicles, sortKey, sortDir],
  )

  const { pageData, totalPages, currentPage: safePage } = useMemo(
    () => paginateVehicles(sorted, currentPage, PAGE_SIZE),
    [sorted, currentPage],
  )

  const formatNumber = (n) => (n === 0 ? '—' : n.toLocaleString('en-IN'))

  return (
    <>
      <CTable align="middle" className="mb-0" hover responsive>
        <CTableHead>
          <CTableRow className="table-light">
            {COLUMNS.map((col) => (
              <CTableHeaderCell
                key={col.label}
                onClick={() => col.sortable && handleSort(col.key)}
                style={col.sortable ? { cursor: 'pointer', userSelect: 'none' } : {}}
                className={col.sortable ? 'text-nowrap' : ''}
              >
                {col.label}
                <SortIcon column={col} sortKey={sortKey} sortDir={sortDir} />
              </CTableHeaderCell>
            ))}
          </CTableRow>
        </CTableHead>

        <CTableBody>
          {pageData.length === 0 ? (
            <CTableRow>
              <CTableDataCell colSpan={COLUMNS.length} className="text-center text-body-secondary py-4">
                No vehicles match your search or filter criteria.
              </CTableDataCell>
            </CTableRow>
          ) : (
            pageData.map((vehicle, index) => (
              <CTableRow key={vehicle.id}>
                <CTableDataCell className="text-body-secondary">
                  {(safePage - 1) * PAGE_SIZE + index + 1}
                </CTableDataCell>

                <CTableDataCell>
                  <span className="fw-semibold">{vehicle.registrationNumber}</span>
                </CTableDataCell>

                <CTableDataCell>
                  <div className="fw-semibold">{vehicle.vehicleName}</div>
                  <div className="small text-body-secondary">{vehicle.vehicleModel}</div>
                </CTableDataCell>

                <CTableDataCell>{vehicle.vehicleType}</CTableDataCell>

                <CTableDataCell className="text-end">
                  {formatNumber(vehicle.maxLoadCapacity)}
                </CTableDataCell>

                <CTableDataCell className="text-end">
                  {formatNumber(vehicle.odometer)}
                </CTableDataCell>

                <CTableDataCell className="text-end">
                  {vehicle.acquisitionCost.toLocaleString('en-IN')}
                </CTableDataCell>

                <CTableDataCell>
                  <CBadge color={getStatusColor(vehicle.status)} shape="rounded-pill">
                    {vehicle.status}
                  </CBadge>
                </CTableDataCell>

                <CTableDataCell>
                  <CButtonGroup size="sm">
                    <CButton
                      color="info"
                      variant="outline"
                      title="View"
                      onClick={() => onView(vehicle)}
                    >
                      <CIcon icon={cilInfo} />
                    </CButton>
                    <CButton
                      color="primary"
                      variant="outline"
                      title="Edit"
                      onClick={() => onEdit(vehicle)}
                    >
                      <CIcon icon={cilPencil} />
                    </CButton>
                    <CButton
                      color="danger"
                      variant="outline"
                      title="Delete"
                      onClick={() => onDelete(vehicle)}
                    >
                      <CIcon icon={cilTrash} />
                    </CButton>
                  </CButtonGroup>
                </CTableDataCell>
              </CTableRow>
            ))
          )}
        </CTableBody>
      </CTable>

      {/* Pagination row */}
      <div className="d-flex align-items-center justify-content-between mt-3 flex-wrap gap-2">
        <div className="small text-body-secondary">
          Showing {vehicles.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}–
          {Math.min(safePage * PAGE_SIZE, vehicles.length)} of {vehicles.length} vehicles
        </div>
        <CPagination aria-label="Vehicle table navigation" size="sm" className="mb-0">
          <CPaginationItem
            aria-label="Previous"
            disabled={safePage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            style={{ cursor: safePage === 1 ? 'default' : 'pointer' }}
          >
            &laquo;
          </CPaginationItem>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <CPaginationItem
              key={page}
              active={page === safePage}
              onClick={() => setCurrentPage(page)}
              style={{ cursor: 'pointer' }}
            >
              {page}
            </CPaginationItem>
          ))}
          <CPaginationItem
            aria-label="Next"
            disabled={safePage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            style={{ cursor: safePage === totalPages ? 'default' : 'pointer' }}
          >
            &raquo;
          </CPaginationItem>
        </CPagination>
      </div>
    </>
  )
}

VehicleTable.propTypes = {
  vehicles: PropTypes.arrayOf(PropTypes.object).isRequired,
  onView: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default VehicleTable
