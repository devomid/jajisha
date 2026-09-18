import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserStore } from "../../store/userStore";
import { API_URL } from "../config/api";
import * as SecureStore from "expo-secure-store";
import useWaitingSystemStore from '../../store/waitingSystemStore';

export const useAuth = () => {

    const startWaiting = useWaitingSystemStore(state => state.startWaiting);
    const updateWaiting = useWaitingSystemStore(state => state.updateWaiting);
    const endWaiting = useWaitingSystemStore(state => state.endWaiting);

    const signUp = async (username, firstName, lastName, email, password) => {

        const waitingId = startWaiting("Checking your info...");

        try {
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
            updateWaiting(
                waitingId,
                "Making account..."
            )

            if (response.ok) {
                const jsonRes = await response.json();
                await SecureStore.setItemAsync("authToken", jsonRes.token);
                useUserStore.getState().setUser({
                    ...jsonRes.user,
                    token: jsonRes.token,
                });
                return;
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
            endWaiting(waitingId);
        }
    };

    const signIn = async (email, password) => {

        const waitingId = startWaiting("Checking account info...");

        try {
            const response = await fetch(`${API_URL}/api/user/si`, {
                method: "POST",
                headers: { "Content-Type": 'application/json' },
                body: JSON.stringify({ email, password })
            });
            updateWaiting(waitingId, "Putting your stuff back...")
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
            endWaiting(waitingId);
        }
    }

    const restoreUser = async () => {

        const waitingId = startWaiting("Remembering you");

        try {
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
            endWaiting(waitingId);
        }
    };

    const logout = async () => {

        const waitingId = startWaiting("Logging out...");

        try {
            await SecureStore.deleteItemAsync("authToken");
            useUserStore.getState().logout();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            endWaiting(waitingId);
        }
    };

    const deleteUser = async () => {

        const waitingId = startWaiting("Throwing your stuff to toilet...");

        try {
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
            endWaiting(waitingId);
        }
    }


    return ({ signUp, signIn, restoreUser, logout, deleteUser });
}