import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Button,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import {
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  TouchableRipple,
  Switch,
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Icon2 from "react-native-vector-icons/Entypo";

import { AuthContext } from "../components/context";

export default ({ navigation }) => {
  const { signOut, userEmail } = React.useContext(AuthContext);
  const [user, setUser] = useState({});
  const [kilo, setkilo] = useState(0);
  const [rutas, setRutas] = useState(0);
  const [huella, setHuella] = useState(0);
  const [loading, setLoading] = useState(false);
  const [arbol , setArbol] = useState(0);

  const kilome = () => {
    var contador = 0;
    user.rutas.forEach((e) => {
      contador = contador + e.kmrecorrido;
      setkilo(contador);
      setHuella(kilo * 0.22922374);
    });
  };

  useEffect(() => {
    setLoading(true);
    fetch("https://api-movelo.herokuapp.com/proxy/llamado", {
      method: "POST",
      body: "BuscaUsuario_" + userEmail,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setUser(data);
        console.log(user);
        setRutas(data.rutas.length);
        var contador = 0;
        data.rutas.forEach((e) => {
          contador = contador + e.kmrecorrido;
          setkilo(contador);
          setHuella(contador * 0.22922374);
        });
        setArbol(3000 - contador);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  } else {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.userInfoSection}>
          <View
            style={{
              flexDirection: "row",
              marginTop: 15,
              alignItems: "center",
            }}
          >
            <Avatar.Image source={require("../assets/david.jpeg")} size={150} />
            <View style={{ marginLeft: 23, flexDirection: "column" }}>
              <Title style={styles.title}>{user.nombre}</Title>
              <Caption style={styles.caption}>{user.email}</Caption>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.section}>
              <Paragraph style={[styles.paragraph, styles.caption]}>
                {rutas}
              </Paragraph>
              <Caption style={styles.caption}>Rutas</Caption>
            </View>
            <View style={styles.section}>
              <Paragraph style={[styles.paragraph, styles.caption]}>
                {kilo}
              </Paragraph>
              <Caption style={styles.caption}>Kilometros</Caption>
            </View>
          </View>
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 50,
          }}
        >
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <Image
              source={require("../assets/hdc1.png")}
              style={{
                width: 130,
                height: 130,
              }}
            />
            <View
              style={{
                justifyContent: "center",
                alignItems: "flex-start",
                marginLeft: 20,
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 20 }}>
                Huella De Carbono Reducida
              </Text>
              <Text style={{ fontSize: 20 }}>{huella.toFixed(5)} kg CO2</Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              marginTop: 40,
            }}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "flex-start",
                marginRight: 20,
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 20 }}>
                Suma Km y Siembra Arboles
              </Text>
              <Text style={{ fontSize: 20, marginLeft: 60 }}>
                Te faltan {arbol} km
              </Text>
            </View>
            <Image
              source={require("../assets/arbol.png")}
              style={{
                width: 140,
                height: 140,
                alignSelf: "flex-end",
              }}
            />
          </View>
        </View>

        <View style={styles.bottomDrawerSection}>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#78E79F",
              width: "40%",
              height: 50,
              borderRadius: 10,
            }}
            onPress={() => {
              signOut();
            }}
          >
            <Icon
              name="exit-to-app"
              color="#575958"
              size={40}
              style={{ marginLeft: 20 }}
            />
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#575958",
                margin: 10,
                marginRight: 20,
              }}
            >
              Cerrar Sesión
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    paddingTop: 10,
    paddingRight: 150,
    fontSize: 40,
    marginTop: 30,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  paragraph: {
    fontWeight: "bold",
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginTop: 100,
    alignItems: "center",
    marginBottom: 15,
    borderTopColor: "#f4f4f4",
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
