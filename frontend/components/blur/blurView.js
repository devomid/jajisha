import { BlurView } from "expo-blur";

const GlassBackground = ({ style, theme }) => {
    return (
        <BlurView
            intensity={19}
            tint={
                theme.dark ?
                    "systemUltraThinMaterialDark"
                    : "systemUltraThinMaterialLight"
            }
            style={[
                style,
                {
                    borderRadius: 48,
                    overflow: "hidden",
                    borderWidth: 1,
                    borderColor: theme.colors.primaryLighter + '80',
                    backgroundColor: theme.colors.primary + '30'
                }
            ]}
        />
    );
};

export default GlassBackground;