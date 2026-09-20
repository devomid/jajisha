import { useUserStore } from "../../store/userStore";
import { API_URL } from "../config/api";
import * as SecureStore from "expo-secure-store";
import useWaitingSystemStore from '../../store/waitingSystemStore';
import { useToast } from "react-native-toast-notifications";
import logger from "../utils/logger";

export const useAuth = () => {

    const toast = useToast();

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

            if (!response.ok) {
                const errorRes = await response.json();
                logger.warn("Sign up request failed", {
                    status: response.status,
                    signupError: errorRes
                });

                if (toast?.show) {
                    toast.show("Could not sign you up", {
                        type: "custom",
                        data: {
                            type: "error",
                            text2: "Try again a few moments later.",
                        },
                    })
                };
                return null;
            };

            const jsonRes = await response.json();
            await SecureStore.setItemAsync("authToken", jsonRes.token);
            useUserStore.getState().setUser({
                ...jsonRes.user,
                token: jsonRes.token,
            });

            logger.info("Sign up successful");

            if (toast?.show) {
                toast.show("Account created successfully.", {
                    type: "custom",
                    data: {
                        type: "success",
                    },
                })
            };

            return true;

        } catch (error) {
            logger.error("Sign up request error", {
                error: error.message,
            });
            if (toast?.show) {
                toast.show("Something went wrong signing up!", {
                    type: "custom",
                    data: {
                        type: "error",
                        text2: "It can be our servers or your connection. \nCheck and try again.",
                    },
                })
            };
            return null;
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
            updateWaiting(waitingId, "Putting your stuff back...");

            if (!response.ok) {
                const errorRes = await response.json();
                logger.warn("Sign in request failed", {
                    status: response.status,
                    signinError: errorRes
                });

                if (toast?.show) {
                    toast.show("Could not sign you in", {
                        type: "custom",
                        data: {
                            type: "error",
                            text2: "Try again a few moments later.",
                        },
                    })
                };

                return null;
            };


            const jsonRes = await response.json();
            await SecureStore.setItemAsync("authToken", jsonRes.token);
            useUserStore.getState().setUser({
                ...jsonRes.user,
                token: jsonRes.token,

            });
            logger.info("Sign in successful");
            if (toast?.show) {
                toast.show("Signed you in successfully.", {
                    type: "custom",
                    data: {
                        type: "success",
                    },
                })
            };
            return true;

        } catch (error) {
            logger.error("Sign in request error", {
                error: error.message,
            });
            if (toast?.show) {
                toast.show("Something went wrong signing in!", {
                    type: "custom",
                    data: {
                        type: "error",
                        text2: "It can be our servers or your connection. \nCheck and try again.",
                    },
                })
            };

            return null;
        } finally {
            endWaiting(waitingId);
        }
    }

    const restoreUser = async () => {

        const waitingId = startWaiting("Remembering you");

        try {
            const token = await SecureStore.getItemAsync("authToken");

            if (!token) {
                logger.debug("No saved authentication token found");
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

                const errorRes = await response.json();

                logger.warn("User restore request failed", {
                    status: response.status,
                    userRestoreError: errorRes
                });

                if (toast?.show) {
                    toast.show("Could not get your data", {
                        type: "custom",
                        data: {
                            type: "error",
                            text2: "Please check your connection!.",
                        },
                    })
                };

                return;
            }

            const currentToken = await SecureStore.getItemAsync("authToken");

            if (currentToken !== token) {
                return;
            }
            logger.info("User session restored");
            useUserStore.getState().setUser({
                ...data,
                token,
            });

        } catch (error) {
            logger.error("User restore error", {
                error: error.message,
            });
            if (toast?.show) {
                toast.show("Something went wrong signing in!", {
                    type: "custom",
                    data: {
                        type: "error",
                        text2: "It can be our servers or your connection. \nCheck and try again.",
                    },
                })
            };

        } finally {
            endWaiting(waitingId);
        }
    };

    const logout = async () => {

        const waitingId = startWaiting("Logging out...");

        try {
            await SecureStore.deleteItemAsync("authToken");
            useUserStore.getState().logout();
            logger.info("User logged out");

        } catch (error) {
            logger.error("Logout error", {
                error: error.message,
            });
            if (toast?.show) {
                toast.show("Something went wrong logging out!", {
                    type: "custom",
                    data: {
                        type: "error",
                        text2: "It can be our servers or your connection. \nCheck and try again.",
                    },
                })
            };

        } finally {
            endWaiting(waitingId);
        }
    };

    const deleteUser = async () => {

        const waitingId = startWaiting("Throwing your stuff to toilet...");

        try {
            const token = await SecureStore.getItemAsync("authToken");
            const response = await fetch(`${API_URL}/api/user/rm`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (!response.ok) {
                const errorRes = await response.json();
                logger.warn("Delete account request failed", {
                    status: response.status,
                    deleteError: errorRes
                });
                if (toast?.show) {
                    toast.show("Could not delete account", {
                        type: "custom",
                        data: {
                            type: "error",
                            text2: "Try again a few moments later.",
                        },
                    })
                };
                return;
            }
            await SecureStore.deleteItemAsync("authToken");
            useUserStore.getState().logout();

        } catch (error) {
            logger.error("Delete account error", {
                error: error.message,
            });
            if (toast?.show) {
                toast.show("Something went wrong deleting user account!", {
                    type: "custom",
                    data: {
                        type: "error",
                        text2: "It can be our servers or your connection. \nCheck and try again.",
                    },
                })
            };
        } finally {
            endWaiting(waitingId);
        }
    }


    return ({
        signUp,
        signIn,
        restoreUser,
        logout,
        deleteUser
    });
}