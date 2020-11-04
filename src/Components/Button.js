import styled from "styled-components";

export const Button = styled.button`
  display: inline;
  justify-content: center;
  margin: 10px;
  border: none;
  border-radius: 8px;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  font-size: 16px;
  background-color: ${(props) => (props.desactive ? "grey" : "darkblue")};
  cursor: ${(props) => (props.desactive ? "alias" : "pointer")};
`;

export const Gbutton = styled(Button)`
  background-color: ${(props) => (props.desactive ? "grey" : "green")};
`;

export const Rbutton = styled(Button)`
  background-color: ${(props) => (props.desactive ? "grey" : "darkred")};
`;
