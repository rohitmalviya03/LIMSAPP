import React, { useState, useEffect } from "react";
import api from "../../api/api";
import "../../styles/billing.css";
import BillReceiptModal from "./BillReceiptModal";
import PreviousBillsModal from "./PreviousBillsModal";

import { useAuth } from "../../context/AuthContext";
// Add this helper to load Razorpay script if not already loaded
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const BillingModule = () => {
  // Core billing states
  const [search, setSearch] = useState("");
  const [patient, setPatient] = useState(null);
  const [tests, setTests] = useState([]);
  const [customItems, setCustomItems] = useState([]);
  const [billItems, setBillItems] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [taxPercent, setTaxPercent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("");
  const [testOptions, setTestOptions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [bill, setBill] = useState(null);

  // Previous bills popup
  const [showPrevBillsModal, setShowPrevBillsModal] = useState(false);
  const [previousBills, setPreviousBills] = useState([]);
  const [prevBillLoading, setPrevBillLoading] = useState(false);

  // Individual bill view
  const [viewBill, setViewBill] = useState(null);
  const [viewBillPatient, setViewBillPatient] = useState(null);

  // Utility function for date formatting
  const formatDate = (d) => {
    if (!d) return "";
    const date = new Date(d);
    return date.toLocaleDateString("en-GB"); // DD/MM/YYYY
  };
  const formatDateTime = (d) => {
    if (!d) return "";
    const date = new Date(d);
    return `${date.toLocaleDateString("en-GB")} ${date.toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit' })}`;
  };


  const { getLabcode } = useAuth();
const labcode = getLabcode(); // Get labcode from context
  // Helper to get test name by testId
  const getTestName = (testId) => {
    const found = testOptions.find(opt => String(opt.id) === String(testId));
    return found ? found.testName : testId;
  };
  // Fetch master list of tests
  useEffect(() => {
   const res= api.get(`/tests-master?labcode=`+labcode)
      .then(res => setTestOptions(res.data || []))
      .catch(() => setTestOptions([]));
  
    }, []);

  // Search patient by MRN or name
  const handleSearch = async (e) => {
    e.preventDefault();
    setSubmitStatus("");
    setPatient(null);
    setTests([]);
    setPreviousBills([]);
    if (!search.trim()) return;
    setLoading(true);
    try {
      let res;
      if (/^\d+$/.test(search.trim())) {
        res = await api.get(`/patients/search?mrn=${search.trim()}&labcode=`+labcode);
        setPatient(res.data);
      } else {
        res = await api.get(`/patients/search?name=${encodeURIComponent(search.trim())}&labcode=`+labcode);
        setPatient(res.data[0]);
      }
      if (res && res.data && res.data.id) {
        const testsRes = await api.get(`/raisedtests?patientId=${res.data.id}&labcode=`+labcode);
        setTests((testsRes.data || []).filter(t => !t.billed)); // Only unbilled tests
        setBillItems([]);
        // Fetch previous bills for the patient
        setPrevBillLoading(true);
        api.get(`/bills/history?patientId=${res.data.id}&labcode=`+labcode)
          .then(billRes => setPreviousBills(billRes.data || []))
          .finally(() => setPrevBillLoading(false));
      }
    } catch {
      setSubmitStatus("Patient not found.");
    }
    setLoading(false);
  };

  // Helper to get price if not present on test (fallback to master list)
  const getTestPrice = (test) => {

    console.log("getTestPrice called with test:", testOptions);
    if (typeof test.price === "number" && test.price > 0) return test.price;
    if (!testOptions.length) return 0;
    // Try to match by testId first, then by testName
    let found = testOptions.find(opt => String(opt.id) === String(test.testName));
    if (!found && test.testName) {
      found = testOptions.find(opt => opt.testName === test.testName);
    }
    return found && found.price ? found.price : 0;
  };

  // Add test to bill
  const addTestToBill = (test) => {
    if (billItems.find(item => item.type === "test" && item.id === test.id)) return;
    setBillItems([...billItems, {
      type: "test",
      id: test.id,
      name: getTestName(test.testId),
      price: getTestPrice(test)
    }]);
  };

  // Add custom item to bill
  const addCustomItem = () => {
    setCustomItems([...customItems, { name: "", price: 0, key: Date.now() + Math.random() }]);
  };

  const updateCustomItem = (idx, field, value) => {
    const updated = [...customItems];
    updated[idx][field] = field === "price" ? parseFloat(value) || 0 : value;
    setCustomItems(updated);
  };

  const addAllCustomToBill = () => {
    setBillItems([
      ...billItems,
      ...customItems
        .filter(item => item.name && item.price > 0)
        .map(item => ({ type: "custom", name: item.name, price: item.price, key: item.key }))
    ]);
    setCustomItems([]);
  };

  // Remove item from bill
  const removeBillItem = (idx) => {
    setBillItems(billItems.filter((_, i) => i !== idx));
  };

  // Calculate totals
  const subtotal = billItems.reduce((a, b) => a + (b.price || 0), 0);
  const discountAmt = (subtotal * (parseFloat(discount) || 0)) / 100;
  const taxable = subtotal - discountAmt;
  const taxAmt = (taxable * (parseFloat(taxPercent) || 0)) / 100;
  const total = Math.round(taxable + taxAmt);

  // Submit bill (sample: POST /bills)
  const handleSubmit = async () => {
    setSubmitStatus("");
    if (!patient || billItems.length === 0) {
      setSubmitStatus("Please select a patient and add items to bill.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/bills", {
        patientId: patient.id,
        items: billItems,
        discountPercent: discount,
        taxPercent: taxPercent,
        labcode: labcode, // Use labcode from context
        total
      });
      setSubmitStatus("Bill generated successfully!");
      handleShowReceipt(res.data);
    } catch {
      setSubmitStatus("Failed to generate bill.");
    }
    setLoading(false);
  };

  // Show bill receipt in modal
  const handleShowReceipt = (generatedBill) => {
    setBill(generatedBill);
    setShowModal(true);
  };

  // -- Previous Bill Modal Logic
  const handleShowPrevBillsModal = () => setShowPrevBillsModal(true);
  const handleClosePrevBillsModal = () => setShowPrevBillsModal(false);
  const handleViewPrevBill = (bill) => {
    setViewBill(bill);
    setViewBillPatient(patient); // since from search
  };

  // Download bill as PDF (using print dialog for now, but can be improved)
  const handleDownloadBill = (bill) => {
    setViewBill(bill);
    setViewBillPatient(patient);
    setTimeout(() => {
      window.print();
    }, 400);
  };

  // Helper for previous bill summary
  function calcPrevBillSummary(bill) {
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

  // Add this function inside BillingModule component
  const handleRazorpayPayment = async () => {
    if (!bill) return;
    const res = await api.post("/razorpay/create-order", {
      amount: total * 100, // Razorpay expects paise
      currency: "INR",
      receipt: `bill_${bill.id}`,
      billId: bill.id
    });
    const { orderId, key } = res.data;

    await loadRazorpayScript();

    const options = {
      key,
      amount: total * 100,
      currency: "INR",
      name: "LIMS Billing",
      description: `Payment for Bill #${bill.id}`,
      order_id: orderId,
      handler: async function (response) {
        // Send payment details to backend for verification and saving
        await api.post("/razorpay/verify", {
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
          billId: bill.id
        });
        setSubmitStatus("Payment successful!");
        // Optionally, you can refresh bill/payment status here
      },
      prefill: {
        name: patient?.firstName + " " + patient?.lastName,
        email: patient?.email,
        contact: patient?.phone
      },
      theme: { color: "#1976d2" }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="lims-billing-container" style={{ maxWidth: 740, margin: "0 auto", padding: "18px 12px" }}>
      <h2 className="lims-title" style={{ textAlign: "center", letterSpacing: "1px", color: "#1953a8" }}>💵 Billing Module</h2>

      {/* Patient Search */}
      <form onSubmit={handleSearch} style={{ marginBottom: 24, display: "flex", alignItems: "center", gap: 16, justifyContent: "center" }}>
        <label style={{ fontWeight: 600, fontSize: 16 }}>Patient MRN / Name:</label>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="e.g. 12345 or John"
          style={{ maxWidth: 220, padding: "7px 10px", borderRadius: 5, border: "1px solid #1953a880" }}
        />
        <button type="submit" className="btn btn-primary" style={{ padding: "7px 24px" }}>
          Find Patient
        </button>
      </form>

      {/* Patient Details */}
      {patient && (
        <div className="lims-card" style={{ marginBottom: 20, padding: "18px 26px", border: "1px solid #1953a860", borderRadius: 8, background: "#f7f9ff" }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#1953a8" }}>{patient.firstName} {patient.lastName}</div>
          <div><b>MRN:</b> {patient.mrn}</div>
          <div><b>Registration Date:</b> {formatDate(patient.registrationDate)}</div>
          {/* Previous bills link */}
          <div style={{ marginTop: 12 }}>
            <a href="#" onClick={e => { e.preventDefault(); handleShowPrevBillsModal(); }}>
              <span style={{ color: "#185", textDecoration: "underline", cursor: "pointer" }}>View Previous Bills</span>
            </a>
          </div>
        </div>
      )}

      {/* Tests to Bill List */}
      {tests.length > 0 && (
        <div className="lims-card" style={{ marginBottom: 18, padding: "16px 16px 6px 16px" }}>
          <div style={{ fontWeight: 700, marginBottom: 7, fontSize: 16, color: "#185" }}>Unbilled Tests</div>
          <table className="lims-table">
            <thead>
              <tr>
                <th>Test Name</th>
                <th>Sample #</th>
                <th>Price</th>
                <th>Add</th>
              </tr>
            </thead>
            <tbody>
              {tests.map(t => (
                <tr key={t.id}>
                  <td>{getTestName(t.testName)}</td>
                  <td>{t.sampleNumber}</td>
                  <td>₹ {getTestPrice(t)}</td>
                  <td>
                    <button className="btn btn-primary" onClick={() => addTestToBill(t)} style={{ fontSize: 15, padding: "2px 8px" }}>
                      ➕ Add
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Custom Items */}
      <div className="lims-card" style={{ marginBottom: 18, padding: "16px 16px 10px 16px" }}>
        <div style={{ fontWeight: 700, marginBottom: 7, fontSize: 15, color: "#1953a8" }}>Add Custom Item</div>
        {customItems.map((item, idx) => (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }} key={item.key}>
            <input
              style={{ width: 180, borderRadius: 3, padding: "3px 8px" }}
              placeholder="Item Name"
              value={item.name}
              onChange={e => updateCustomItem(idx, "name", e.target.value)}
            />
            <input
              style={{ width: 90, borderRadius: 3, padding: "3px 8px" }}
              type="number"
              placeholder="Amount"
              min={0} step={1}
              value={item.price}
              onChange={e => updateCustomItem(idx, "price", e.target.value)}
            />
            <button className="btn btn-danger" style={{ padding: "3px 10px" }} onClick={() => setCustomItems(customItems.filter((_, i) => i !== idx))}>✖</button>
          </div>
        ))}
        <button className="btn btn-primary" onClick={addCustomItem} style={{ marginTop: 3, padding: "4px 14px" }}>➕ Add Custom</button>
        {customItems.length > 0 && (
          <button className="btn" style={{ marginLeft: 10, padding: "4px 12px" }} onClick={addAllCustomToBill}>Add All to Bill</button>
        )}
      </div>

      {/* Bill Items Table */}
      {billItems.length > 0 && (
        <div className="lims-card" style={{ marginBottom: 18, padding: "18px 18px 12px 18px", border: "1px solid #1953a850", borderRadius: 8, background: "#fafdff" }}>
          <div style={{ fontWeight: 700, marginBottom: 7, fontSize: 16, color: "#1953a8" }}>Bill Items</div>
          <table className="lims-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Amount</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {billItems.map((item, idx) => (
                <tr key={item.id || item.key || idx}>
                  <td>
                    {item.type === "test" ? <b>{item.name}</b> : <span>{item.name}</span>}
                  </td>
                  <td>₹ {item.price}</td>
                  <td>
                    <button className="btn btn-danger" onClick={() => removeBillItem(idx)} style={{ fontSize: 13, padding: "2px 10px" }}>✖</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="lims-bill-summary" style={{ marginTop: 15 }}>
            <div>Subtotal: <b>₹ {subtotal}</b></div>
            <div>
              Discount (%): <input
                type="number"
                min={0} max={100}
                style={{ width: 50, borderRadius: 3, padding: "3px 5px", marginRight: 8 }}
                value={discount}
                onChange={e => setDiscount(e.target.value)}
              /> <span>₹ {discountAmt.toFixed(2)}</span>
            </div>
            <div>
              Tax (%): <input
                type="number"
                min={0} max={100}
                style={{ width: 50, borderRadius: 3, padding: "3px 5px", marginRight: 8 }}
                value={taxPercent}
                onChange={e => setTaxPercent(e.target.value)}
              /> <span>₹ {taxAmt.toFixed(2)}</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: 17, color: "#1953a8", marginTop: 6 }}>Total: <span>₹ {total}</span></div>
          </div>
        </div>
      )}

      {/* Bill Submit */}
      <div style={{ marginBottom: 25, textAlign: "center" }}>
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={loading || billItems.length === 0}
          style={{ fontSize: 16, padding: "8px 32px", opacity: (billItems.length === 0 ? 0.5 : 1) }}
        >
          {loading ? "Processing..." : "Generate Bill"}
        </button>
        {submitStatus && (
          <div style={{ color: submitStatus.includes("success") ? "green" : "red", marginTop: 12, fontWeight: 600 }}>{submitStatus}</div>
        )}
      </div>

      {/* Bill Receipt Modal */}
      <BillReceiptModal
        open={showModal}
        onClose={() => setShowModal(false)}
        bill={bill}
        patient={patient}
        subtotal={subtotal}
        discountAmt={discountAmt}
        taxAmt={taxAmt}
        total={total}
        formatDateTime={formatDateTime}
      />

      {/* Previous Bills Modal */}
      <PreviousBillsModal
        open={showPrevBillsModal}
        onClose={handleClosePrevBillsModal}
        bills={previousBills}
        patient={patient}
        onView={handleViewPrevBill}
        onDownload={handleDownloadBill}
        formatDateTime={formatDateTime}
        loading={prevBillLoading}
      />

      {/* Bill Receipt Modal for viewing previous bills */}
      <BillReceiptModal
        open={!!viewBill}
        onClose={() => setViewBill(null)}
        bill={viewBill}
        patient={viewBillPatient}
        subtotal={viewBill ? calcPrevBillSummary(viewBill).amount : 0}
        discountAmt={viewBill ? ((JSON.parse(viewBill.itemsJson || "[]").reduce((a, b) => a + (b.price || 0), 0) * (parseFloat(viewBill.discountPercent) || 0)) / 100) : 0}
        taxAmt={viewBill ? ((JSON.parse(viewBill.itemsJson || "[]").reduce((a, b) => a + (b.price || 0), 0) - ((JSON.parse(viewBill.itemsJson || "[]").reduce((a, b) => a + (b.price || 0), 0) * (parseFloat(viewBill.discountPercent) || 0)) / 100)) * (parseFloat(viewBill.taxPercent) || 0)) / 100 : 0}
        total={viewBill ? calcPrevBillSummary(viewBill).amount : 0}
        formatDateTime={formatDateTime}
      />

      {/* Invoicing and Payment Section (newly added) */}
      {bill && (
        <div style={{ marginTop: 24, padding: "16px", borderRadius: 8, border: "1px solid #1953a8", background: "#f7f9ff" }}>
          <h3 style={{ marginBottom: 12, fontSize: 18, color: "#1953a8" }}>Invoice & Payment</h3>
          <div style={{ marginBottom: 12 }}>
            <b>Invoice ID:</b> {bill.id}
          </div>
          <div style={{ marginBottom: 12 }}>
            <b>Amount:</b> ₹ {total}
          </div>
          <div style={{ marginBottom: 16 }}>
            <b>Status:</b> {bill.paid ? <span style={{ color: "green" }}>Paid</span> : <span style={{ color: "red" }}>Unpaid</span>}
          </div>
          {/* Razorpay Pay Now button */}
          {!bill.paid && (
            <button
              className="btn btn-success"
              style={{ fontSize: 17, padding: "10px 36px" }}
              onClick={handleRazorpayPayment}
            >
              Pay Now
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BillingModule;