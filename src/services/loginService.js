import { auth, provider, signInWithPopup, signOut } from "../firebaseConfig";
import { setUserLogin, logoutUser } from "../redux/authSlice";

export const handleLogin = async ({ dispatch, navigate }) => {
  try {
    const result = await signInWithPopup(
      auth,
      provider.setCustomParameters({ prompt: "select_account" })
    );

    if (!result.user?.uid) {
      throw new Error("User data is missing UID");
    }

    const userData = {
      uid: result.user.uid,
      email: result.user.email || "",
      displayName: result.user.displayName || "",
      photoURL: result.user.photoURL || "",
    };

    dispatch(setUserLogin(userData));
    navigate("/home");

    console.log("User Logged In:", userData);
  } catch (error) {
    console.error("Login Error:", error);
  }
};

export const handleLogout = async (dispatch, navigate) => {
  try {
    await signOut(auth);
    dispatch(logoutUser());
    navigate("/");
    console.log("User Logged Out");
  } catch (error) {
    console.error("Logout Error:", error);
  }
};
