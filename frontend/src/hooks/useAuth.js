import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserStore } from "../../store/userStore";
import { API_URL } from "../config/api";
import * as SecureStore from "expo-secure-store";
import useWaitingSystemStore from '../../store/waitingSystemStore';

export const useAuth = () => {

    const signUp = async (username, firstName, lastName, email, password) => {

        const setSignupWaiting = useWaitingSystemStore(state => state.setSignupWaiting);
        const setSignupEndWaiting = useWaitingSystemStore(state => state.setSignupEndWaiting);

        try {
            setSignupWaiting();

            const response = await fetch(`${API_URL}/api/user/su`, {
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
                await SecureStore.setItemAsync("authToken", jsonRes.token);
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
        finally {
            setSignupEndWaiting();
        }
    };

    const signIn = async (email, password) => {

        const setSigninWaiting = useWaitingSystemStore(state => state.setSigninWaiting);
        const setSigninEndWaiting = useWaitingSystemStore(state => state.setSigninEndWaiting);

        try {
            setSigninWaiting();
            const response = await fetch(`${API_URL}/api/user/si`, {
                method: "POST",
                headers: { "Content-Type": 'application/json' },
                body: JSON.stringify({ email, password })
            });
            if (response.ok) {
                const jsonRes = await response.json();
                await SecureStore.setItemAsync("authToken", jsonRes.token);
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
            console.log("Error Sign in!", error);
            return false;
        } finally {
            setSigninEndWaiting();
        }
    }

    const restoreUser = async () => {

        const setRestoreUserWaiting = useWaitingSystemStore(state => state.setRestoreUserWaiting);
        const setRestoreUserEndWaiting = useWaitingSystemStore(state => state.setRestoreUserEndWaiting);

        try {
            setRestoreUserWaiting();
            const token = await SecureStore.getItemAsync("authToken");

            if (!token) {
                await SecureStore.deleteItemAsync("authToken");
                useUserStore.getState().logout();
                return;
            }

            const response = await fetch(`${API_URL}/api/user/returnMe`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            );

            const data = await response.json();

            if (!response.ok) {
                await SecureStore.deleteItemAsync("authToken");
                useUserStore.getState().logout();
                return;
            }

            useUserStore.getState().setUser({
                ...data,
                token,
            });

        } catch (error) {
            console.log("Restore user error:", error);
        } finally {
            setRestoreUserEndWaiting();
        }
    };

    const logout = async () => {

        const setLogoutWaiting = useWaitingSystemStore(state => state.setLogoutWaiting);
        const setLogoutEndWaiting = useWaitingSystemStore(state => state.setLogoutEndWaiting);

        try {
            setLogoutWaiting();
            await SecureStore.deleteItemAsync("authToken");
            useUserStore.getState().logout();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setLogoutEndWaiting();
        }
    };

    const deleteUser = async () => {

        const setDeleteUserWaiting = useWaitingSystemStore(state => state.setDeleteUserWaiting);
        const setDeleteUserEndWaiting = useWaitingSystemStore(state => state.setDeleteUserEndWaiting);

        try {
            setDeleteUserWaiting();
            const token = await AsyncStorage.getItem("authToken");
            const response = await fetch(`${API_URL}/api/user/rm`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (!response.ok) {
                console.error("Failed to delete user.");
                return;
            }
            await SecureStore.deleteItemAsync("authToken");
            useUserStore.getState().logout();

        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setDeleteUserEndWaiting();
        }
    }


    return ({ signUp, signIn, restoreUser, logout, deleteUser });
}