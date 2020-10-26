import React from "react";

const Form = (props) => {
  return (
    <form onSubmit={props.onSubmit} className="Form">
      <label htmlFor={props.name}>{props.text}</label>
      <input
        name={props.name}
        type={props.type}
        value={props.value}
        placeholder={props.placeholder}
        maxLength={props.maxLength}
        onChange={props.onChange}
        disabled={props.isDisable}
      />
    </form>
  );
};

Form.defaultProps = {
  isDisable: false,
};

export default Form;
