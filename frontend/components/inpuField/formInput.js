import { useState } from "react";
import {
    View,
    TextInput,
    StyleSheet,
} from "react-native";

export default function FormInput({
    label,
    icon: Icon,

    value,
    onChangeText,
    onBlur,

    error,
    touched,

    theme,

    multiline = false,
    maxLength,
    style,

    ...textInputProps
}) {
    const [focused, setFocused] = useState(false);

    const hasError = Boolean(touched && error);

    return (
        <View style={[styles.wrapper, style]}>

            <View
                style={[
                    styles.inputContainer,
                    {
                        backgroundColor:
                            theme.colors.secondaryLight + "15",

                        borderColor: hasError
                            ? theme.colors.error
                            : focused
                                ? theme.colors.secondary + "80"
                                : theme.colors.secondaryLight + "80",

                        borderWidth: 0.5,

                        borderRadius: 14,
                    },

                    multiline && {
                        minHeight: 90,
                    },
                ]}
            >
                {Icon && (
                    <View style={styles.iconContainer}>
                        <Icon
                            size={17}
                            strokeWidth={1.5}
                            color={theme.colors.secondary + "70"}
                        />
                    </View>
                )}

                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    onBlur={(e) => {
                        setFocused(false);
                        onBlur?.(e);
                    }}
                    onFocus={() => setFocused(true)}

                    placeholder={label}
                    placeholderTextColor={
                        theme.colors.secondary + "70"
                    }

                    multiline={multiline}
                    maxLength={maxLength}

                    selectionColor={
                        theme.colors.primaryDarker
                    }

                    textAlignVertical={
                        multiline ? "top" : "center"
                    }

                    style={[
                        styles.input,

                        {
                            color: theme.colors.text,
                        },

                        Icon && styles.inputWithIcon,

                        multiline && styles.multilineInput,
                    ]}

                    {...textInputProps}
                />
            </View>

            {/* {hasError && (
                <Text
                    style={[
                        styles.errorText,
                        {
                            color: theme.colors.error,
                        },
                    ]}
                >
                    {error}
                </Text>
            )} */}

        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        width: "100%",
    },

    inputContainer: {
        width: "100%",
        minHeight: 44,
        flexDirection: "row",
        alignItems: "center",
    },

    iconContainer: {
        width: 42,
        alignItems: "center",
        justifyContent: "center",
    },

    input: {
        flex: 1,
        height: 44,
        paddingHorizontal: 10,
        paddingVertical: 0,
        fontSize: 16,
    },

    inputWithIcon: {
        paddingLeft: 0,
    },

    multilineInput: {
        height: 100,
        paddingTop: 12,
        paddingBottom: 12,
        textAlignVertical: "top",
    },

    errorText: {
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
});