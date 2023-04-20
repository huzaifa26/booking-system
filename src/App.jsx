import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./Layout/Navbar"
import Login from "./pages/Login"
import About from "./pages/About"
import Profile from "./pages/Profile"
import Signup from "./pages/Signup"
import Booking from "./pages/Booking"
import Protected from "./Utils/Protected"
import VerifyEmail from "./pages/VerifyEmail"
import VerifiedProtected from "./Utils/VerifiedProtected"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navbar></Navbar>}>
          <Route index element={<Login></Login>}></Route>
          <Route path="about-us" element={<About></About>}></Route>
            <Route path="signup" element={<Signup></Signup>}></Route>
          <Route path="/" element={<Protected></Protected>}>
            <Route path="verify-email" element={<VerifyEmail></VerifyEmail>}></Route>
            <Route path="/" element={<VerifiedProtected></VerifiedProtected>}>
              <Route path="profile" element={<Profile></Profile>}></Route>
              <Route path="booking" element={<Booking></Booking>}></Route>
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App