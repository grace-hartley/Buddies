import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  FlatList,
  SafeAreaView
} from "react-native";
import { db, storage } from "../../../firebaseConfig";
import {
  doc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  arrayUnion,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { StackScreens } from "../../../App.screens";
import UserContext from "../../../context/UserContext";

export const UserProfileScreen = () => {
  const { navigate } = useNavigation();
  const { loggedInUser } = useContext(UserContext);

  const handleDelete = async (item) => {
  try { 
    const q = query(
      collection(db, "users"),
      where("username", "==", loggedInUser.username)
    )
    const snapshot = await getDocs(q)
    snapshot.forEach(async (user) => {
      const userdata = user.data()
      if (user.username) {
        const plantRef = doc(db, "users", user.id)
        await updateDoc(plantRef, {
        plants: arrayRemove(item)
    })
    }
    console.log('removed')
  })
} catch(err) {
  console.log(err)
}
  alert("Plant has been deleted")
  }
  
  const renderUserPlants = ({item}) => {
    return (
      <View>
          {item.default_image?.original_url ? (
            <Image
              source={{ uri: item.default_image?.original_url }}
              style={{height: 100, width: 100}}
            />
          ) : (
            <Image
              source={require("../../../images/hotwater.webp")}
              style={{height: 100, width: 100}}
            />
          )}
        <Text>
          {item.common_name}
        </Text>
        <TouchableOpacity onPress={()=>handleDelete(item)}>
          <Text>
            remove
          </Text>
        </TouchableOpacity>
      </View>
    )
  } 

  return (
    <ImageBackground
      resizeMode="cover"
      source={require("../../../assets/splash.png")}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.text}>{loggedInUser.name} Profile Screen</Text>
          <SafeAreaView>
            <FlatList
            data={loggedInUser.plants}
            renderItem={renderUserPlants}
            keyExtractor={(item) => item.id.toString()}
            />
          </SafeAreaView>
          <View style={styles.buttonContainer}>
            {/* <TouchableOpacity
              onPress={() => navigate(StackScreens.Login)}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Back to Login</Text>
            </TouchableOpacity> */}
            {/* <TouchableOpacity
              onPress={() => navigate(StackScreens.HomeScreen)}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Go to Home page</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigate(StackScreens.PlantProfileScreen)}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Go to plant profile page</Text>
            </TouchableOpacity> */}
            {/* <TouchableOpacity
              onPress={() => navigate(StackScreens.IdentifiedScreen)}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Go to Identified page</Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontFamily: "GT-Eesti-Display-Bold-Trial",
    marginBottom: 20,
    color: "#000",
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    backgroundColor: "#1a6a45",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "GT-Eesti-Display-Bold-Trial",
  },
});
