import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './components/Landing/Landing';
import { useEffect } from 'react';


const AppRouter = () => {
    useEffect(() => {
        document.title = 'Asset Calculator';
      }, []);
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Landing/>} />
            </Routes>
        </Router>
    )
}

export default AppRouter
