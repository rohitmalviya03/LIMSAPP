import React, { useRef } from "react";
import Barcode from "react-barcode";
import "../../styles/SampleCollectionSlip.css";

export default function SampleCollectionSlip({ sample, onClose }) {
  const barcodeRef = useRef();

  const handlePrintBarcode = () => {
    const printContents = barcodeRef.current.innerHTML;
    const win = window.open('', '', 'width=400,height=250');
    win.document.write(`
      <html>
        <head>
          <title>Print Barcode</title>
          <style>
            body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
            .barcode-label-print {
              text-align: center;
              padding: 10px 0 0 0;
              font-size: 1.1rem;
              font-weight: bold;
            }
            .barcode-patient-print, .barcode-test-print, .barcode-collected-print {
              text-align: center;
              font-size: 0.95rem;
              margin: 2px 0;
            }
            .barcode-barcode-print {
              display: flex;
              justify-content: center;
              align-items: center;
              margin: 0;
              padding: 0;
            }
          </style>
        </head>
        <body>
          <div>${printContents}</div>
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => {
      win.print();
      win.close();
    }, 300);
  };

  return (
    <div className="lims-modal-overlay">
      <div className="lims-modal-content slip-modal" id="print-slip">
        <h2 className="slip-title">Sample Collection Slip</h2>
        <div className="slip-row"><b>Patient:</b> {sample.patient.firstName} ({sample.patient.mrn})</div>
        <div className="slip-row"><b>Sample ID:</b> {sample.sampleNumber}</div>
        <div className="slip-row"><b>Tests:</b> {sample.testName}</div>
        <div className="slip-row"><b>Collected At:</b> {new Date(sample.collectedAt).toLocaleString()}</div>
        {sample.collector && <div className="slip-row"><b>Collector:</b> {sample.collector}</div>}
        <div className="slip-barcode-container" ref={barcodeRef}>
          <div className="barcode-barcode-print">
            <Barcode
              value={sample.sampleNumber}
              format="CODE128"
              width={2}
              height={50}
              fontSize={12}
              displayValue={true}
              background="#fff"
              lineColor="#222"
              margin={0}
            />
          </div>
          <div className="barcode-patient-print">Patient : {sample.patient.firstName}</div>
          <div className="barcode-test-print">Test : {sample.testName}</div>
          <div className="barcode-collected-print">Collection Time: {new Date(sample.collectedAt).toLocaleDateString()}</div>
        </div>
        <div className="slip-actions">
          <button className="slip-btn slip-btn-close" onClick={onClose}>Close</button>
          <button
            className="slip-btn slip-btn-print"
            onClick={handlePrintBarcode}
          >
            Print Barcode Label
          </button>
        </div>
      </div>
    </div>
  );
}