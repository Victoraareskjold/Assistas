import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { auth, db } from "../../firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";

const ChatChannels = () => {
  const [conversations, setConversations] = useState([]);

  const getUserChats = async (userId) => {
    const chatsRef = collection(db, "chats");
    const q = query(chatsRef, where("participants", "array-contains", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };

  const getLastMessage = async (chatId) => {
    const messagesRef = collection(db, `chats/${chatId}/messages`);
    const q = query(messagesRef, orderBy("sentAt", "desc"), limit(1));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length > 0) {
      return querySnapshot.docs[0].data();
    }
    return { text: "", sentAt: { seconds: 0 } }; // Returnerer en tom melding om ingen finnes
  };

  const getAdInfo = async (adId) => {
    const adRef = doc(db, "annonser", adId);
    const adDoc = await getDoc(adRef);
    return adDoc.data();
  };

  useEffect(() => {
    const fetchConversations = async () => {
      const userChats = await getUserChats(auth.currentUser.uid);

      const chatsData = await Promise.all(
        userChats.map(async (chat) => {
          const lastMessage = await getLastMessage(chat.id);
          const adInfo = await getAdInfo(chat.adId);

          return {
            chatId: chat.id,
            lastMessage: lastMessage.text,
            timestamp: new Date(
              lastMessage.sentAt.seconds * 1000
            ).toLocaleString(),
            adTitle: adInfo.overskrift,
          };
        })
      );

      setConversations(chatsData);
    };

    fetchConversations();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        /* Navigasjonslogikk her */
      }}
    >
      <Text>{item.adTitle}</Text>
      <Text>{item.lastMessage}</Text>
      <Text>{item.timestamp}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ padding: 60 }}>
      <FlatList
        data={conversations}
        renderItem={renderItem}
        keyExtractor={(item) => item.chatId}
      />
    </View>
  );
};

export default ChatChannels;
