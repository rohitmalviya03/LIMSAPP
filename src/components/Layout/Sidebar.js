import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useLab } from "../../context/LabContext";
import { FaVial, FaUsers, FaFileInvoice, FaClipboardList, FaFlask, FaFileAlt } from "react-icons/fa";
import "../../styles/sidebar.css";

// Example lab list, replace with API call if needed
const LABS = [
  { code: "LAB1", name: "Central Lab" },
  { code: "LAB2", name: "Pathology" },
  { code: "LAB3", name: "Microbiology" },
];

const Sidebar = () => {
  const { labcode, setLabcode } = useLab();
  const [labs, setLabs] = useState(LABS);

  // Set default lab on first load if not set
  useEffect(() => {
    if (!labcode && labs.length > 0) {
      setLabcode(labs[0].code);
    }
  }, [labcode, labs, setLabcode]);

  const handleLabChange = (e) => {
    setLabcode(e.target.value);
  };

  return (
    <aside className="custom-sidebar">
      <div className="sidebar-brand">
        {/* <span className="lims-sidebar-title">LabNexa</span> */}
      </div>
      <div className="lab-context-section">
        <label htmlFor="lab-select" className="lab-select-label">Lab:</label>
        <select id="lab-select" value={labcode || ""} onChange={handleLabChange} className="lab-select-dropdown">
          {labs.map((lab) => (
            <option key={lab.code} value={lab.code}>{lab.name}</option>
          ))}
        </select>
      </div>
      <nav className="sidebar-nav">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}
          end
        >
          Dashboard
        </NavLink>
        <div className="sidebar-section">Samples</div>


        <NavLink
          to="/sample-collection"
          className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}
          end
        >
          Samples Collection
        </NavLink>
        <NavLink
          to="/samples"
          className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}
          end
        >
          View  Samples 
        </NavLink>
        <NavLink
          to="/samples/collected"
          className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}
          end
        >
          Collected Samples
        </NavLink>
        
        <div className="sidebar-section">Patients</div>
        <NavLink
          to="/patients/add"
          className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}
          end
        >
          Register Patient
        </NavLink>
        <NavLink
          to="/patients"
          className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}
          end
        >
          View All Patients
        </NavLink>
        <div className="sidebar-section">Admin</div>
        <NavLink
          to="/admin"
          className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}
          end
        >
          Admin Panel
        </NavLink>
        <div className="sidebar-section">Tests</div>
        <NavLink
          to="/tests"
          className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}
          end
        >
          Test Raised
        </NavLink>
        {/* Billing Section */}
        <div className="sidebar-section">Billing</div>
        <NavLink
          to="/billing"
          className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}
          end
        >
          Billing
        </NavLink>
        <div className="sidebar-section">Results</div>
        <NavLink
          to="/results/entry"
          className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}
          end
        >
          Result Entry
        </NavLink>
        <NavLink
          to="/results/pending-validation"
          className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}
          end
        >
          Result Validation
        </NavLink>
        <NavLink
          to="/results/report"
          className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}
          end
        >
          Reports
        </NavLink>
        
      </nav>
    </aside>
  );
};

export default Sidebar;