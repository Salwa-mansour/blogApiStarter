import './styles/App.css'
import {useAuth} from "./hooks/useAuth";

import Register from './components/Register';
import Login from './components/login';
import Home from './components/Home';
import Layout from './components/Layout';
import Editor from './components/Editor';
import Admin from './components/Admin';
import Missing from './components/Missing';
import Unauthorized from './components/Unauthorized';
import Lounge from './components/Lounge';
import LinkPage from './components/LinkPage';
import RequireAuth from './components/RequireAuth';
import PresistLogin from './components/PersistLogin';
import { Routes, Route } from 'react-router';

function App() {
 
  return (
    <Routes>
      <Route path="/" element={<Layout />} >

        
        <Route path="login" element={<Login />} />
        <Route path="linkpage" element={<LinkPage />} />
        <Route path="register" element={<Register />} />
        <Route path="unauthorized" element={<Unauthorized />} />


        {/* <Route element={<PresistLogin />} > */}
              <Route element={<RequireAuth allowedRoles={["ADMIN", "EDITOR", "USER"]} />}  >
                    <Route index element={<Home />} />
                </Route>
                <Route element={<RequireAuth allowedRoles={["EDITOR"]} />}  >
                  <Route path="editor" element={<Editor />} />
                </Route>
                <Route element={<RequireAuth allowedRoles={["ADMIN"]} />}  >
                    <Route path="admin" element={<Admin />} />
                </Route>
                <Route element={<RequireAuth allowedRoles={["ADMIN", "EDITOR"]} />}  >
                    <Route path="lounge" element={<Lounge />} />
              </Route>
        {/* </Route>   */}
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  )
}

export default App
