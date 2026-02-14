import { useState, useEffect, useRef } from "react";

export default function CustomSelect({
  options,
  value,
  onChange,
  placeholder,
}) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const wrapperRef = useRef(null);

  useEffect(() => {
    setFilter(value || "");
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
        setFilter(value || "");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value]);

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(filter.toLowerCase()),
  );

  const handleInputChange = (e) => {
    const val = e.target.value;
    setFilter(val);
    onChange(val);
    setOpen(true);
  };

  const handleItemClick = (opt) => {
    onChange(opt);
    setFilter(opt);
    setOpen(false);
  };

  return (
    <div ref={wrapperRef} className="custom-select-container">
      <div className="custom-select-input-wrapper">
        <input
          className="custom-select-input"
          placeholder={placeholder}
          value={filter}
          onChange={handleInputChange}
          onClick={() => setOpen(true)}
        />
        <div
          className={`custom-arrow ${open ? "open" : ""}`}
          onClick={() => setOpen(!open)}
        />
      </div>

      {open && filteredOptions.length > 0 && (
        <ul className="custom-select-options">
          {filteredOptions.map((opt, idx) => (
            <li key={idx} onClick={() => handleItemClick(opt)}>
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
