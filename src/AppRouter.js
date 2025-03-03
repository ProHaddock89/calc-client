import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './components/Landing/Landing';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import { useEffect } from 'react';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';


const AppRouter = () => {
    useEffect(() => {
        document.title = 'Asset Calculator';
      }, []);
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Login/>} />
                <Route path='/register' element={<Register/>} />
                <Route path='/home' element={<PrivateRoute><Landing/></PrivateRoute>} />
                <Route path='/success' element={<>yes</>}/>
                <Route path='/cancel' element={<>no</>}/>
                
            </Routes>
        </Router>
    )
}

export default AppRouter
