import { useState } from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import { StyleSheet } from "react-native";
import OrderItem from "./OrderItem";
import firebase from "../../firebase";
import LottieView from "lottie-react-native";
export default ViewCart = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { items, restaurantName } = useSelector(
    (state) => state.cartReducer.selectedItems
  );

  const total = items
    .map((item) => Number(item.price.replace("$", "")))
    .reduce((prev, curr) => prev + curr, 0);

  const addOrderToFirebase = () => {
    setLoading(true);
    const db = firebase.firestore();
    db.collection("orders")
      .add({
        items: items,
        restaurantName: restaurantName,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        setTimeout(() => {
          setLoading(false);
          navigation.navigate("OrderCompleted");
        }, 2500);
      });
    setModalVisible(false);
  };

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0,0,0,0.7)",
    },

    modalCheckoutContainer: {
      backgroundColor: "white",
      padding: 16,
      height: 500,
      borderWidth: 1,
    },

    restaurantName: {
      textAlign: "center",
      fontWeight: "600",
      fontSize: 18,
      marginBottom: 10,
    },

    subtotalContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 15,
    },

    subtotalText: {
      textAlign: "left",
      fontWeight: "600",
      fontSize: 15,
      marginBottom: 10,
    },
  });
  const checkoutModalContent = () => (
    <>
      <View style={styles.modalContainer}>
        <View style={styles.modalCheckoutContainer}>
          <Text style={styles.restaurantName}>{restaurantName}</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {items.map((item, index) => (
              <OrderItem key={index} item={item} />
            ))}
          </ScrollView>
          <View style={styles.subtotalContainer}>
            <Text style={styles.subtotalText}>Subtotal</Text>
            <Text>${total}</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <TouchableOpacity
              style={{
                marginTop: 20,
                backgroundColor: "black",
                alignItems: "center",
                padding: 13,
                borderRadius: 30,
                width: 300,
                position: "relative",
              }}
              onPress={() => {
                addOrderToFirebase();
              }}
            >
              <Text style={{ color: "white", fontSize: 20 }}>Checkout</Text>
              <Text
                style={{
                  position: "absolute",
                  right: 20,
                  color: "white",
                  fontSize: 15,
                  top: 17,
                }}
              >
                {total ? `$${total}` : ""}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );

  return (
    <>
      <Modal
        animationType="slide"
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        {checkoutModalContent()}
      </Modal>

      {total ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            position: "absolute",
            bottom: 350,
            zIndex: 5,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <TouchableOpacity
              style={{
                marginTop: 20,
                backgroundColor: "black",
                flexDirection: "row",
                justifyContent: "flex-end",
                padding: 15,
                borderRadius: 30,
                width: 300,
                position: "relative",
              }}
              onPress={() => {
                setModalVisible(true);
                setLoading(false);
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 20,
                  marginRight: 30,
                  alignSelf: "center",
                }}
              >
                View Cart
              </Text>
              <Text
                style={{
                  color: "white",
                  fontSize: 16,
                  fontWeight: "600",
                  right: 10,
                  alignSelf: "center",
                }}
              >
                ${total.toFixed(2)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <></>
      )}
      {loading ? (
        <>
          <View
            style={{
              flex: 1,
              position: "absolute",
              backgroundColor: "black",
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
              opacity: 0.6,
              width: "100%",
              height: "100%",
            }}
          >
            <LottieView
              style={{ height: 200, bottom: 50 }}
              source={require("../../assets/animations/scanner.json")}
              autoPlay
              speed={3}
            />
          </View>
        </>
      ) : (
        <></>
      )}
    </>
  );
};
