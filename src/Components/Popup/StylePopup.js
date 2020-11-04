import styled from "styled-components";

export const Modal = styled.div`
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  aling-items: center;
`;
export const Container = styled.div`
  background: white;
  margin-top: 30px;
  width: 50%;
  height: 30%;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  aling-items: center;
`;
export const Text = styled.h1`
  display: flex;
  font-size: 18px;
  justify-content: center;
  aling-items: center;
`;
export const Message = styled.p`
  font-size: 14px;
  display: flex;
  justify-content: center;
  aling-items: center;
  margin-bottom: 20px;
`;
export const Button = styled.button`
  margin: 25px 0 0 33%;
  padding: 10px;
  color: white;
  background: darkblue;
  width: 33%;
  border-radius: 15px;
  border: none;
  float: center;
`;
export const Input = styled.input`
  margin: 0 15px 0 15px;
  border: none;
  border-bottom: solid 1.5px darkblue;
`;
