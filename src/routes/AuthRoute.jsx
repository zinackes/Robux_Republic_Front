import { Navigate, Outlet } from 'react-router-dom'
import {useUser} from "@/context/UserContext.jsx";

const AuthRoute = () => {
    const { user ,isPending } = useUser();

    if (isPending) {
        return null
    }
    return (
    user ? <Outlet/> : <Navigate to='/login'/>
    )
}

export default AuthRoute