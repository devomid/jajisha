import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import { router } from "expo-router";

import { View, StyleSheet, Pressable } from "react-native";
import { Mail, KeyRound } from 'lucide-react-native';
import { Text, useTheme } from "react-native-paper";
import MapView from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { Checkbox } from 'expo-checkbox';

import { signInSchema } from "../../src/validation/userInfoSchema";
import { useAuth } from "../../src/hooks/useAuth";
import useCurrentLocation from "../../src/hooks/useCurrentLocation";
import { useSettingsStore } from "../../store/settingsStore";
import { useTopSheetStore } from "../../store/menuStore";
import logger from "../../src/utils/logger";

import ButtonComponent from "../../components/Button/Button";
import FormInput from "../../components/inpuField/formInput";

export default function SignIn() {
    const { t } = useTranslation();
    const theme = useTheme();
    const currentLocation = useCurrentLocation();
    const { signIn } = useAuth();

    const [region, setRegion] = useState(null);
    const [rememberMe, setRememberMe] = useState(false);
    const mapType = useSettingsStore(state => state.mapType);
    const close = useTopSheetStore((state) => state.close);


    const {
        values,
        errors,
        touched,
        isSubmitting,
        handleSubmit,
        handleBlur,
        handleChange,
        setValues
    } = useFormik({
        initialValues: {
            email: "",
            password: "",
        },

        validationSchema: signInSchema(t),

        onSubmit: async (values, { resetForm }) => {
            const isSignedIn = await signIn(values.email, values.password);
            if (!isSignedIn) { return; }

            try {
                if (rememberMe) {
                    await AsyncStorage.setItem("savedEmail", values.email);
                    await SecureStore.setItemAsync(
                        "savedPassword",
                        values.password
                    );
                } else {
                    await AsyncStorage.removeItem("savedEmail");
                    await SecureStore.deleteItemAsync("savedPassword");
                }
            } catch (error) {
                logger.error("Failed to save login preference", {
                    error: error.message,
                });

                if (toast?.show) {
                    toast.show(t("toast.app.signin.saveLoginPreference1"), {
                        type: "custom",
                        data: {
                            type: "error",
                            text2: t("toast.app.signin.saveLoginPreference2"),
                        },
                    });
                }
            }

            resetForm();
            close();
            router.push('/');
        },
    });

    const handleCancel = () => {
        close();
        router.replace('/')
    }

    useEffect(() => {
        const coords = currentLocation?.coords;

        if (!coords) return;

        setRegion({
            latitude: coords.latitude,
            longitude: coords.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
        });
    }, [currentLocation]);

    useEffect(() => {
        const loadSavedLogin = async () => {
            try {
                const savedEmail = await AsyncStorage.getItem("savedEmail");
                const savedPassword = await SecureStore.getItemAsync(
                    "savedPassword"
                );

                if (savedEmail && savedPassword) {
                    setValues({
                        email: savedEmail,
                        password: savedPassword,
                    });

                    setRememberMe(true);
                }
            } catch (error) {
                logger.error("Failed to load saved login", {
                    error: error.message,
                });

                if (toast?.show) {
                    toast.show(t("toast.app.signin.loadSavedLogin1"), {
                        type: "custom",
                        data: {
                            type: "error",
                            text2: t("toast.app.signin.loadSavedLogin2")
                        },
                    });
                }
            }
        };

        loadSavedLogin();
    }, []);

    return (
        <View style={{ flex: 1, }}>

            {region && (
                <MapView
                    userInterfaceStyle={theme.dark ? "dark" : "light"}
                    mapType={mapType}
                    style={StyleSheet.absoluteFillObject}
                    showsUserLocation={false}
                    initialRegion={region}
                />)}

            <BlurView
                intensity={15}
                tint="light"
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    borderRadius: 48,
                    marginBottom: 12,
                    marginTop: 12,
                    marginHorizontal: 12,
                    overflow: "hidden",
                }}
            />

            <View
                pointerEvents="none"
                style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    right: 0,
                    left: 0,
                    backgroundColor: theme.colors.primary,
                    opacity: 0.18,
                    borderRadius: 48,
                    marginBottom: 12,
                    marginTop: 12,
                    marginHorizontal: 12,
                    overflow: "hidden",
                }}
            />

            <SafeAreaView style={{ flex: 1, }}>

                {!region ? (
                    <View
                        style={{ flex: 1, }}
                    />
                ) : (
                    <View
                        style={{ flex: 1, }}
                    >
                        <View style={{
                            width: "100%",
                            paddingHorizontal: 25,
                            marginTop: 70,
                            marginBottom: 50,
                        }}>
                            <Text style={{ color: theme.colors.secondaryDarker + '99' }}
                                variant="displayLarge">
                                {t("app.auth.signin.signinTitle")}
                            </Text>
                            <Text style={{ color: theme.colors.secondaryDarker + '99', marginLeft: 2 }}
                                variant="bodyMedium">
                                {t("app.auth.signin.signinSubTitle")}
                            </Text>
                        </View>

                        <View style={{
                            paddingHorizontal: 25,
                            gap: 15,
                        }}>
                            <FormInput
                                label={t("app.auth.signin.emailInput")}
                                icon={Mail}
                                value={values.email}
                                onChangeText={handleChange("email")}
                                onBlur={handleBlur("email")}
                                error={errors.email}
                                touched={touched.email}
                                theme={theme}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />

                            <FormInput
                                label={t("app.auth.signin.passwordInput")}
                                icon={KeyRound}
                                value={values.password}
                                onChangeText={handleChange("password")}
                                onBlur={handleBlur("password")}
                                error={errors.password}
                                touched={touched.password}
                                theme={theme}
                                secureTextEntry
                                autoCapitalize="none"
                                autoCorrect={false}
                            />

                            <View style={{
                                flexDirection: "row",
                                alignItems: "center"
                            }}>
                                <Checkbox
                                    onValueChange={setRememberMe}
                                    value={rememberMe}
                                    color={rememberMe
                                        ? theme.colors.primary
                                        : theme.colors.secondaryLight}
                                    style={{
                                        margin: 10,
                                        width: 17,
                                        height: 17
                                    }}
                                />

                                <Text style={{
                                    color: theme.colors.secondary
                                }}>
                                    {t("app.auth.signin.rememberMe")}
                                </Text>
                            </View>

                            <View style={{ minHeight: 150 }}>
                                {touched.email && errors.email && (
                                    <Text style={{
                                        color: theme.colors.error,
                                        fontSize: 12,
                                        marginLeft: 4,
                                    }}>
                                        {errors.email}
                                    </Text>
                                )}

                                {touched.password && errors.password && (
                                    <Text style={{
                                        color: theme.colors.error,
                                        fontSize: 12,
                                        marginLeft: 4,
                                    }}>
                                        {errors.password}
                                    </Text>
                                )}
                            </View>

                            <View>
                                <ButtonComponent
                                    onPress={handleSubmit}
                                    backgroundColor={theme.colors.success + '20'}
                                    borderColor={theme.colors.success + '50'}
                                    style={{
                                        width: '100%',
                                        marginTop: '5'
                                    }}
                                >
                                    <Text style={{
                                        color: theme.colors.secondary
                                    }}>
                                        {t("app.auth.signin.signinBtn")}
                                    </Text>
                                </ButtonComponent>

                                <ButtonComponent
                                    onPress={handleCancel}
                                    backgroundColor={theme.colors.error + '20'}
                                    borderColor={theme.colors.error + '50'}
                                    style={{
                                        width: '100%',
                                        marginTop: '15'
                                    }}
                                >
                                    <Text style={{
                                        color: theme.colors.secondary
                                    }}>
                                        {t("app.auth.signin.cancelBtn")}
                                    </Text>
                                </ButtonComponent>

                                <View style={{
                                    marginTop: '40',
                                    flexDirection: 'row',
                                    gap: 15,
                                    alignSelf: 'center'
                                }}>
                                    <Text style={{
                                        color: theme.colors.text + '90'
                                    }}>
                                        {t("app.auth.signin.signinBottomText")}
                                    </Text>

                                    <Pressable
                                        onPress={() => router.push("/SignUp")}>
                                        <Text
                                            style={{
                                                color: theme.colors.secondaryDarker,
                                                fontWeight: "600",
                                            }}
                                        >
                                            {t("app.auth.signin.signupLink")}
                                        </Text>
                                    </Pressable>
                                </View>
                            </View>

                        </View>
                    </View>
                )}
            </SafeAreaView>
        </View>
    );
}