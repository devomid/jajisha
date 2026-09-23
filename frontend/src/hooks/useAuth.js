import * as SecureStore from "expo-secure-store";
import { useTranslation } from "react-i18next";
import { useToast } from "react-native-toast-notifications";

import { useUserStore } from "../../src/store/userStore";
import useWaitingSystemStore from '../../src/store/waitingSystemStore';
import { API_URL } from "../config/api";
import logger from "../utils/logger";


export const useAuth = () => {

    const { t } = useTranslation();
    const toast = useToast();

    const startWaiting = useWaitingSystemStore(state => state.startWaiting);
    const updateWaiting = useWaitingSystemStore(state => state.updateWaiting);
    const endWaiting = useWaitingSystemStore(state => state.endWaiting);

    const signUp = async (username, firstName, lastName, email, password) => {

        const waitingId = startWaiting(t("waitingSystem.checkingInfo"));

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

            if (!response.ok) {
                const errorRes = await response.json();
                logger.warn("Sign up request failed", {
                    status: response.status,
                    signupError: errorRes
                });

                if (toast?.show) {
                    toast.show(t("toast.useAuth.signup.noOkRes1"), {
                        type: "custom",
                        data: {
                            type: "error",
                            text2: t("toast.useAuth.signup.noOkRes1")
                        },
                    })
                };
                return null;
            };

            updateWaiting(waitingId, t("waitingSystem.makingAccount"))

            const jsonRes = await response.json();
            await SecureStore.setItemAsync("authToken", jsonRes.token);
            useUserStore.getState().setUser({
                ...jsonRes.user,
                token: jsonRes.token,
            });

            logger.info("Sign up successful");

            if (toast?.show) {
                toast.show(t("toast.useAuth.signup.success"), {
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
                toast.show(t("toast.useAuth.signup.catch1"), {
                    type: "custom",
                    data: {
                        type: "error",
                        text2: t("toast.useAuth.signup.catch2")
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

        const waitingId = startWaiting(t("waitingSystem.checkingInfo"));

        try {
            const response = await fetch(`${API_URL}/api/user/si`, {
                method: "POST",
                headers: { "Content-Type": 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const errorRes = await response.json();
                logger.warn("Sign in request failed", {
                    status: response.status,
                    signinError: errorRes
                });

                if (toast?.show) {
                    toast.show(t("toast.useAuth.signin.noOkRes1"), {
                        type: "custom",
                        data: {
                            type: "error",
                            text2: t("toast.useAuth.signin.noOkRes2")
                        },
                    })
                };

                return null;
            };

            updateWaiting(
                waitingId,
                t("waitingSystem.puttingYourStuffBack")
            );

            const jsonRes = await response.json();
            await SecureStore.setItemAsync("authToken", jsonRes.token);
            useUserStore.getState().setUser({
                ...jsonRes.user,
                token: jsonRes.token,

            });
            logger.info("Sign in successful");
            if (toast?.show) {
                toast.show(t("toast.useAuth.signin.success"), {
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
                toast.show(t("toast.useAuth.signin.catch1"), {
                    type: "custom",
                    data: {
                        type: "error",
                        text2: t("toast.useAuth.signin.catch2")
                    },
                })
            };

            return null;
        } finally {
            endWaiting(waitingId);
        }
    }

    const restoreUser = async () => {

        const waitingId = startWaiting(t("waitingSystem.rememberingYou"));

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

                logger.warn("User restore request failed", {
                    status: response.status,
                    userRestoreError: data
                });

                if (toast?.show) {
                    toast.show(t("toast.useAuth.restoreUser.noOkRes1"), {
                        type: "custom",
                        data: {
                            type: "error",
                            text2: t("toast.useAuth.restoreUser.noOkRes2")
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
                toast.show(t("toast.useAuth.restoreUser.catch1"), {
                    type: "custom",
                    data: {
                        type: "error",
                        text2: t("toast.useAuth.restoreUser.catch2")
                    },
                })
            };

        } finally {
            endWaiting(waitingId);
        }
    };

    const logout = async () => {

        const waitingId = startWaiting(t("waitingSystem.loggingOut"));

        try {
            await SecureStore.deleteItemAsync("authToken");
            useUserStore.getState().logout();
            logger.info("User logged out");

        } catch (error) {
            logger.error("Logout error", {
                error: error.message,
            });
            if (toast?.show) {
                toast.show(t("toast.useAuth.logout.catch1"), {
                    type: "custom",
                    data: {
                        type: "error",
                        text2: t("toast.useAuth.logout.catch2")
                    },
                })
            };

        } finally {
            endWaiting(waitingId);
        }
    };

    const deleteUser = async () => {

        const waitingId = startWaiting(t("waitingSystem.throwingYourStuffToToilet"));

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
                    toast.show(t("toast.useAuth.deleteUser.noOkRes1"), {
                        type: "custom",
                        data: {
                            type: "error",
                            text2: t("toast.useAuth.deleteUser.noOkRes2")
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
                toast.show(t("toast.useAuth.deleteUser.catch1"), {
                    type: "custom",
                    data: {
                        type: "error",
                        text2: t("toast.useAuth.deleteUser.catch2")
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