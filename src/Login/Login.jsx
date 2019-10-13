import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Input } from 'antd';
import { Button, utils } from '@xinghunm/widgets';
import LoginBG from './LoginBG';

const Mask = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  overflow: hidden;
`;

const Container = styled.div`
  width: 360px;
  height: 196px;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
  border-radius: 10px;
  background: #ffffff;
  top: 320px;
  left: 50%;
  right: auto;
  bottom: auto;
  border: none;
  position: absolute;
  transform: translate(-50%, -50%);
  padding: 45px;
`;

const Sizer = styled.div`
  height: ${props => `${props.size}px`};
`;

const Content = styled.div`
  margin: auto;
`;

const Sun = styled.div`
  background: #ff9944;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  box-shadow: 0 0 50px rgba(255, 153, 68, 0.7);
  position: absolute;
  top: -40px;
  right: -34px;
`;
const Cloud = styled.div`
  background: #fff;
  width: 150px;
  height: 50px;
  border-radius: 50px;
  position: absolute;
  left: 6px;
  top: -24px;
  :before {
    width: 100px;
    height: 100px;
    content: '';
    position: absolute;
    bottom: 0;
    left: -15px;
    border-radius: 50px;
    box-shadow: 100px 0 0 #fff;
    background: #fff;
  }
`;

const InputWrapper = styled.div`
  input::-webkit-input-placeholder {
    color: #9c9c9c !important;
  }
  & .ant-input {
    box-sizing: border-box;
    color: #1f8efa !important;
    border-radius: 4px;
    width: 100%;
    padding: 15px;
    background: #f2f2f2;
    outline: none;
    border: none;
  }
`;

const BtnWrapper = styled(Button)`
  border-radius: 4px;
  width: 100%;
  height: 50px;
  font-size: 14px;
  background: #54aeea;
  color: #ffff;
  margin: 0;
  &:hover {
    background-color: ${utils.fade('rgb(84, 174, 234)', 0.8)};
  }
`;

const MissHint = styled.span`
  font-size: 14px;
  color: #f5222d;
`;

const LoginErrorHint = styled.div`
  color: red;
  position: relative;
  visibility: ${props => (props.isLoginError ? 'visible' : 'hidden')};
`;

const Login = ({ handleCancel }) => {
  const [isMissEmail, setIsMissEmail] = useState(false);
  const [isMissPassword, setIsMissPassword] = useState(false);
  const [isLoginError, setIsLoginError] = useState(false);
  const emailElRef = useRef();
  const passwordElRef = useRef();
  const submit = () => {
    setIsLoginError(false);
    if (emailElRef.current.input.value === '') {
      setIsMissEmail(true);
    } else {
      setIsMissEmail(false);
      if (passwordElRef.current.input.value === '') {
        setIsMissPassword(true);
      } else {
        setIsMissPassword(false);
        setIsLoginError(true);
      }
    }
  };
  const closeErrorHint = () => {
    setIsLoginError(false);
  };
  return (
    <Mask>
      <LoginBG />
      <Container>
        <Content>
          <InputWrapper>
            <Input placeholder="邮箱" ref={emailElRef} />
          </InputWrapper>
          <Sizer size={20}>
            {isMissEmail && <MissHint>请输入邮箱</MissHint>}
          </Sizer>
          <InputWrapper>
            <Input placeholder="密码" ref={passwordElRef} />
          </InputWrapper>
          <Sizer size={30}>
            {isMissPassword && <MissHint>请输入密码</MissHint>}
          </Sizer>
          <BtnWrapper>登录</BtnWrapper>
          <LoginErrorHint isLoginError={isLoginError}>
            账号或密码错误。
          </LoginErrorHint>
        </Content>
        <Sun />
        <Cloud />
      </Container>
    </Mask>
  );
};

Login.propTypes = {
  handleCancel: PropTypes.func.isRequired
};

export default Login;
