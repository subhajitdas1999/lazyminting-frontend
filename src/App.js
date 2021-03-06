import { createContext, useEffect, useState } from "react";
import Header from "./Header";
import Home from "./Home";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import AxiosInstance from "./axoisInstancs.js";
import NFTDetails from "./NFTDetails";
import MyAccount from "./MyAccount";
import MyNFTs from "./MyNFTs";
import catchAsync from "./utils/catchAsync";
import { toast } from "react-toastify";


const userContext = createContext();
const authContext = createContext();
// const modalContext = createContext();

function App() {
  const [user, setUser] = useState({});
  const [userAuthData, setUserAuthData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  
  

  //send all axios the request {withCredentials: true} if it related to jwt token credential
  useEffect(() => {
    AxiosInstance.post("api/users/isLoggedIn", {}, { withCredentials: true })
      .then((response) => setUser(response.data.data.user))
      .catch((err) => {});
  }, []);

  const handleAuthDataChange = async (e) => {
    setUserAuthData((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    
      const response = await AxiosInstance.post(
        "api/users/signup",
        {
          name: userAuthData.name,
          email: userAuthData.email,
          password: userAuthData.password,
          passwordConfirm: userAuthData.passwordConfirm,
        },
        { withCredentials: true }
      );

      setUser(response.data.data.user);
      //clear the data
      setUserAuthData({
        name: "",
        email: "",
        password: "",
        passwordConfirm: "",
      });
   
  };

  const handleLogInSubmit = async (e) => {
    e.preventDefault();
    const response = await AxiosInstance.post(
      "api/users/login",
      {
        email: userAuthData.email,
        password: userAuthData.password,
      },
      { withCredentials: true }
    );

    setUser(response.data.data.user);
    //clear the filed
    setUserAuthData({
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
    });


  };

  const handleLogOut = async () => {
    const response = await AxiosInstance.post(
      "api/users/logout",
      {},
      { withCredentials: true }
    );
    setUser({});

  };
  return (
    <Router>
      <div className="App">
        <userContext.Provider value={{ userDetails: [user, setUser] }}>
          <authContext.Provider
            value={{
              authHandlers: [
                handleAuthDataChange,
                handleSignupSubmit,
                handleLogInSubmit,
                handleLogOut,
              ],
            }}
          >
            
              <Header />
        
              <Routes>
                <Route path="/" exact element={<Home />} />
                <Route path="/nft/:tokenId" exact element={<NFTDetails />} />
                <Route path="/redirect" element={<Navigate to={"/"} />} />
                <Route path="/myAccount" exact element={<MyAccount />} />
                <Route path="/myNFTS" exact element={<MyNFTs />} />
              </Routes>
           
          </authContext.Provider>
        </userContext.Provider>
      </div>
    </Router>
  );
}

export { App, userContext, authContext };
