import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Input, Modal } from 'antd';
import { Button, utils } from '@xinghunm/widgets';
import LoginBG from './LoginBG';
import Loading from '../Loading';

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
  height: 250px;
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
  padding: 25px 45px 45px 45px;
  box-sizing: content-box;
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

const Login = ({ onLoginSuccess }) => {
  const [errorMsg, setErrorMsg] = useState();
  const [isLoginError, setIsLoginError] = useState(false);
  const [isLogining, setIsLogining] = useState(false);
  const phoneElRef = useRef();
  const passwordElRef = useRef();
  const addrRef = useRef();
  const oldPhoneNum = localStorage.getItem('phone');
  const oldPassword = localStorage.getItem('password');
  const oldAddr = localStorage.getItem('addr');
  const submit = () => {
    setIsLoginError(false);
    setErrorMsg();
    const phoneNum = phoneElRef.current.input.value;
    const password = passwordElRef.current.input.value;
    const addr = addrRef.current.input.value;
    if (phoneNum === '') {
      setErrorMsg('请输入手机号');
      phoneElRef.current.input.focus();
    } else if (password === '') {
      setErrorMsg('请输入验证码');
      passwordElRef.current.input.focus();
    } else if (addr === '') {
      setErrorMsg('请输入地址');
      addrRef.current.input.focus();
    } else {
      localStorage.setItem('phone', phoneNum);
      localStorage.setItem('password', password);
      localStorage.setItem('addr', addr);
      setIsLogining(true);
      const isVip = phoneNum === '13141234125' || phoneNum === '13141230814';
      if (window.Electron) {
        if (isVip) {
          window.Electron.handleLogin(phoneNum, password, addr);
        } else {
          fetch(`http://139.180.215.117:8000/dzdp/authority/${phoneNum}`)
            .then(res => res.json())
            .then(hasAuthority => {
              if (hasAuthority) {
                window.Electron.handleLogin(phoneNum, password, addr);
              } else {
                setIsLogining(false);
                setIsLoginError(true);
                Modal.error({
                  title: '权限认证失败，请联系管理员',
                  content: 'Telephone: 13141234125'
                });
              }
            })
            .catch(e => {
              console.log('Login error', e);
              setIsLogining(false);
              setIsLoginError(true);
            });
        }
      }
    }
  };

  useEffect(() => {
    if (window.Electron) {
      window.Electron.onLogin((event, isLoginSuccess) => {
        setIsLogining(false);
        if (isLoginSuccess) {
          localStorage.setItem('loginTime', Date.now());
          onLoginSuccess();
        } else {
          setIsLoginError(true);
        }
      });
    }
  }, [onLoginSuccess]);

  const onKeyUp = useCallback(e => {
    if (e.code === 'Enter') {
      submit();
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keyup', onKeyUp);
    return () => {
      document.removeEventListener('keyup', onKeyUp);
    };
  }, [onKeyUp]);

  return (
    <Mask>
      <LoginBG />
      <Container>
        <Content>
          <Sizer size={20}>{errorMsg && <MissHint>{errorMsg}</MissHint>}</Sizer>
          <InputWrapper>
            <Input
              placeholder="手机号"
              ref={phoneElRef}
              defaultValue={oldPhoneNum}
            />
          </InputWrapper>
          <Sizer size={12} />
          <InputWrapper>
            <Input
              placeholder="验证码"
              ref={passwordElRef}
              defaultValue={oldPassword}
            />
          </InputWrapper>
          <Sizer size={12} />
          <InputWrapper>
            <Input placeholder="地址" ref={addrRef} defaultValue={oldAddr} />
          </InputWrapper>
          <Sizer size={25} />
          <BtnWrapper onClick={submit}>登录</BtnWrapper>
          <LoginErrorHint isLoginError={isLoginError}>
            手机号或验证码错误。
          </LoginErrorHint>
        </Content>
        <Sun />
        <Cloud />
      </Container>
      {isLogining && <Loading tip="模拟登录中..." />}
    </Mask>
  );
};

Login.propTypes = {
  onLoginSuccess: PropTypes.func.isRequired
};

export default Login;
