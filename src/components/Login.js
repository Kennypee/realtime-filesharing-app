import React, {useState} from 'react';
import {CometChat} from '@cometchat-pro/chat';
import config from '../config';
    
const Login = props => {

  const [userID, setUserID] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const loginUser = event => {
    event.preventDefault();
    setIsLoggingIn(true);
    CometChat.login(userID, config.apiKey).then(
      User => {
        console.log('Login Successful:', {User});
        props.setUser(User);
      },
      error => {
        console.log('Login failed with exception:', {error});
        setIsLoggingIn(false);
      }
    );
  };
    
  return (
    <div className='row'>
      <div className='col-md-6 login-form mx-auto'>
        <h3>Login to Chat</h3>
        <form className='mt-5' onSubmit={loginUser}>
          <div className='form-group'>
            <input
              type='text'
              name='username'
              className='form-control'
              placeholder='Your Username'
              value={userID}
              onChange={event => setUserID(event.target.value)}
            />
          </div>
          <div className='form-group'>
            <input
              type='submit'
              className='btn btn-primary btn-block'
              value={`${isLoggingIn ? 'Loading...' : 'Login'}`}
              disabled={isLoggingIn}
            />
          </div>
        </form>
      </div>
    </div>
  );
};
    
export default Login;