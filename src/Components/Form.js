import React from "react";

const Form = ({
  name,
  className,
  type,
  text,
  value,
  onChange,
  onSubmit,
  maxLength,
  placeholder,
  isDisable
}
) => {
  return (
    <form onSubmit={onSubmit} className={className}>
      <label htmlFor={name}>{text}</label>
      <input
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        onChange={onChange}
        disabled={isDisable}
      />
    </form>
  );
};

Form.defaultProps = {
  isDisable: false,
  className: Form,
};

export default Form;
