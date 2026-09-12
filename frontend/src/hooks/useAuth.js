import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserStore } from "../../store/userStore";
import { API_URL } from "../config/api";

export const useAuth = () => {
    const signUp = async (username, firstName, lastName, email, password) => {
        try {
            // console.log("Here is in Hook", username, firstName, lastName, email, password);
            const response = await fetch(`${API_URL }/api/user/su`, {
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
                await AsyncStorage.setItem("authToken", jsonRes.token);
                useUserStore.getState().setUser({
                    ...jsonRes.user,
                    token: jsonRes.token,
                }); return true;
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
            const response = await fetch(`${API_URL }/api/user/si`, {
                method: "POST",
                headers: { "Content-Type": 'application/json' },
                body: JSON.stringify({ email, password })
            });
            if (response.ok) {
                const jsonRes = await response.json();
                await AsyncStorage.setItem("authToken", jsonRes.token);
                useUserStore.getState().setUser({
                    ...jsonRes.user,
                    token: jsonRes.token,
                }); return true;
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
            const token = await AsyncStorage.getItem("authToken");

            if (!token) {
                await AsyncStorage.removeItem("authToken");
                useUserStore.getState().logout();
                return;
            }

            const response = await fetch(`${API_URL }/api/user/returnMe`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            );

            const data = await response.json();

            if (!response.ok) {
                await AsyncStorage.removeItem("authToken");
                useUserStore.getState().logout();
                return;
            }

            useUserStore.getState().setUser({
                ...data,
                token,
            });


        } catch (error) {
            console.log("Restore user error:", error);
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem("authToken");
            useUserStore.getState().logout();
        } catch (error) {
            console.error("Logout error:", error);
        }
    };


    return ({ signUp, signIn, restoreUser, logout });
}