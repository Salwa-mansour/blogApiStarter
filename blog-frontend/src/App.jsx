import { useState } from 'react'
import './css/App.css'
import posts from './components/posts';
import { Route, Routes } from 'react-router';
import Posts from '../../controlePanel/src/components/post/list';


function App() {
 
  return (
   <Routes>
    <Route index element={<Posts/>}  />
   </Routes>
  )
}

export default App
