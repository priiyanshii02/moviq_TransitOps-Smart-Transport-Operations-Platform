import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCol,
  CRow,
} from '@coreui/react'

const Analytics = () => {
  // Mock data
  const [metricsData] = useState({
    fuelEfficiency: 8.4, // km/L
    fleetUtilization: 81, // %
    operationalCost: 34070, // ₹
    vehicleROI: 14.2, // %
  })

  const [monthlyRevenue] = useState([
    { month: 'Jan', revenue: 45000 },
    { month: 'Feb', revenue: 48000 },
    { month: 'Mar', revenue: 50000 },
    { month: 'Apr', revenue: 55000 },
    { month: 'May', revenue: 58000 },
    { month: 'Jun', revenue: 62000 },
    { month: 'Jul', revenue: 60000 },
  ])

  const [topCostlyVehicles] = useState([
    { vehicle: 'TRUCK-8', cost: 28500, percentage: 85, color: '#dc3545' },
    { vehicle: 'AUV-03', cost: 12300, percentage: 36, color: '#fd7e14' },
    { vehicle: 'VAV-05', cost: 8900, percentage: 26, color: '#0d6efd' },
  ])

  const [hoveredMonth, setHoveredMonth] = useState(null)
  const [animatedBars, setAnimatedBars] = useState({})

  // Trigger animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const animated = {}
      monthlyRevenue.forEach((_, idx) => {
        animated[idx] = true
      })
      setAnimatedBars(animated)
    }, 100)
    return () => clearTimeout(timer)
  }, [monthlyRevenue])

  const handleExportCSV = () => {
    // Create CSV content
    const csvContent = [
      ['Reports & Analytics'],
      [],
      ['Metrics'],
      ['Metric', 'Value'],
      ['Fuel Efficiency', `${metricsData.fuelEfficiency} km/L`],
      ['Fleet Utilization', `${metricsData.fleetUtilization}%`],
      ['Operational Cost', `₹${metricsData.operationalCost.toLocaleString()}`],
      ['Vehicle ROI', `${metricsData.vehicleROI}%`],
      [],
      ['Monthly Revenue'],
      ['Month', 'Revenue'],
      ...monthlyRevenue.map((m) => [m.month, `₹${m.revenue.toLocaleString()}`]),
      [],
      ['Top Costliest Vehicles'],
      ['Vehicle', 'Cost', 'Percentage'],
      ...topCostlyVehicles.map((v) => [v.vehicle, `₹${v.cost.toLocaleString()}`, `${v.percentage}%`]),
    ]

    const csv = csvContent.map((row) => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'analytics-report.csv'
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  return (
    <div>
      {/* Top Metrics */}
      <CRow className="mb-4">
        <CCol xs={12} sm={6} md={3} className="mb-3">
          <div className="rounded p-3 h-100" style={{ 
            borderLeft: '4px solid #0d6efd' 
          }}>
            <div className="text-muted small text-uppercase fw-semibold">Fuel Efficiency</div>
            <div className="h3 mb-2 fw-bold text-primary mt-2">{metricsData.fuelEfficiency} km/L</div>
            <div className="text-muted small">Distance / Fuel</div>
          </div>
        </CCol>

        <CCol xs={12} sm={6} md={3} className="mb-3">
          <div className="rounded p-3 h-100" style={{ 
            borderLeft: '4px solid #198754' 
          }}>
            <div className="text-muted small text-uppercase fw-semibold">Fleet Utilization</div>
            <div className="h3 mb-2 fw-bold text-success mt-2">{metricsData.fleetUtilization}%</div>
            <div className="text-muted small">Active / Total Vehicles</div>
          </div>
        </CCol>

        <CCol xs={12} sm={6} md={3} className="mb-3">
          <div className="rounded p-3 h-100" style={{ 
            borderLeft: '4px solid #ffc107' 
          }}>
            <div className="text-muted small text-uppercase fw-semibold">Operational Cost</div>
            <div className="h3 mb-2 fw-bold" style={{ color: '#ff9800' }}>₹{metricsData.operationalCost.toLocaleString()}</div>
            <div className="text-muted small">Fuel + Maintenance</div>
          </div>
        </CCol>

        <CCol xs={12} sm={6} md={3} className="mb-3">
          <div className="rounded p-3 h-100" style={{ 
            borderLeft: '4px solid #0dcaf0' 
          }}>
            <div className="text-muted small text-uppercase fw-semibold">Vehicle ROI</div>
            <div className="h3 mb-2 fw-bold text-info mt-2">{metricsData.vehicleROI}%</div>
            <div className="text-muted small">(Revenue - Cost) / Acq. Cost</div>
          </div>
        </CCol>
      </CRow>

      {/* Monthly Revenue Chart and Top Vehicles */}
      <CRow className="mb-4">
        {/* Monthly Revenue */}
        <CCol xs={12} md={7}>
          <div className="rounded p-4">
            <div className="text-uppercase small fw-bold text-muted mb-4">Monthly Revenue</div>
            
            <div className="d-flex align-items-flex-end" style={{ height: '320px', gap: '12px', paddingBottom: '10px' }}>
              {monthlyRevenue.map((item, idx) => {
                const maxValue = Math.max(...monthlyRevenue.map((m) => m.revenue))
                const heightPercent = (item.revenue / maxValue) * 100
                const isHovered = hoveredMonth === idx
                const isAnimated = animatedBars[idx]
                
                return (
                  <div
                    key={idx}
                    style={{
                      flex: 1,
                      position: 'relative',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      minHeight: '0',
                    }}
                    onMouseEnter={() => setHoveredMonth(idx)}
                    onMouseLeave={() => setHoveredMonth(null)}
                  >
                    <div
                      style={{
                        width: '100%',
                        height: isAnimated ? `${heightPercent}%` : '0%',
                        backgroundColor: isHovered ? '#0056b3' : '#0d6efd',
                        borderRadius: '8px 8px 0 0',
                        transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        position: 'relative',
                        boxShadow: isHovered ? '0 4px 12px rgba(13, 110, 253, 0.4)' : 'none',
                      }}
                    >
                      {isHovered && (
                        <div
                          style={{
                            position: 'absolute',
                            bottom: '100%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            backgroundColor: '#1a1a1a',
                            color: '#fff',
                            padding: '8px 14px',
                            borderRadius: '6px',
                            fontSize: '13px',
                            whiteSpace: 'nowrap',
                            marginBottom: '12px',
                            zIndex: 10,
                            fontWeight: 'bold',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                          }}
                        >
                          ₹{(item.revenue / 1000).toFixed(0)}K
                          <div style={{
                            position: 'absolute',
                            bottom: '-4px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '0',
                            height: '0',
                            borderLeft: '4px solid transparent',
                            borderRight: '4px solid transparent',
                            borderTop: '4px solid #1a1a1a',
                          }} />
                        </div>
                      )}
                    </div>
                    <div style={{ marginTop: '12px', fontSize: '12px', fontWeight: '600', color: 'currentColor', opacity: 0.7 }}>
                      {item.month}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </CCol>

        {/* Top Costliest Vehicles */}
        <CCol xs={12} md={5}>
          <div className="rounded p-4">
            <div className="text-uppercase small fw-bold text-muted mb-4">Top Costliest Vehicles</div>
            
            {topCostlyVehicles.map((vehicle, idx) => (
              <div key={idx} className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="fw-bold" style={{ fontSize: '14px' }}>{vehicle.vehicle}</span>
                  <span className="fw-bold" style={{ color: vehicle.color, fontSize: '14px' }}>
                    ₹{vehicle.cost.toLocaleString()}
                  </span>
                </div>
                
                <div className="progress" style={{ 
                  height: '10px', 
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                  borderRadius: '10px',
                  overflow: 'hidden'
                }}>
                  <div
                    className="progress-bar"
                    style={{
                      width: `${vehicle.percentage}%`,
                      backgroundColor: vehicle.color,
                      transition: 'width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      borderRadius: '10px',
                    }}
                  />
                </div>
                
                <div className="small text-muted mt-2" style={{ fontSize: '12px' }}>
                  {vehicle.percentage}% of total cost
                </div>
              </div>
            ))}
          </div>
        </CCol>
      </CRow>

      {/* Export Button */}
      <CRow className="mb-4">
        <CCol xs={12}>
          <CButton 
            color="primary" 
            onClick={handleExportCSV}
            className="fw-semibold"
            style={{ borderRadius: '6px' }}
          >
            ↓ Export CSV
          </CButton>
        </CCol>
      </CRow>
    </div>
  )
}

export default Analytics
