/**
 * DriverTable Component
 *
 * Renders the paginated, sortable driver data table.
 * Pagination and sorting state are owned here; the parent
 * passes the already-filtered/searched drivers array.
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
import { sortDrivers, paginateDrivers, getStatusColor, getSafetyScoreColor } from '../../services/driverService'

const PAGE_SIZE = 8

// Column definitions — label, key, whether it is sortable
const COLUMNS = [
  { label: '#', key: null, sortable: false },
  { label: 'Driver Name', key: 'driverName', sortable: true },
  { label: 'License Number', key: 'licenseNumber', sortable: true },
  { label: 'License Category', key: 'licenseCategory', sortable: true },
  { label: 'Expiry Date', key: 'licenseExpiryDate', sortable: true },
  { label: 'Contact Number', key: 'contactNumber', sortable: true },
  { label: 'Safety Score', key: 'safetyScore', sortable: true },
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

const DriverTable = ({ drivers, onView, onEdit, onDelete }) => {
  const [sortKey, setSortKey] = useState('driverName')
  const [sortDir, setSortDir] = useState('asc')
  const [currentPage, setCurrentPage] = useState(1)

  // Reset to page 1 whenever the drivers array changes (filter / search)
  const prevLengthRef = React.useRef(drivers.length)
  if (prevLengthRef.current !== drivers.length) {
    prevLengthRef.current = drivers.length
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
    () => sortDrivers(drivers, sortKey, sortDir),
    [drivers, sortKey, sortDir],
  )

  const { pageData, totalPages, currentPage: safePage } = useMemo(
    () => paginateDrivers(sorted, currentPage, PAGE_SIZE),
    [sorted, currentPage],
  )

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  }

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
                No drivers match your search or filter criteria.
              </CTableDataCell>
            </CTableRow>
          ) : (
            pageData.map((driver, index) => (
              <CTableRow key={driver.id}>
                <CTableDataCell className="text-body-secondary">
                  {(safePage - 1) * PAGE_SIZE + index + 1}
                </CTableDataCell>

                <CTableDataCell>
                  <span className="fw-semibold">{driver.driverName}</span>
                </CTableDataCell>

                <CTableDataCell>{driver.licenseNumber}</CTableDataCell>

                <CTableDataCell>{driver.licenseCategory}</CTableDataCell>

                <CTableDataCell>{formatDate(driver.licenseExpiryDate)}</CTableDataCell>

                <CTableDataCell>{driver.contactNumber}</CTableDataCell>

                <CTableDataCell>
                  <CBadge color={getSafetyScoreColor(driver.safetyScore)} shape="rounded-pill">
                    {driver.safetyScore}
                  </CBadge>
                </CTableDataCell>

                <CTableDataCell>
                  <CBadge color={getStatusColor(driver.status)} shape="rounded-pill">
                    {driver.status}
                  </CBadge>
                </CTableDataCell>

                <CTableDataCell>
                  <CButtonGroup size="sm">
                    <CButton
                      color="info"
                      variant="outline"
                      title="View"
                      onClick={() => onView(driver)}
                    >
                      <CIcon icon={cilInfo} />
                    </CButton>
                    <CButton
                      color="primary"
                      variant="outline"
                      title="Edit"
                      onClick={() => onEdit(driver)}
                    >
                      <CIcon icon={cilPencil} />
                    </CButton>
                    <CButton
                      color="danger"
                      variant="outline"
                      title="Delete"
                      onClick={() => onDelete(driver)}
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
          Showing {drivers.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}–
          {Math.min(safePage * PAGE_SIZE, drivers.length)} of {drivers.length} drivers
        </div>
        <CPagination aria-label="Driver table navigation" size="sm" className="mb-0">
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

DriverTable.propTypes = {
  drivers: PropTypes.arrayOf(PropTypes.object).isRequired,
  onView: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default DriverTable
