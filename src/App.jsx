import { useState } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import {store,persistor} from "./redux/store";
import "./App.css";
import { auth, provider, signInWithPopup, signOut } from "./firebaseConfig";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import Home from "./pages/Home";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {

  const [user, setUser] = useState(null);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider.setCustomParameters({ prompt: "select_account" }));
      setUser(result.user);
      console.log(result.user)
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <Provider store={store}>
        <ToastContainer position="top-right" autoClose={3000} />
      <PersistGate loading={null} persistor={persistor}>
    <Router>
    <Routes>
    <Route path="/" element={<Signup></Signup>}></Route>
    <Route path="/home" element={<Home></Home>}></Route>
    </Routes>
    </Router>
    </PersistGate>
    </Provider>
  );
}

export default App;
