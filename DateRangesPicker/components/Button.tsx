import * as React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  background-color: black;
  color: white;
  font-size: 20px;
  padding: 10px 60px;
  border-radius: 5px;
  cursor: pointer;

  &:disabled {
    color: grey;
    opacity: 0.7;
    cursor: default;
  }
`;

const Icon = styled.span``;

export interface IButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  iconClassName?: string;
  buttonClassName?: string; // Add an optional buttonClassName property
}

const Button: React.FC<IButtonProps> = ({
  children,
  icon,
  iconClassName,
  buttonClassName,
  ...props
}) => {
  return (
    <StyledButton className={buttonClassName} {...props}>
      {icon && <Icon className={iconClassName}>{icon}</Icon>}
      {children}
    </StyledButton>
  );
};

export default Button;
