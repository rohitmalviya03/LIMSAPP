import React, { useRef } from "react";

export default function BillReceiptModal({
  open,
  onClose,
  bill,
  patient,
  subtotal,
  discountAmt,
  taxAmt,
  total,
  formatDateTime,
  orgDetails = {
    name: "Modern Diagnostics Lab",
    address: "123 Health Avenue, City, State 123456",
    gst: "22AAAAA0000A1Z5",
    phone: "+91-9876543210",
    email: "info@modernlab.com"
  }
}) {
  const printRef = useRef();

  if (!open || !bill) return null;

  // Parse items from bill.itemsJson
  const billItems = bill.itemsJson ? JSON.parse(bill.itemsJson) : [];
  const gstRate = bill.taxPercent || 0;
  const gstAmount = Number(taxAmt) || 0;
  const gstSplit = gstAmount / 2;

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const printWindow = window.open("", "_blank", "width=800,height=900");
    printWindow.document.write(`
      <html>
        <head>
          <title>Tax Invoice - ${orgDetails.name}</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; margin: 24px; background: #f8f9fa; }
            .bill-box { background: #fff; border-radius: 12px; max-width: 650px; margin: auto; box-shadow: 0 0 18px #0002; padding: 32px; }
            .lims-bill-header { text-align: center; margin-bottom: 16px; border-bottom: 2px solid #eee; padding-bottom: 10px; }
            .lims-org-details { text-align: center; margin-bottom: 18px; color: #1953a8; }
            .lims-org-details h1 { margin: 0 0 2px 0; font-size: 2em; }
            .lims-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            .lims-table th, .lims-table td { border: 1px solid #aaa; padding: 8px; text-align: left; }
            .lims-table th { background: #e0e7ff; }
            .lims-bill-summary { margin-top: 16px; width: 100%; }
            .lims-bill-summary tr td { padding: 4px 8px; }
            .lims-signature { margin-top: 32px; display: flex; justify-content: flex-end; }
            .lims-signature div { border-top: 1px solid #777; font-size: 0.95em; color: #555; padding-top: 5px; }
          </style>
        </head>
        <body><div class='bill-box'>${printContents}</div></body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    setTimeout(() => printWindow.close(), 600);
  };

  return (
    <div style={{
      position: "fixed", left: 0, top: 0, width: "100vw", height: "100vh",
      background: "rgba(0,0,0,0.4)", zIndex: 9999, display: "flex",
      alignItems: "center", justifyContent: "center"
    }}>
      <div
        style={{
          background: "#fff",
          borderRadius: 14,
          padding: "0",
          minWidth: 420,
          maxWidth: 720,
          width: "90vw",
          maxHeight: "90vh",
          boxShadow: "0 2px 24px #3337",
          position: "relative",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <span
          onClick={onClose}
          style={{
            position: "absolute", right: 18, top: 10, cursor: "pointer", fontSize: 27, color: "#1953a8", fontWeight: 700, zIndex: 2
          }}
          title="Close"
        >×</span>
        {/* Scrollable bill content */}
        <div
          ref={printRef}
          style={{
            overflowY: "auto",
            padding: 28,
            maxHeight: "70vh"
          }}
        >
          <div className="lims-bill-header">
            <div className="lims-org-details">
              <h1>{orgDetails.name}</h1>
              <div style={{ fontSize: "1.09em" }}>{orgDetails.address}</div>
              <div><b>GSTIN:</b> {orgDetails.gst} | <b>Phone:</b> {orgDetails.phone}</div>
              <div><b>Email:</b> {orgDetails.email}</div>
            </div>
            <h2 style={{ letterSpacing: "1px", color: "#1953a8", marginBottom: 2 }}>Tax Invoice</h2>
            <div><b>Invoice #:</b> {bill.id || "N/A"} &nbsp; | &nbsp;
              <b>Date:</b> {formatDateTime ? formatDateTime(new Date(bill.date || Date.now())) : (new Date()).toLocaleString()}
            </div>
          </div>
          <div style={{ marginBottom: 10, color: "#444", fontSize: "1.01em" }}>
            <b>Billed To:</b> {patient?.firstName} {patient?.lastName} &nbsp;|&nbsp;
            <b>MRN:</b> {patient?.mrn}
          </div>
          <table className="lims-table">
            <thead>
              <tr>
                <th>Sr.</th>
                <th>Item Description</th>
                <th>HSN/SAC</th>
                <th>Qty</th>
                <th>Unit Price (₹)</th>
                <th>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {billItems.map((item, idx) => (
                <tr key={item.id || item.key || idx}>
                  <td>{idx + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.hsn || "9983"}</td>
                  <td>1</td>
                  <td>{Number(item.price).toFixed(2)}</td>
                  <td>{Number(item.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <table className="lims-bill-summary" style={{ float: "right", minWidth: 270, marginTop: 16 }}>
            <tbody>
              <tr>
                <td><b>Subtotal</b></td>
                <td align="right">₹ {Number(subtotal).toFixed(2)}</td>
              </tr>
              <tr>
                <td>Discount</td>
                <td align="right">₹ {discountAmt?.toFixed(2) ?? "0.00"}</td>
              </tr>
              <tr>
                <td>Taxable Value</td>
                <td align="right">₹ {(subtotal - discountAmt).toFixed(2)}</td>
              </tr>
              <tr>
                <td>CGST @{(gstRate/2).toFixed(1)}%</td>
                <td align="right">₹ {gstSplit.toFixed(2)}</td>
              </tr>
              <tr>
                <td>SGST @{(gstRate/2).toFixed(1)}%</td>
                <td align="right">₹ {gstSplit.toFixed(2)}</td>
              </tr>
              <tr style={{ borderTop: "2px solid #eee" }}>
                <td><b>Total</b></td>
                <td align="right"><b>₹ {Number(total).toFixed(2)}</b></td>
              </tr>
            </tbody>
          </table>
          <div style={{ clear: "both" }}></div>
          <div style={{ marginTop: 38, color: "#666", fontSize: ".95em" }}>
            <b>Amount in Words:</b> <i>{numToWords(total)} only.</i>
          </div>
          <div className="lims-signature">
            <div>
              Authorised Signatory<br />
              <span style={{ fontSize: "0.88em", color: "#888" }}>{orgDetails.name}</span>
            </div>
          </div>
          <div style={{ marginTop: 18, textAlign: "center", color: "#a7a7a7", fontSize: "0.97em" }}>
            Thank you for choosing {orgDetails.name}!
          </div>
        </div>
        {/* Action buttons pinned at bottom */}
        <div style={{
          padding: "18px 28px 12px 28px",
          borderTop: "1px solid #ececec",
          background: "#fff",
          textAlign: "right",
          position: "sticky",
          bottom: 0,
          zIndex: 1
        }}>
          <button className="btn" style={{ marginRight: 12, background: "#1953a8", color: "#fff" }} onClick={handlePrint}>🖨️ Print</button>
          <button className="btn btn-danger" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

// Helper: Convert number to words (basic, for INR)
function numToWords(num) {
  if (!num) return "zero";
  const a = [
    '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven',
    'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen',
    'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'
  ];
  const b = [
    '', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty',
    'seventy', 'eighty', 'ninety'
  ];

  function inWords (n) {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? '-' + a[n % 10] : '');
    if (n < 1000) return a[Math.floor(n / 100)] + ' hundred' + (n % 100 ? ' and ' + inWords(n % 100) : '');
    if (n < 100000) return inWords(Math.floor(n / 1000)) + ' thousand' + (n % 1000 !== 0 ? ' ' + inWords(n % 1000) : '');
    if (n < 10000000) return inWords(Math.floor(n / 100000)) + ' lakh' + (n % 100000 !== 0 ? ' ' + inWords(n % 100000) : '');
    return inWords(Math.floor(n / 10000000)) + ' crore' + (n % 10000000 !== 0 ? ' ' + inWords(n % 10000000) : '');
  }
  return inWords(Math.floor(num));
}