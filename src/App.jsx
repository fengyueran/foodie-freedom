import React, { useState } from 'react';
import Login from './Login';
import Enroll from './Enroll';

const App = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const onLoginSuccess = () => {
    setIsSuccess(true);
  };
  return (
    <div>
      {isSuccess ? <Enroll /> : <Login onLoginSuccess={onLoginSuccess} />}
    </div>
  );
};

export default App;
