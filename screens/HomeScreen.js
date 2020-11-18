import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Dimensions,
  ActivityIndicator,
  Modal,
  Button,
  StatusBar
} from "react-native";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { onChange } from "react-native-reanimated";
import * as Animatable from "react-native-animatable";

import { AuthContext } from "../components/context";

const origin = { latitude: 37.3318456, longitude: -122.0296002 };
const destination = { latitude: 37.771707, longitude: -122.4053769 };
const GOOGLE_MAPS_APIKEY = "AIzaSyCrDp6VzSRZ-hv5og2nxlzpjVt-fYHkrb4";
var conta = 0;
var puntos;

export default ({ navigation }) => {
  const [inicio, setIncio] = useState(false);
  const [dista, setDista] = useState(0);
  const [modal, setModal] = useState(false);
  const [lo, setLo] = useState({});
  const [loca, setLoca] = useState({});
  const [listo, Setlisto] = useState(false);
  const [rutaid, setRutaid] = useState(0);
  const [punto, setPunto] = useState({
    latitude: 0,
    longitude: 0,
  });

  const { userEmail } = React.useContext(AuthContext);

  const busvaLocation = async () => {
    const { status } = await Location.requestPermissionsAsync();
    if (status !== "granted") {
      return Alert.alert("No tenemos los permisos");
    } else {
      if (conta > 0) {
        const location = await Location.getCurrentPositionAsync({});
        setLoca(location);
        conta++;
      } else {
        const loca = await Location.getCurrentPositionAsync({});
        console.log(loca.coords.longitude);
        setLo(loca);
        setLoca(loca);
        conta++;
      }
    }
  };
  useEffect(() => {
    busvaLocation();
  });

  const handleLongPress = ({ nativeEvent }) => {
    setPunto({
      latitude: nativeEvent.coordinate.latitude,
      longitude: nativeEvent.coordinate.longitude,
    });
    setModal(!modal);
    console.log(punto.latitude);
    console.log(punto.longitude);
  };

  const iniciaRuta = () => {
    Setlisto(true);
    var ran = Math.floor(Math.random() * (1000000 - 0)) + 0;
    setRutaid(ran);
    console.log("////////////////////////////////Ruta/////////////////////////////");
    console.log("creaRuta_" + userEmail + "_" + rutaid + "_" + dista);
    fetch("https://api-movelo.herokuapp.com/proxy/llamado", {
      method: "POST",
      body: "creaRuta_" + userEmail + "_" + rutaid + "_" + dista,
    })
      .then((response) => response.text())
      .then((data) => {
        console.log(data);
        if (data == "false") {
          Setlisto(false);
          alert("ocurrio un error");
        } else {
          console.log(JSON.parse(data));
          setModal(!modal);
          setIncio(!inicio);
          Setlisto(false);
          pun();
        }
      });
  };

  const pun = () => {
     puntos = setInterval(() => {
      console.log("////////////////////////////////Punto/////////////////////////////");
      console.log(userEmail + "  " + rutaid);
      console.log("CreaPunto_"+userEmail+"_"+rutaid+"_"+ loca.coords.latitude+"_"+ loca.coords.longitude);
      fetch("https://api-movelo.herokuapp.com/proxy/llamado",{
        method: "POST",
        body: "CreaPunto_"+userEmail+"_"+rutaid+"_"+ loca.coords.latitude+"_"+ loca.coords.longitude
      }).then(response => response.text())
      .then(data =>{
        console.log(data);
      })
    }, 10000)
  }


  const cancelaRuta = () => {
    setModal(!modal);
    setPunto({
      latitude: 0,
      longitude: 0,
    });
  };
  if (listo == true) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      < StatusBar backgroundColor="#78E79F" barStyle="light-content"/>  
      <Modal animationType="slide" transparent={true} visible={modal}>
        <View style={styles.center}>
          <Animatable.View style={styles.content} animation="zoomIn">
            <Text
              style={{
                color: "#000",
                fontWeight: "bold",
                fontSize: 60,
                marginTop: 40,
              }}
            >
              Iniciar ruta
            </Text>
            <Text
              style={{
                fontSize: 18,
                marginTop: 10,
              }}
            >
              ¿Quieres iniciar una ruta hacia el lugar seleccionado?
            </Text>

            <Text
              style={{
                fontWeight: "bold",
                fontSize: 18,
                alignSelf: "flex-start",
                margin: 15,
              }}
            >
              Distancia aproximada: <Text>{dista} km</Text>{" "}
            </Text>
            <View
              style={{
                marginTop: 50,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  width: "40%",
                  height: 50,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 10,
                  backgroundColor: "#78E79F",
                }}
                onPress={() => {
                  iniciaRuta();
                }}
              >
                <Text style={styles.textSign}>Iniciar Ruta</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: "40%",
                  height: 50,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 10,
                  backgroundColor: "#FA0A01",
                  marginLeft: 10,
                }}
                onPress={() => {
                  cancelaRuta();
                }}
              >
                <Text style={styles.textSign}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </Animatable.View>
        </View>
      </Modal>

      <MapView style={styles.map} onLongPress={handleLongPress}>
        {loca.coords ? (
          <Marker
            coordinate={loca.coords}
            image={require("../assets/bici.png")}
            title="Acá se encuentra"
          />
        ) : null}
        {punto.latitude !== 0 ? (
          <Marker coordinate={punto} pinColor="#009387" />
        ) : null}
        {punto.latitude !== 0 ? (
          <MapViewDirections
            origin={{
              latitude: loca.coords.latitude,
              longitude: loca.coords.longitude,
            }}
            destination={{
              latitude: punto.latitude.toFixed(6),
              longitude: punto.longitude.toFixed(6),
            }}
            apikey={GOOGLE_MAPS_APIKEY}
            mode="WALKING"
            strokeWidth={3}
            strokeColor="#009387"
            language="es"
            onReady={(result) => {
              console.log(`Distance: ${result.distance} km`);
              console.log(`Duration: ${result.duration} min.`);
              setDista(parseFloat(result.distance));
            }}
          />
        ) : null}
      </MapView>
      {inicio ? (
        <View style={styles.Butoon}>
          <Text
            style={{
              position: "absolute",
            }}
          >
            holaaaaaaaaa
          </Text>
          <TouchableOpacity
            style={[styles.signIn, { backgroundColor: "#009387" }]}
            onPress={() => {
              setIncio(!inicio);
              setPunto({
                latitude: 0,
                longitude: 0,
              });
              clearInterval(puntos);
            }}
          >
            <Text style={[styles.textSign, { color: "#fff" }]}>
              Finalizar Ruta
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height - 80,
  },
  signIn: {
    width: "80%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    position: "absolute",
    bottom: 0,
  },
  Butoon: {
    justifyContent: "center",
    alignItems: "center",
  },
  textSign: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    backgroundColor: "#fff",
    width: 400,
    height: 300,
    alignItems: "center",
  },
});
