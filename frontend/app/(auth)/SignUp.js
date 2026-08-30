import { useEffect, useState } from "react";
import { useAuth } from "../../src/hooks/useAuth"
import { useFormik } from "formik";
import useCurrentLocation from "../../src/hooks/useCurrentLocation";

import MapView from "react-native-maps";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { Text, TextInput, Button, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, StyleSheet, Pressable } from "react-native";
import { signInSchema } from "../../src/validation/userInfoSchema";

export default function SignUp() {
    const theme = useTheme();
    const currentLocation = useCurrentLocation();
    const { signUp } = useAuth();

    const [region, setRegion] = useState(null);

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

        validationSchema: signInSchema,

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
        <View style={styles.container}>

            {/* MAP BACKGROUND */}
            {region && (
                <MapView
                    style={StyleSheet.absoluteFillObject}
                    showsUserLocation={false}
                    initialRegion={region}
                />
            )}

            {/* BLUR */}
            <BlurView
                intensity={15}
                tint="light"
                style={StyleSheet.absoluteFillObject}
            />

            {/* PRIMARY COLOR OVERLAY */}
            <View
                pointerEvents="none"
                style={[
                    StyleSheet.absoluteFillObject,
                    {
                        backgroundColor: theme.colors.primary,
                        opacity: 0.18,
                    },
                ]}
            />

            <SafeAreaView style={styles.safeArea}>

                {!region ? (
                    // Keep the page structure while location loads
                    <View style={styles.loadingContainer} />
                ) : (
                    <View style={styles.content}>

                        {/* TITLE */}
                        <View style={styles.titleContainer}>
                            <Text style={{ color: theme.colors.secondaryDarker }} variant="displayLarge">
                                Sign Up
                            </Text>
                            <Text style={{ color: theme.colors.secondaryDarker, marginLeft: 2 }} variant="bodyMedium">
                                so you can save places.
                            </Text>
                        </View>

                        {/* FORM */}
                        <View style={styles.form}>
                            <TextInput
                                label="Email"
                                mode="outlined"
                                outlineColor={theme.colors.secondaryLight + '80'}
                                activeOutlineColor={theme.colors.primary}
                                value={values.email}
                                onChangeText={handleChange("email")}
                                onBlur={handleBlur("email")}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                error={Boolean(touched.email && errors.email)}
                                style={{ backgroundColor: theme.colors.secondaryLight + "30", height: 40 }}
                            />

                            {touched.email && errors.email && (
                                <Text style={styles.error}>
                                    {errors.email}
                                </Text>
                            )}

                            <TextInput
                                label="Password"
                                mode="outlined"
                                outlineColor={theme.colors.secondaryLight + '80'}
                                activeOutlineColor={theme.colors.primary}
                                value={values.password}
                                onChangeText={handleChange("password")}
                                onBlur={handleBlur("password")}
                                secureTextEntry
                                autoCapitalize="none"
                                error={Boolean(touched.password && errors.password)}
                                style={{ backgroundColor: theme.colors.secondaryLight + "30", height: 40 }}

                            />

                            {touched.password && errors.password && (
                                <Text style={styles.error}>
                                    {errors.password}
                                </Text>
                            )}

                            <TextInput
                                label="Confirm Password"
                                mode="outlined"
                                outlineColor={theme.colors.secondaryLight + '80'}
                                activeOutlineColor={theme.colors.primary}
                                value={values.confirmPassword}
                                onChangeText={handleChange("confirmPassword")}
                                onBlur={handleBlur("confirmPassword")}
                                secureTextEntry
                                autoCapitalize="none"
                                error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                                style={{ backgroundColor: theme.colors.secondaryLight + "30", height: 40 }}

                            />

                            {touched.confirmPassword && errors.confirmPassword && (
                                <Text style={styles.error}>
                                    {errors.confirmPassword}
                                </Text>
                            )}

                            <View style={{
                                display: 'flex',
                                flexDirection: 'row',
                                width: '100%',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}>
                                <TextInput
                                    label="First Name"
                                    mode="outlined"
                                    outlineColor={theme.colors.secondaryLight + '80'}
                                    activeOutlineColor={theme.colors.primary}
                                    value={values.firstName}
                                    onChangeText={handleChange("firstName")}
                                    onBlur={handleBlur("firstName")}
                                    autoCapitalize="words"
                                    autoCorrect={false}
                                    error={Boolean(touched.firstName && errors.firstName)}
                                    style={{ width: '48%', backgroundColor: theme.colors.secondaryLight + "30", height: 40 }}
                                />

                                {touched.firstName && errors.firstName && (
                                    <Text style={styles.error}>
                                        {errors.firstName}
                                    </Text>
                                )}

                                <TextInput
                                    label="Last Name"
                                    mode="outlined"
                                    outlineColor={theme.colors.secondaryLight + '80'}
                                    activeOutlineColor={theme.colors.primary}
                                    value={values.lastName}
                                    onChangeText={handleChange("lastName")}
                                    onBlur={handleBlur("lastName")}
                                    autoCapitalize="words"
                                    autoCorrect={false}
                                    error={Boolean(touched.lastName && errors.lastName)}
                                    style={{ width: '48%', backgroundColor: theme.colors.secondaryLight + "30", height: 40 }}
                                />

                                {touched.lastName && errors.lastName && (
                                    <Text style={styles.error}>
                                        {errors.lastName}
                                    </Text>
                                )}
                            </View>

                            <TextInput
                                label="Username"
                                mode="outlined"
                                outlineColor={theme.colors.secondaryLight + '80'}
                                activeOutlineColor={theme.colors.primary}
                                value={values.username}
                                onChangeText={handleChange("username")}
                                onBlur={handleBlur("username")}
                                autoCapitalize="none"
                                autoCorrect={false}
                                error={Boolean(touched.username && errors.username)}
                                style={{ backgroundColor: theme.colors.secondaryLight + "30", height: 40 }}
                            />

                            {touched.username && errors.username && (
                                <Text style={styles.error}>
                                    {errors.username}
                                </Text>
                            )}

                            <View>
                                    <Pressable
                                        onPress={handleSubmit}
                                        disabled={isSubmitting}
                                    >
                                        {({ pressed }) => (
                                            <View style={{ transform: [{ scale: pressed ? 0.95 : 1, }] }}>
                                                <Button
                                                    mode="contained"
                                                    loading={isSubmitting}
                                                    disabled={isSubmitting}
                                                    style={{
                                                        backgroundColor:
                                                            theme.colors.success + "50",
                                                    }}
                                                >
                                                    <Text style={{ color: theme.colors.secondary }}>
                                                        Sign Up
                                                    </Text>
                                                </Button>
                                            </View>
                                        )}
                                    </Pressable>
                                <Pressable
                                    onPress={handleCancel}
                                    disabled={isSubmitting}
                                >
                                    {({ pressed }) => (
                                        <View style={{ transform: [{ scale: pressed ? 0.95 : 1, }] }}>
                                            <Button
                                                mode="contained"
                                                loading={isSubmitting}
                                                disabled={isSubmitting}
                                                style={{
                                                    marginTop: 15,
                                                    backgroundColor:
                                                        theme.colors.error + "45",
                                                }}
                                            >
                                                <Text style={{ color: theme.colors.secondary }}>
                                                    Cancel
                                                </Text>
                                            </Button>
                                        </View>
                                    )}
                                </Pressable>
                                <Text style={{
                                    alignSelf: 'center',
                                    marginTop: '32',
                                    color: theme.colors.secondary
                                }}>
                                    Already a member?
                                </Text>
                                <Pressable
                                    onPress={() => {
                                        router.push('/SignIn');
                                    }}
                                >
                                    {({ pressed }) => (
                                        <View style={{ transform: [{ scale: pressed ? 0.95 : 1, }] }}>
                                            <Button
                                                mode="contained"
                                                style={{
                                                    marginTop: 15,
                                                    backgroundColor: theme.colors.primaryDarker + "45",
                                                }}
                                            >
                                                <Text style={{ color: theme.colors.secondaryDarker, }}>
                                                    Become a new member
                                                </Text>
                                            </Button>
                                        </View>
                                    )}
                                </Pressable>
                            </View>


                        </View>
                    </View>
                )}

            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    safeArea: {
        flex: 1,
    },

    loadingContainer: {
        flex: 1,
    },

    content: {
        flex: 1,
    },

    titleContainer: {
        width: "100%",
        paddingHorizontal: 25,
        marginTop: 70,
        marginBottom: 30,
    },

    form: {
        paddingHorizontal: 25,
        gap: 15,
    },

    error: {
        marginTop: -12,
        marginLeft: 4,
        fontSize: 12,
        color: "#B00020",
    },

    button: {
        marginTop: 15,
    },
});