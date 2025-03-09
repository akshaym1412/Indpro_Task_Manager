import { auth,provider,signInWithPopup,signOut } from "../firebaseConfig";
import { setUserlogin,logoutUser } from "../redux/authSlice";


// Function to handle login
export const handleLogin = async (dispatch,navigate) => {
  try {
    const result = await signInWithPopup(
      auth,
      provider.setCustomParameters({ prompt: "select_account" })
    );
    dispatch(setUserlogin(result.user)); // Store in Redux
    navigate("/home");

    console.log("User Logged In:", result.user);
  } catch (error) {
    console.error("Login Error:", error);
  }
};

// Function to handle logout
export const handleLogout = async (dispatch,navigate) => {
  try {
    await signOut(auth);
    dispatch(logoutUser());
    navigate("/");
    console.log("User Logged Out");
  } catch (error) {
    console.error("Logout Error:", error);
  }
};
