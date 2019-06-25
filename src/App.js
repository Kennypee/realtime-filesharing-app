import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import {CometChat} from '@cometchat-pro/chat';
import config from './config'
import './App.css';
import Login from './components/Login';
import Chat from './components/Chat';

const App =()=> {
  const [user, setUser] = useState(null);
  useEffect(()=>{

      CometChat.init(config.appID).then(
       () => {
        console.log("Initialization completed successfully");
        //You can now call login function.
       },
       error => {
        console.log("Initialization failed with error:", error);
        //Check the reason for error and take apppropriate action.
       }
      );
    
  })
  const renderApp = () => { 
    if (user) {
      return <Chat user={user} />;
    } else {
    return <Login setUser={setUser} />;
    }
  } 
  return (
    <div className='container'>
    {renderApp()}
    </div>
  );
}

export default App;
