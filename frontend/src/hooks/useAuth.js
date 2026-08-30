import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserStore } from "../../store/userStore";

export const useAuth = () => {
    const signUp = async (username, firstName, lastName, email, password) => {
        try {
            // console.log("Here is in Hook", username, firstName, lastName, email, password);
            const response = await fetch("http://192.168.43.42:3001/api/user/su", {
                method: "POST",
                headers: { "Content-Type": 'application/json' },
                body: JSON.stringify({
                    username,
                    firstName,
                    lastName,
                    email,
                    password
                })
            });
            if (response.ok) {
                const jsonRes = await response.json();
                await AsyncStorage.setItem("userId", jsonRes.user._id);
                useUserStore.getState().setUser(jsonRes.user);
                return true;
            } else {
                const errorRes = await response.json();
                console.log("Signup error:", errorRes);
                return false;
            }
        } catch (error) {
            console.log("Error Sign up!", error);
            return false;
        }
    };

    const signIn = async (email, password) => {
        try {
            const response = await fetch("http://192.168.43.42:3001/api/user/si", {
                method: "POST",
                headers: { "Content-Type": 'application/json' },
                body: JSON.stringify({ email, password })
            });
            if (response.ok) {
                const jsonRes = await response.json();
                await AsyncStorage.setItem("userId", jsonRes.user._id);
                useUserStore.getState().setUser(jsonRes.user);
                return true;
            } else {
                const errorRes = await response.json();
                console.log("Signin error:", errorRes);
                return false;
            }
        } catch (error) {
            console.log("Error Sign up!", error);
            return false;
        }
    }

    const restoreUser = async () => {
        try {
            const userId = await AsyncStorage.getItem("userId");

            // console.log("Stored userId:", userId);

            if (!userId) {
                console.log("No stored user");
                return;
            }

            const response = await fetch(
                `http://192.168.43.42:3001/api/user/${userId}`
            );

            // console.log("Restore status:", response.status);

            const data = await response.json();

            // console.log("Restore response:", data);

            if (!response.ok) {
                await AsyncStorage.removeItem("userId");
                useUserStore.getState().logout();
                return;
            }

            useUserStore.getState().setUser(data);

            // console.log("User restored:", data);

        } catch (error) {
            console.log("Restore user error:", error);
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem("userId");
            useUserStore.getState().logout();
        } catch (error) {
            console.error("Logout error:", error);
        }
    };


    return ({ signUp, signIn, restoreUser, logout });
}