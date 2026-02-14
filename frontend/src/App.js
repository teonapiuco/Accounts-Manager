import { useState, useEffect, useRef } from "react";
import {
  getAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
} from "./api";
import "./index.css";
import CustomSelect from "./CustomSelect";

function AnimatedNumber({ value, duration = 1000 }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = value / (duration / 30);
    const interval = setInterval(() => {
      start += increment;
      if (start >= value) {
        start = value;
        clearInterval(interval);
      }
      setDisplay(Math.floor(start));
    }, 30);

    return () => clearInterval(interval);
  }, [value, duration]);

  return <h2>{display}</h2>;
}

function App() {
  const [accounts, setAccounts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isModalExiting, setIsModalExiting] = useState(false);
  const [detailView, setDetailView] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [message, setMessage] = useState(null);
  const [typedText, setTypedText] = useState("");
  const [platforms, setPlatforms] = useState([
    "Google",
    "LinkedIn",
    "Instagram",
    "GitHub",
    "Facebook",
  ]);
  const [form, setForm] = useState({
    platform: "",
    name: "",
    email: "",
    status: "Active",
  });
  const [deleteConfirm, setDeleteConfirm] = useState({
    open: false,
    accountId: null,
  });

  const messageTimeoutRef = useRef(null);
  const fullText = "WELCOME ADMIN \nHere’s an overview of your accounts";
  const typingSpeed = 50;

  const closeModalWithAnim = () => {
    setIsModalExiting(true);
    setTimeout(() => {
      setModalOpen(false);
      setIsModalExiting(false);
      setEditingAccount(null);
    }, 200);
  };

  const handleBack = () => {
    setIsExiting(true);
    setTimeout(() => {
      setDetailView(false);
      setIsExiting(false);
    }, 500);
  };

  function showMessage(msg) {
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
    }
    setMessage(msg);
    messageTimeoutRef.current = setTimeout(() => {
      setMessage(null);
      messageTimeoutRef.current = null;
    }, 3000);
  }

  useEffect(() => {
    setTypedText("");
    let index = 0;
    function type() {
      if (index < fullText.length) {
        setTypedText(fullText.slice(0, index + 1));
        index++;
        setTimeout(type, typingSpeed);
      }
    }
    type();
  }, []);

  useEffect(() => {
    loadAccounts();
  }, []);

  async function loadAccounts() {
    setAccounts(await getAccounts());
  }

  function openModalForAdd() {
    setForm({ platform: "", name: "", email: "", status: "Active" });
    setEditingAccount(null);
    setModalOpen(true);
  }

  function openModalForEdit(account) {
    setForm({
      platform: account.platform,
      name: account.name,
      email: account.email,
      status: account.status,
    });
    setEditingAccount(account);
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.platform.trim() || !form.name.trim() || !form.email.trim()) {
      showMessage({ type: "error", text: "All fields are required" });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      showMessage({ type: "error", text: "Invalid email address" });
      return;
    }

    if (!editingAccount) {
      const duplicate = accounts.find(
        (acc) =>
          acc.platform.toLowerCase() === form.platform.toLowerCase() &&
          acc.name.toLowerCase() === form.name.toLowerCase() &&
          acc.email.toLowerCase() === form.email.toLowerCase(),
      );

      if (duplicate) {
        showMessage({ type: "error", text: "This account already exists!" });
        return;
      }
    }

    if (!platforms.includes(form.platform)) {
      setPlatforms((prev) => [...prev, form.platform]);
    }

    try {
      if (editingAccount) {
        await updateAccount(editingAccount.id, form);
        showMessage({ type: "success", text: "Account updated successfully!" });
      } else {
        await createAccount(form);
        showMessage({ type: "success", text: "Account added successfully!" });
      }
      closeModalWithAnim();
      loadAccounts();
    } catch (err) {
      console.error(err);
      showMessage({ type: "error", text: "Something went wrong!" });
    }
  }

  const total = accounts.length;
  const activeCount = accounts.filter((a) => a.status === "Active").length;
  const inactiveCount = accounts.filter((a) => a.status === "Inactive").length;

  return (
    <div className="container">
      {message && <div className={`toast ${message.type}`}>{message.text}</div>}

      {!detailView && (
        <div>
          <div className="header-container">
            <h1 id="typing-text">{typedText}</h1>
          </div>
          <div className="cards">
            <button className="view-card" onClick={() => setDetailView(true)}>
              <svg
                className="btn-arrow"
                width="16"
                height="8"
                viewBox="0 0 16 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 4H14M10 0L14 4L10 8"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </svg>
              <span className="btn-text">View Accounts</span>
            </button>

            <div className="card-summary">
              <div>Total Accounts</div>
              <AnimatedNumber value={total} duration={1000} />
            </div>
            <div className="card-summary">
              <div>Active</div>
              <AnimatedNumber value={activeCount} duration={1000} />
            </div>
            <div className="card-summary">
              <div>Inactive</div>
              <AnimatedNumber value={inactiveCount} duration={1000} />
            </div>
          </div>
        </div>
      )}

      {detailView && (
        <>
          {!modalOpen && (
            <div className={`detail-overlay ${isExiting ? "exit" : ""}`}>
              <div className={`detail-panel ${isExiting ? "exit" : ""}`}>
                <div className="detail-header">
                  <button className="back-btn" onClick={handleBack}>
                    <svg
                      className="btn-arrow"
                      width="16"
                      height="8"
                      viewBox="0 0 16 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0 4H14M10 0L14 4L10 8"
                        stroke="currentColor"
                        strokeWidth="1"
                      />
                    </svg>
                  </button>
                  <button className="primary btn-add" onClick={openModalForAdd}>
                    + Add Account
                  </button>
                </div>

                <div
                  className={`account-table-container ${accounts.length > 5 ? "is-scrolling" : ""}`}
                >
                  <table className="account-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Platform</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {accounts.map((acc) => (
                        <tr key={acc.id}>
                          <td>#{acc.id}</td>
                          <td>{acc.platform}</td>
                          <td>{acc.name}</td>
                          <td>{acc.email}</td>
                          <td>
                            <span
                              className={`status ${acc.status.toLowerCase()}`}
                            >
                              {acc.status}
                            </span>
                          </td>
                          <td>
                            <div className="dropdown">
                              <button className="dropdown-btn">⋮</button>
                              <div className="dropdown-content">
                                <button onClick={() => openModalForEdit(acc)}>
                                  Edit
                                </button>
                                <button
                                  className="danger"
                                  onClick={() =>
                                    setDeleteConfirm({
                                      open: true,
                                      accountId: acc.id,
                                    })
                                  }
                                >
                                  Delete
                                </button>
                                <button
                                  onClick={() => {
                                    const newStatus =
                                      acc.status === "Active"
                                        ? "Inactive"
                                        : "Active";
                                    updateAccount(acc.id, {
                                      status: newStatus,
                                    }).then(loadAccounts);
                                  }}
                                >
                                  {acc.status === "Active"
                                    ? "Deactivate"
                                    : "Activate"}
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {modalOpen && (
            <div className={`modal-overlay ${isModalExiting ? "exit" : ""}`}>
              <div className={`modal ${isModalExiting ? "exit" : ""}`}>
                <button className="close" onClick={closeModalWithAnim}>
                  ×
                </button>
                <h2>{editingAccount ? "EDIT ACCOUNT" : "ADD NEW ACCOUNT"}</h2>
                <form onSubmit={handleSubmit} noValidate>
                  <CustomSelect
                    options={platforms}
                    value={form.platform}
                    onChange={(val) => setForm({ ...form, platform: val })}
                    placeholder="Select or add a new platform"
                  />
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Enter account name"
                  />
                  <input
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="Enter email address"
                  />
                  <button className="primary" type="submit">
                    {editingAccount ? "Save Changes" : "Add Account"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </>
      )}

      {deleteConfirm.open && (
        <div className="delete">
          <div className="modal">
            <h2>DELETE ACCOUNT</h2>
            <p>Are you sure you want to delete this account?</p>
            <div className="modal-actions">
              <button
                className="danger"
                onClick={async () => {
                  try {
                    await deleteAccount(deleteConfirm.accountId);
                    showMessage({
                      type: "success",
                      text: "Account deleted successfully!",
                    });
                    setDeleteConfirm({ open: false, accountId: null });
                    loadAccounts();
                  } catch (err) {
                    console.error(err);
                    showMessage({
                      type: "error",
                      text: "Failed to delete account!",
                    });
                  }
                }}
              >
                Yes, delete
              </button>
              <button
                onClick={() =>
                  setDeleteConfirm({ open: false, accountId: null })
                }
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
