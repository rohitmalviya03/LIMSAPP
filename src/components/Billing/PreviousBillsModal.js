import React from "react";

// Helper for summary
function calcPrevBillSummary(bill, formatDateTime) {
  if (!bill) return { amount: 0, date: "" };
  const items = bill.itemsJson ? JSON.parse(bill.itemsJson) : [];
  const subtotal = items.reduce((a, b) => a + (b.price || 0), 0);
  const discountAmt = ((subtotal * (parseFloat(bill.discountPercent) || 0)) / 100);
  const taxable = subtotal - discountAmt;
  const taxAmt = ((taxable * (parseFloat(bill.taxPercent) || 0)) / 100);
  const total = Math.round(taxable + taxAmt);
  return {
    amount: total,
    date: formatDateTime(bill.createdAt || bill.date || bill.created || bill.updatedAt || new Date())
  };
}

export default function PreviousBillsModal({
  open,
  onClose,
  bills,
  patient,
  onView,
  onDownload,
  formatDateTime,
  loading
}) {
  if (!open) return null;

  return (
    <div style={{
      position: "fixed", left: 0, top: 0, width: "100vw", height: "100vh",
      background: "rgba(0,0,0,0.4)", zIndex: 9999, display: "flex",
      alignItems: "center", justifyContent: "center"
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 16,
        minWidth: 380,
        maxWidth: 650,
        width: "92vw",
        maxHeight: "86vh",
        boxShadow: "0 4px 32px #0003",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative"
      }}>
        <span
          onClick={onClose}
          style={{
            position: "absolute", right: 22, top: 15, cursor: "pointer", fontSize: 28, color: "#1953a8", fontWeight: 700, zIndex: 2
          }}
          title="Close"
        >×</span>
        <div style={{
          background: "linear-gradient(90deg,#1953a8,#54a0ff 80%)", color: "#fff",
          padding: "22px 28px 18px 28px"
        }}>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 1 }}>Previous Bills</div>
          {patient && (
            <div style={{ marginTop: 4, fontSize: 14 }}>
              <span style={{ fontWeight: 600 }}>{patient.firstName} {patient.lastName}</span>
              {patient.mrn && <span style={{ marginLeft: 18, color: "#e5e5e5" }}>MRN: {patient.mrn}</span>}
            </div>
          )}
        </div>
        <div style={{
          flex: 1, overflowY: "auto", background: "#f7f9fa", padding: "0 0 0 0"
        }}>
          {loading && <div style={{ padding: 36, textAlign: "center" }}>Loading…</div>}
          {!loading && bills.length === 0 &&
            <div style={{ padding: 36, textAlign: "center", color: "#999", fontSize: 16 }}>
              No previous bills found for this patient.
            </div>
          }
          {!loading && bills.length > 0 &&
            <table style={{
              width: "100%",
              borderSpacing: 0,
              fontSize: 15,
              margin: 0,
              background: "#fff"
            }}>
              <thead>
                <tr style={{ background: "#f0f6ff", fontSize: 15 }}>
                  <th style={{ padding: "12px 8px" }}>Bill ID</th>
                  <th style={{ padding: "12px 8px" }}>Date</th>
                  <th style={{ padding: "12px 8px" }}>Total (₹)</th>
                  <th style={{ padding: "12px 8px" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill, i) => {
                  const summary = calcPrevBillSummary(bill, formatDateTime);
                  return (
                    <tr key={bill.id}
                      style={{
                        background: i % 2 === 0 ? "#fafdff" : "#f4f5fa",
                        transition: "background 0.18s"
                      }}>
                      <td style={{ padding: "11px 8px", fontWeight: 600, color: "#1953a8" }}>{bill.id}</td>
                      <td style={{ padding: "11px 8px", color: "#555" }}>{summary.date}</td>
                      <td style={{ padding: "11px 8px", color: "#008051", fontWeight: 600 }}>₹ {summary.amount}</td>
                      <td style={{ padding: "11px 8px" }}>
                        <button
                          className="btn btn-primary"
                          style={{
                            padding: "3px 13px", marginRight: 6, fontSize: 14, borderRadius: 5, boxShadow: "0 1px 6px #1953a830"
                          }}
                          onClick={() => onView(bill)}
                        >
                          👁️ View
                        </button>
                        <button
                          className="btn"
                          style={{
                            padding: "3px 13px", fontSize: 14, borderRadius: 5, background: "#f4f6fb", color: "#1953a8", border: "1px solid #dbeafe"
                          }}
                          onClick={() => onDownload(bill)}
                        >
                          ⬇️ Download
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          }
        </div>
        <div style={{
          padding: "16px 28px 14px 28px", borderTop: "1px solid #e5ecfa",
          background: "#f0f6ff", textAlign: "right"
        }}>
          <button className="btn btn-danger" onClick={onClose} style={{ fontWeight: 600, padding: "6px 22px" }}>Close</button>
        </div>
      </div>
    </div>
  );
}