import React, { useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ActivityIndicator,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";

import { AuthContext } from "./components/context";

import RootStackScreen from "./screens/RootStackScreen";

import HomeScreen from "./screens/HomeScreen";
import DetailScreen from "./screens/DetailScreen";

const Drawer = createDrawerNavigator();

const HomeStack = createStackNavigator();
const DetailStack = createStackNavigator();

const HomeStackScreen = ({ navigation }) => {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Overview",
        }}
      />
    </HomeStack.Navigator>
  );
};

const DetailStackScreen = ({ navigation }) => {
  return (
    <DetailStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <DetailStack.Screen name="Home" component={DetailScreen} options={{}} />
    </DetailStack.Navigator>
  );
};

export default function App() {
  const [isloading, setisloading] = useState(true);
  const [logged, SetLogged] = useState(false);
  const [email,setEmail] = useState("");
  const authContext = useMemo(() => ({
    signIn: (email, password) => {
      if (email == "" || password == "") {
        alert("Por favor llenar todos los capos");
      } else {
        setisloading(true);
        fetch("https://api-movelo.herokuapp.com/proxy/login", {
          method: "POST",
          body: email + "-" + password,
        })
          .then((response) => response.text())
          .then((data) => {
            console.log(data);
            if (data == "true") {
              setisloading(false);
              SetLogged(true);
              setEmail(email);
            } else {
              alert("usuario y/o contraseña incorrectos");
              setisloading(false);
            }
          }).catch(err => console.log(err));
      }
    },
    signOut: () => {
      setisloading(true);
      setTimeout(() => {
        setisloading(false);
      },2000 )
      SetLogged(false);
    },
    signUp: (name, email, password) => {
      if (name == "" || email == "" || password == "") {
        alert("Por favor llenar todos los capos");
      } else {
        var id = Math.floor(Math.random() * (1000000 - 0)) + 0;
        setisloading(true);
        fetch("https://api-movelo.herokuapp.com/proxy/registro", {
          method: "POST",
          body:
            "crearBiciusuario-" +
            name +
            "-" +
            id +
            "-" +
            email +
            "-" +
            password,
        })
          .then((response) => response.text())
          .then((data) => {
            console.log(data);
            setisloading(false);
            if(data == "false"){
              alert("Error al crear el usuario")
            }else{
              alert("Usuario creado correctamente");
            }
          })
          .catch((err) => console.log(err));
      }
    },
    userEmail: email
  }));

  useEffect(() => {
    setTimeout(() => {
      setisloading(false);
    }, 1000);
  }, []);

  if (isloading == true) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {!logged ? (
          <RootStackScreen />
        ) : (
          <Drawer.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerStyle: {
                backgroundColor: "#78E79F",
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontWeight: "bold",
              },
            }}
          >
            <Drawer.Screen
              name="Home"
              component={HomeStackScreen}
              options={{
                title: "Mapa",
              }}
            />
            <Drawer.Screen name="Details" component={DetailStackScreen} options={{
              title: "Perfil"
            }}/>
          </Drawer.Navigator>
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
