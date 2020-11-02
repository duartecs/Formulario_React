import React from "react";
import { Container, Modal, Text, Message, Button, Input } from "./StylePopup";

const Popup = ({ closePopup, title, message, onChange = false, submmit }) => {
  const close = (e) => {
    e.target.id === "Modal" && closePopup(false);
  };

  return (
    <Modal id="Modal" onClick={close}>
      <Container>
        <Text>{title}</Text>
        <Message>{message}</Message>
        {onChange && <Input name="email" type="email" placeholder="Digite seu e-mail" onChange={onChange} />}
        {onChange ? (
          <Button
            onClick={() => {
              submmit();
            }}
          >
            Enviar email
          </Button>
        ) : (
          <Button
            onClick={() => {
              closePopup(false);
            }}
          >
            OK
          </Button>
        )}
      </Container>
    </Modal>
  );
};

export default Popup;
