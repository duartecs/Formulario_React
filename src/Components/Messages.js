import React from "react";

const Messages = (props) => {
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

export default Messages;
