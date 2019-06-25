import React, {Component} from 'react';
// import {NotificationManager} from 'react-notifications';
import {CometChat} from '@cometchat-pro/chat';
import config from '../config';
    
class Login extends Component{

constructor(props){
    super(props)
    this.state = {
        uidValue: "",
        isSubmitting: false
    }

    this.handleSubmit = this.handleSubmit.bind(this)
}

//   const [uidValue, setUidValue] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);

  handleSubmit(e){
    e.preventDefault()
    this.setState({isSubmitting:true});
    CometChat.login(this.state.uidValue, config.apiKey).then(
      User => {
        // NotificationManager.success('You are now logged in', 'Login Success');
        console.log('Login Successful:', {User});
        this.props.setUser(User)
      },
      error => {
        // NotificationManager.error('Please try again', 'Login Failed');
        console.log('Login failed with exception:', {error});
        this.setState({isSubmitting:false});
      }
    );
  };

  render(){
  return (
    <div className='row'>
      <div className='col-md-6 login-form mx-auto'>
        <h3>Login to Chat</h3>
        <form className='mt-5' onSubmit={this.handleSubmit}>
          <div className='form-group'>
            <input
              type='text'
              name='username'
              className='form-control'
              placeholder='Your Username'
              value={this.state.uidValue}
              onChange={event => this.setState({uidValue: event.target.value})}
            />
          </div>
          <div className='form-group'>
            <input
              type='submit'
              className='btn btn-primary btn-block'
              value={`${this.state.isSubmitting ? 'Loading...' : 'Login'}`}
              disabled={this.state.isSubmitting}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
}
export default Login;