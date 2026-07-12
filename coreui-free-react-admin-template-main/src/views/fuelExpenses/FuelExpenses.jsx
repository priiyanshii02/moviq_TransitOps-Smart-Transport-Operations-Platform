import React, { useState } from 'react'
import {
  CButton,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

const FuelExpenses = () => {
  const [vehicles] = useState([
    { id: 'V1', name: 'VAV-05', regNo: 'MH-12-AB-1234' },
    { id: 'V2', name: 'TRUCK-8', regNo: 'DL-01-CD-5678' },
    { id: 'V3', name: 'AUV-04', regNo: 'KA-03-EF-9012' },
  ])

  const [fuelLogs, setFuelLogs] = useState([
    { id: 'F001', vehicle: 'VAV-05', date: '06 Jul 2026', liters: '42 L', cost: '5,650' },
    { id: 'F002', vehicle: 'TRUCK-8', date: '06 Jul 2026', liters: '60 L', cost: '9,100' },
    { id: 'F003', vehicle: 'AUV-04', date: '06 Jul 2026', liters: '28 L', cost: '2,060' },
  ])

  const [expenses, setExpenses] = useState([
    { id: 'E001', tripId: 'TRIP01', vehicle: 'VAV-05', toll: '150', other: '0', maintenance: '0', total: 'Available' },
    { id: 'E002', tripId: 'TRIP02', vehicle: 'TRUCK-8', toll: '240', other: '150', maintenance: '19,000', total: 'Completed' },
  ])

  const [showFuelModal, setShowFuelModal] = useState(false)
  const [showExpenseModal, setShowExpenseModal] = useState(false)

  const [fuelForm, setFuelForm] = useState({
    vehicle: '',
    date: '',
    liters: '',
    cost: '',
  })

  const [expenseForm, setExpenseForm] = useState({
    tripId: '',
    vehicle: '',
    toll: '',
    other: '',
    maintenance: '',
  })

  const handleFuelSave = (e) => {
    e.preventDefault()
    if (!fuelForm.vehicle || !fuelForm.date || !fuelForm.liters || !fuelForm.cost) {
      return
    }

    const newLog = {
      id: `F${Date.now()}`,
      vehicle: fuelForm.vehicle,
      date: fuelForm.date,
      liters: fuelForm.liters,
      cost: fuelForm.cost,
    }

    setFuelLogs([...fuelLogs, newLog])
    setFuelForm({ vehicle: '', date: '', liters: '', cost: '' })
    setShowFuelModal(false)
  }

  const handleExpenseSave = (e) => {
    e.preventDefault()
    if (!expenseForm.tripId || !expenseForm.vehicle || !expenseForm.toll || !expenseForm.other || !expenseForm.maintenance) {
      return
    }

    const newExpense = {
      id: `E${Date.now()}`,
      tripId: expenseForm.tripId,
      vehicle: expenseForm.vehicle,
      toll: expenseForm.toll,
      other: expenseForm.other,
      maintenance: expenseForm.maintenance,
      total: 'Completed',
    }

    setExpenses([...expenses, newExpense])
    setExpenseForm({ tripId: '', vehicle: '', toll: '', other: '', maintenance: '' })
    setShowExpenseModal(false)
  }

  // Calculate totals
  const totalFuelCost = fuelLogs.reduce((sum, log) => {
    const cost = parseInt(log.cost.replace(/,/g, '')) || 0
    return sum + cost
  }, 0)

  const totalMaintenanceCost = expenses.reduce((sum, exp) => {
    const maintenance = parseInt(exp.maintenance.replace(/,/g, '')) || 0
    return sum + maintenance
  }, 0)

  const operationalCost = totalFuelCost + totalMaintenanceCost

  return (
    <div>
      {/* Fuel Logs Section */}
      <CRow className="mb-4">
        <CCol xs={12}>
          <div className="mb-3 d-flex justify-content-between align-items-center">
            <h6 className="mb-0">FUEL LOGS</h6>
            <div>
              <CButton
                color="warning"
                size="sm"
                onClick={() => setShowFuelModal(true)}
                className="me-2"
              >
                + Log Fuel
              </CButton>
              <CButton
                color="warning"
                size="sm"
                onClick={() => setShowExpenseModal(true)}
              >
                + Add Expense
              </CButton>
            </div>
          </div>

          <div className="table-responsive">
            <CTable striped hover className="mb-0">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>VEHICLE</CTableHeaderCell>
                  <CTableHeaderCell>DATE</CTableHeaderCell>
                  <CTableHeaderCell>LITERS</CTableHeaderCell>
                  <CTableHeaderCell>FUEL COST</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {fuelLogs.map((log) => (
                  <CTableRow key={log.id}>
                    <CTableDataCell>{log.vehicle}</CTableDataCell>
                    <CTableDataCell>{log.date}</CTableDataCell>
                    <CTableDataCell>{log.liters}</CTableDataCell>
                    <CTableDataCell>{log.cost}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </div>
        </CCol>
      </CRow>

      {/* Other Expenses Section */}
      <CRow className="mb-4">
        <CCol xs={12}>
          <div className="mb-3">
            <h6 className="mb-0">OTHER EXPENSES (TOLL / MISC)</h6>
          </div>

          <div className="table-responsive">
            <CTable striped hover className="mb-0">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>TRIP ID</CTableHeaderCell>
                  <CTableHeaderCell>VEHICLE</CTableHeaderCell>
                  <CTableHeaderCell>TOLL</CTableHeaderCell>
                  <CTableHeaderCell>OTHER</CTableHeaderCell>
                  <CTableHeaderCell>MAINTENANCE</CTableHeaderCell>
                  <CTableHeaderCell>TOTAL</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {expenses.map((exp) => (
                  <CTableRow key={exp.id}>
                    <CTableDataCell>{exp.tripId}</CTableDataCell>
                    <CTableDataCell>{exp.vehicle}</CTableDataCell>
                    <CTableDataCell>{exp.toll}</CTableDataCell>
                    <CTableDataCell>{exp.other}</CTableDataCell>
                    <CTableDataCell>{exp.maintenance}</CTableDataCell>
                    <CTableDataCell>{exp.total}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </div>
        </CCol>
      </CRow>

      {/* Total Operational Cost */}
      <CRow className="mb-4">
        <CCol xs={12} className="text-end">
          <div className="small text-muted">
            TOTAL OPERATIONAL COST (AUTO) = FUEL + MAINT
          </div>
          <div className="h5 fw-bold">
            ₹{operationalCost.toLocaleString()}
          </div>
        </CCol>
      </CRow>

      {/* Fuel Log Modal */}
      <CModal visible={showFuelModal} onClose={() => setShowFuelModal(false)}>
        <CModalHeader closeButton>
          <CModalTitle>Log Fuel</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel>Vehicle</CFormLabel>
              <CFormSelect
                value={fuelForm.vehicle}
                onChange={(e) => setFuelForm({ ...fuelForm, vehicle: e.target.value })}
              >
                <option value="">Select Vehicle</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.name}>
                    {v.name}
                  </option>
                ))}
              </CFormSelect>
            </div>
            <div className="mb-3">
              <CFormLabel>Date</CFormLabel>
              <CFormInput
                type="date"
                value={fuelForm.date}
                onChange={(e) => setFuelForm({ ...fuelForm, date: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Liters</CFormLabel>
              <CFormInput
                type="text"
                value={fuelForm.liters}
                onChange={(e) => setFuelForm({ ...fuelForm, liters: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Fuel Cost</CFormLabel>
              <CFormInput
                type="text"
                value={fuelForm.cost}
                onChange={(e) => setFuelForm({ ...fuelForm, cost: e.target.value })}
              />
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowFuelModal(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleFuelSave}>
            Save
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Expense Modal */}
      <CModal visible={showExpenseModal} onClose={() => setShowExpenseModal(false)}>
        <CModalHeader closeButton>
          <CModalTitle>Add Expense</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel>Trip ID</CFormLabel>
              <CFormInput
                type="text"
                value={expenseForm.tripId}
                onChange={(e) => setExpenseForm({ ...expenseForm, tripId: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Vehicle</CFormLabel>
              <CFormSelect
                value={expenseForm.vehicle}
                onChange={(e) => setExpenseForm({ ...expenseForm, vehicle: e.target.value })}
              >
                <option value="">Select Vehicle</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.name}>
                    {v.name}
                  </option>
                ))}
              </CFormSelect>
            </div>
            <div className="mb-3">
              <CFormLabel>Toll</CFormLabel>
              <CFormInput
                type="text"
                value={expenseForm.toll}
                onChange={(e) => setExpenseForm({ ...expenseForm, toll: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Other</CFormLabel>
              <CFormInput
                type="text"
                value={expenseForm.other}
                onChange={(e) => setExpenseForm({ ...expenseForm, other: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Maintenance</CFormLabel>
              <CFormInput
                type="text"
                value={expenseForm.maintenance}
                onChange={(e) => setExpenseForm({ ...expenseForm, maintenance: e.target.value })}
              />
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowExpenseModal(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleExpenseSave}>
            Save
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default FuelExpenses
