import './styles/App.css'
import Register from './componunts/Register';
import Login from './componunts/login';
import Layout from './componunts/Layout';
import Home from './componunts/Home';
// import Layout from './components/Layout';
// import Editor from './components/Editor';
// import Admin from './components/Admin';
// import Missing from './components/Missing';
// import Unauthorized from './components/Unauthorized';
// import Lounge from './components/Lounge';
// import LinkPage from './components/LinkPage';
// import { Routes, Route } from 'react-router-dom';

function App() {
 
  return (
    <Routes>
      <Route path="/" element={<Layout />} >

        
        <Route path="login" element={<Login />} />
        <Route path="linkpage" element={<LinkPage />} />
        <Route path="register" element={<Register />} />
        <Route path="unauthorized" element={<Unauthorized />} />
      
        <Route index element={<Home />} />
        <Route path="editor" element={<Editor />} />
        <Route path="admin" element={<Admin />} />
        <Route path="lounge" element={<Lounge />} />

        <Route path="*" element={<Missing />} />
        
      </Route>
    </Routes>
  )
}

export default App
