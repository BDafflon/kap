import React from 'react';
import { BrowserRouter, Route, Routes, Redirect  } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import Login from './pages/login';
import Preferences from './pages/Preferences';
import useToken from './utils/useToken';
import Registration from './pages/registration';
import LiveUser from './pages/component/content/module/live/liveuser';
 

function App() {
  const { token, setToken } = useToken();
  

  if(!token){
    //console.log('?')
    return (<div className='wrapper'>
    
    <BrowserRouter>
     <Routes>
        <Route path='/live/:publickey' element={<LiveUser />} />
       <Route path='/login' element={<Login setToken={setToken}/>} />
       <Route path='/registration' element={<Registration/>} />
       <Route path="*" element={<Login setToken={setToken}/>} />
     </Routes>
    </BrowserRouter>

  </div>)
  }
  return (
     <div className='wrapper'>
       
       <BrowserRouter>
        <Routes>
          <Route path='/dashboard' element={<Dashboard token={token}/>} />

          <Route path='/account ' element={<Preferences/>} />

          <Route path="*" element={<Dashboard token={token}/>} />

        </Routes>
       </BrowserRouter>

     </div>
  );
}

export default App;
