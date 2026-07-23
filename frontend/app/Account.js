import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PageHeader from "../components/topNav/topNav";
import { Text } from "react-native-paper";

export default function Account() {
  return (
    <View style={{ flex: 1 }}>

      <SafeAreaView
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
        }}
      >
        <PageHeader />
      </SafeAreaView>

      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>
          Account
        </Text>
      </View>

    </View>
  );
}