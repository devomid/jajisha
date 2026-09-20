import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import { router } from "expo-router";

import { Mail, KeyRound, ShieldCheck, UserRound, AtSign } from 'lucide-react-native';
import { View, StyleSheet, Pressable } from "react-native";
import { Text, useTheme } from "react-native-paper";
import MapView from "react-native-maps";
import { BlurView } from "expo-blur";
import { SafeAreaView } from "react-native-safe-area-context";

import { signUpSchema, } from "../../src/validation/userInfoSchema";
import { useSettingsStore } from "../../store/settingsStore";
import { useAuth } from "../../src/hooks/useAuth"
import useCurrentLocation from "../../src/hooks/useCurrentLocation";

import ButtonComponent from "../../components/Button/Button";
import FormInput from "../../components/inpuField/formInput";


export default function SignUp() {

    const { t } = useTranslation();
    const theme = useTheme();
    const currentLocation = useCurrentLocation();
    const { signUp } = useAuth();

    const [region, setRegion] = useState(null);
    const mapType = useSettingsStore(state => state.mapType);

    const {
        values,
        errors,
        touched,
        isSubmitting,
        handleSubmit,
        handleBlur,
        handleChange,
    } = useFormik({
        initialValues: {
            username: "",
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: ""
        },

        validationSchema: signUpSchema(t),

        onSubmit: async (values, { resetForm }) => {
            const isSignedUp = await signUp(
                values.username,
                values.firstName,
                values.lastName,
                values.email,
                values.password
            )
            if (!isSignedUp) {
                return
            }
            router.push('/');
            resetForm();
        },
    });

    const handleCancel = () => {
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

    return (
        <View style={{
            flex: 1,
        }}>

            {region && (
                <MapView
                    mapType={mapType}
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                    }}
                    showsUserLocation={false}
                    initialRegion={region}
                />
            )}

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
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    backgroundColor: theme.colors.primary,
                    opacity: 0.18,
                    borderRadius: 48,
                    marginBottom: 12,
                    marginTop: 12,
                    marginHorizontal: 12,
                    overflow: "hidden",
                }}
            />

            <SafeAreaView style={{
                flex: 1,
            }}>

                {!region ? (
                    <View style={{
                        flex: 1,
                    }} />
                ) : (
                    <View style={{
                        flex: 1,
                    }}>

                        <View style={{
                            width: "100%",
                            paddingHorizontal: 25,
                            marginTop: 70,
                            marginBottom: 30,
                        }}>
                            <Text style={{ color: theme.colors.secondaryDarker + '99' }} variant="displayLarge">
                                {t("app.auth.signup.signupTitle")}
                            </Text>

                            <Text style={{
                                color: theme.colors.secondaryDarker + '99',
                                marginLeft: 2
                            }} variant="bodyMedium">
                                {t("app.auth.signup.signupSubTitle")}
                            </Text>
                        </View>

                        <View style={{
                            paddingHorizontal: 25,
                            gap: 15,
                        }}>
                            <FormInput
                                label={t("app.auth.signup.emailInput")}
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
                                label={t("app.auth.signup.passwordInput")}
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

                            <FormInput
                                label={t("app.auth.signup.confirmPasswordInput")}
                                icon={ShieldCheck}
                                value={values.confirmPassword}
                                onChangeText={handleChange("confirmPassword")}
                                onBlur={handleBlur("confirmPassword")}
                                error={errors.confirmPassword}
                                touched={touched.confirmPassword}
                                theme={theme}
                                secureTextEntry
                                autoCapitalize="none"
                                autoCorrect={false}
                            />

                            <View style={{
                                display: 'flex',
                                flexDirection: 'row',
                                width: '100%',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}>
                                <FormInput
                                    label={t("app.auth.signup.firstnameInput")}
                                    icon={UserRound}
                                    value={values.firstName}
                                    onChangeText={handleChange("firstName")}
                                    onBlur={handleBlur("firstName")}
                                    error={errors.firstName}
                                    touched={touched.firstName}
                                    theme={theme}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    style={{ width: '48%' }}
                                />

                                <FormInput
                                    label={t("app.auth.signup.lastnameInput")}
                                    icon={UserRound}
                                    value={values.lastName}
                                    onChangeText={handleChange("lastName")}
                                    onBlur={handleBlur("lastName")}
                                    error={errors.lastName}
                                    touched={touched.lastName}
                                    theme={theme}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    style={{ width: '48%' }}
                                />
                            </View>

                            <FormInput
                                label={t("app.auth.signup.usernameInput")}
                                icon={AtSign}
                                value={values.username}
                                onChangeText={handleChange("username")}
                                onBlur={handleBlur("username")}
                                error={errors.username}
                                touched={touched.username}
                                theme={theme}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />

                            <View style={{
                                minHeight: 80
                            }}>
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

                                {touched.confirmPassword && errors.confirmPassword && (
                                    <Text style={{
                                        color: theme.colors.error,
                                        fontSize: 12,
                                        marginLeft: 4,
                                    }}>
                                        {errors.confirmPassword}
                                    </Text>
                                )}

                                {touched.firstName && errors.firstName && (
                                    <Text style={{
                                        color: theme.colors.error,
                                        fontSize: 12,
                                        marginLeft: 4,
                                    }}>
                                        {errors.firstName}
                                    </Text>
                                )}

                                {touched.lastName && errors.lastName && (
                                    <Text style={{
                                        color: theme.colors.error,
                                        fontSize: 12,
                                        marginLeft: 4,
                                    }}>
                                        {errors.lastName}
                                    </Text>
                                )}

                                {touched.username && errors.username && (
                                    <Text style={{
                                        color: theme.colors.error,
                                        fontSize: 12,
                                        marginLeft: 4,
                                    }}>
                                        {errors.username}
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
                                    }}
                                >
                                    <Text style={{
                                        color: theme.colors.secondary
                                    }}>
                                        {t("app.auth.signup.signupBtn")}
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
                                        {t("app.auth.signup.cancelBtn")}
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
                                        {t("app.auth.signup.signupBottomText")}
                                    </Text>

                                    <Pressable onPress={() => router.push("/SignIn")}>
                                        <Text
                                            style={{
                                                color: theme.colors.secondaryDarker,
                                                fontWeight: "600",
                                            }}
                                        >
                                            {t("app.auth.signup.signinLink")}
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
