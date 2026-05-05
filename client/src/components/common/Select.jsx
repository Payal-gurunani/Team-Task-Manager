const Select = ({ value, onChange, options, placeholder, className = '', disabled = false }) => (
  <select value={value} onChange={e => onChange(e.target.value)} disabled={disabled}
    className={`input appearance-none cursor-pointer ${className}`}>
    {placeholder && <option value="">{placeholder}</option>}
    {options.map(opt => (
      <option key={opt.value} value={opt.value}>{opt.label}</option>
    ))}
  </select>
);

export default Select;
