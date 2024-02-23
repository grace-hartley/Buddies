import { StatusBar } from "expo-status-bar";
import { useEffect, useState, useCallback } from "react";
import { Camera, CameraType } from "expo-camera";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import { LoginScreen } from "./src/screens/Login/LoginScreen";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { SignupScreen } from "./src/screens/Signup/SignupScreen";
import { UserProfileScreen } from "./src/screens/User/UserProfileScreen";
import { PlantProfileScreen } from "./src/screens/Plants/PlantProfileScreen";
import { IdentifiedScreen } from "./src/screens/Plants/IdentifiedScreen";
import { UnidentifiedScreen } from "./src/screens/Plants/UnidentifiedScreen";
import { HomeScreen } from "./src/screens/Home/HomeScreen";
import UserContext from "./context/UserContext";
import "react-native-gesture-handler";
import { CameraComponent } from "./src/screens/components/CameraComponent";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackScreens } from "./App.screens";
import { fonts } from "./fonts";
import { Image } from "react-native";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export const Stack = createNativeStackNavigator();

const Drawer = createDrawerNavigator();

export const DrawerScreens = {
  AppStack: "AppStack",
};

function CustomDrawerContent(props) {
  const { navigate } = useNavigation();
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.avatarContainer}>
        <Image
          source={require("./assets/avatar.jpg")}
          style={styles.avatarImage}
        />
        <View style={styles.greetingContainer}>
          <Text
            style={[
              styles.greetingText,
              { fontFamily: "GT-Eesti-Display-Medium-Trial" },
            ]}
          >
            Hi, Buddy!✨
          </Text>
        </View>
      </View>

      <DrawerItem
        label="View Profile"
        onPress={() => {
          navigate(StackScreens.UserProfileScreen);
        }}
      />
      <DrawerItem
        label="Browse Plants"
        onPress={() => {
          navigate(StackScreens.HomeScreen);
        }}
      />
      <DrawerItem
        label="Change Profile"
        onPress={() => {
          navigate(StackScreens.Login);
        }}
      />
      <DrawerItem
        label="Log out"
        onPress={() => {
          //should log out
        }}
      />
    </DrawerContentScrollView>
  );
}

const AppStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name={StackScreens.HomeScreen}
      component={HomeScreen}
      options={{ title: "Home Screen", headerShown: false }}
    />
    <Stack.Screen
      name={StackScreens.Login}
      component={LoginScreen}
      options={{ title: "Login", headerShown: false }}
    />
    <Stack.Screen
      name={StackScreens.SignupScreen}
      component={SignupScreen}
      options={{ title: "Sign Up", headerShown: false }}
    />
    <Stack.Screen
      name={StackScreens.UserProfileScreen}
      component={UserProfileScreen}
      options={{ title: "User Profile", headerShown: false }}
    />
    <Stack.Screen
      name={StackScreens.PlantProfileScreen}
      component={PlantProfileScreen}
      options={{ title: "Plant Profile", headerShown: false }}
    />
    <Stack.Screen
      name={StackScreens.IdentifiedScreen}
      component={IdentifiedScreen}
      options={{ title: "Indetified Screen", headerShown: false }}
    />
    <Stack.Screen
      name={StackScreens.UnidentifiedScreen}
      component={UnidentifiedScreen}
      options={{
        title: "Unidentified Screen",
        headerShown: false,
      }}
    />
    <Stack.Screen
      name={StackScreens.CameraComponent}
      component={CameraComponent}
      options={{ title: "Camera", headerShown: false }}
    />
  </Stack.Navigator>
);

export default function App() {
  const [fontsLoaded, fontError] = useFonts(fonts);

  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    if (fontsLoaded === true) {
      setAppIsReady(true);
    }
  }, [fontsLoaded]);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [loggedUser, setLoggedUser] = useState({});

  useEffect(() => {
    requestPermission();
  }, []);

  if (!appIsReady) {
    return null;
  }
  if (!fontsLoaded) {
    return null;
  }

  if (!permission?.granted) {
    return null;
  }

  return (
    <UserContext.Provider value={{ loggedUser, setLoggedUser }}>
      <SafeAreaView onLayout={onLayoutRootView} style={{ flex: 1 }}>
        <NavigationContainer>
          <Drawer.Navigator
            initialRouteName={DrawerScreens.AppStack}
            drawerContent={(props) => <CustomDrawerContent {...props} />}
          >
            <Drawer.Screen name=" " component={AppStack}></Drawer.Screen>
          </Drawer.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </UserContext.Provider>
  );
}
const styles = StyleSheet.create({
  greetingContainer: {
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  greetingText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  avatarContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 20,
    marginRight: 10,
  },
  greetingContainer: {
    flex: 1,
  },
  greetingText: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "GT-Eesti-Display-Medium-Trial",
  },
});
