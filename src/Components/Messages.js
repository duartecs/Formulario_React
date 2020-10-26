import React from "react";

export default (props) => {
  if (props.type === "temp" && props.display.display === "flex") {
    const delayMessage = setInterval(() => {
      props.boxMessage("reset", "black");
      clearInterval(delayMessage);
    }, [2000]);
  }

  return (
    <>
      <p className={props.className} style={props.display}>
        {props.message}
      </p>
    </>
  );
};
