import React, { useState, useEffect, useLayoutEffect } from "react";
import { GiftedChat, Message, InputToolbar } from "react-native-gifted-chat";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Touchable,
} from "react-native";
import { auth, db } from "../../firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  setDoc,
  getDocs,
} from "firebase/firestore";
import colors from "../../styles/colors";
import ChatAdCard from "../components/ChatAdCard";
import AgreementProposalCard from "../components/AgreementProposalCard";
import SubmittedAgreementProposalCard from "../components/SubmittedAgreementProposalCard";
import WorkSessionCard from "../components/WorkSessionCard";

const ChatScreen = ({ route, navigation }) => {
  const [messages, setMessages] = useState([]);
  const [adData, setAdData] = useState(null);

  const { chatId, adTitle } = route.params;
  const [otherUserId, setOtherUserId] = useState(null);
  const [timer, setTimer] = useState({
    running: false,
    startTime: null,
    elapsed: 0,
  });
  const [isUserAdCreator, setIsUserAdCreator] = useState(false);
  const [agreementMessageId, setAgreementMessageId] = useState(null);
  const [proposalData, setProposalData] = useState({});

  useEffect(() => {
    const fetchOtherParticipantInfo = async () => {
      const chatDocRef = doc(db, "chats", chatId);
      const chatDocSnap = await getDoc(chatDocRef);

      if (chatDocSnap.exists()) {
        const participants = chatDocSnap.data().participants;
        const otherUserId = participants.find(
          (uid) => uid !== auth.currentUser.uid
        );

        const userDocRef = doc(db, "users", otherUserId);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const otherUserName = `${userDocSnap.data().firstName} ${
            userDocSnap.data().lastName
          }`;
          navigation.setOptions({
            headerTitle: otherUserName,
          });
        }
      }
    };

    fetchOtherParticipantInfo();
  }, [chatId, navigation]);

  useEffect(() => {
    const fetchOtherParticipantId = async () => {
      const chatDocRef = doc(db, "chats", chatId);
      const chatDocSnap = await getDoc(chatDocRef);

      if (chatDocSnap.exists()) {
        const participants = chatDocSnap.data().participants;
        const otherUserId = participants.find(
          (uid) => uid !== auth.currentUser.uid
        );
        setOtherUserId(otherUserId);
      }
    };

    fetchOtherParticipantId();
  }, [chatId]);

  useEffect(() => {
    const fetchAdData = async () => {
      try {
        const chatDocRef = doc(db, "chats", chatId);
        const chatDocSnap = await getDoc(chatDocRef);
        if (chatDocSnap.exists() && chatDocSnap.data().adId) {
          const adId = chatDocSnap.data().adId;
          const adDocRef = doc(db, "annonser", adId);
          const adDocSnap = await getDoc(adDocRef);
          if (adDocSnap.exists()) {
            const ad = adDocSnap.data();
            setAdData(ad);
            setIsUserAdCreator(ad.uid === auth.currentUser.uid); // Sjekk om brukeren er annonsens oppretter
          }
        }
      } catch (error) {
        console.error("Feil ved henting av annonsedata:", error);
      }
    };
    fetchAdData();
  }, [chatId]);

  useEffect(() => {
    if (!chatId) return;

    const fetchUserProfileImage = async (userId) => {
      const userDocRef = doc(db, "users", userId);
      const userDocSnap = await getDoc(userDocRef);
      return userDocSnap.exists() ? userDocSnap.data().profileImageUrl : null;
    };

    const messagesRef = collection(db, `chats/${chatId}/messages`);
    const q = query(messagesRef, orderBy("sentAt", "desc"));

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const fetchedMessages = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const messageData = doc.data(); // Flytt denne over imageUrl

          const imageUrl = await fetchUserProfileImage(messageData.sentBy);

          return {
            _id: doc.id,
            text: messageData.text,
            createdAt: new Date(messageData.sentAt.seconds * 1000),
            user: {
              _id: messageData.sentBy,
              avatar: imageUrl,
              name: messageData.userName,
            },
            customType: messageData.customType,
            status: messageData.status,
            proposalData: messageData.offerDetails, // Legg merke til her
          };
        })
      );
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, [chatId]);

  const onSend = async (newMessages = []) => {
    const senderId = auth.currentUser.uid;
    const senderDocRef = doc(db, "users", senderId);
    const senderDocSnap = await getDoc(senderDocRef);

    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );

    if (senderDocSnap.exists()) {
      const senderData = senderDocSnap.data();
      const senderName = `${senderData.firstName} ${senderData.lastName}`;
      newMessages.forEach(async (message) => {
        await addDoc(collection(db, `chats/${chatId}/messages`), {
          text: message.text,
          sentAt: message.createdAt,
          sentBy: message.user._id,
          userName: senderName,
          customType: message.customType || "normal",
        });
      });
    }
  };

  const sendAgreementCard = () => {
    // Opprett en ny melding for 'pending' avtalekort
    const newMessage = {
      _id: Math.random().toString(36).substring(7),
      text: "", // ingen tekst, siden dette vil være et spesialkort
      createdAt: new Date(),
      user: {
        _id: auth.currentUser.uid,
        // andre nødvendige brukeropplysninger
      },
      customType: "agreementProposal",
      status: "pending",
    };

    // Legg til den nye meldingen i eksisterende meldinger
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, [newMessage])
    );

    setProposalData({});
  };

  const sendProposal = async (selectedPriceType, price) => {
    if (!selectedPriceType || !price) {
      console.error("Missing required fields.");
      return;
    }

    try {
      // Legg til meldingen som representerer dette tilbudet i chat
      const messageRef = await addDoc(
        collection(db, `chats/${chatId}/messages`),
        {
          text: `Tilbud: ${price} (${selectedPriceType})`,
          sentAt: new Date(),
          sentBy: auth.currentUser.uid,
          customType: "agreementProposal", // Markere meldingen som et tilbud
          offerDetails: {
            selectedPriceType,
            price,
          },
          status: "submitted",
        }
      );

      // Antar at tilbudet ble sendt vellykket hvis ingen feil ble kastet
      updateAgreementStatusInState(messageRef.id, "submitted");
    } catch (error) {
      console.error("Error submitting offer:", error);
    }
  };

  const updateAgreementStatusInState = (messageId, newStatus) => {
    setMessages((prevMessages) => {
      return prevMessages.map((message) => {
        if (
          message._id === messageId &&
          message.customType === "agreementProposal"
        ) {
          return { ...message, status: newStatus };
        }
        return message;
      });
    });
  };

  const doesAgreementRequestExist = () => {
    return messages.some(
      (message) => message.customType === "agreementProposal"
    );
  };

  const sendStartWorkRequest = () => {
    const existingSession = messages.find(
      (message) => message.customType === "workSession"
    );
    if (!existingSession) {
      const sessionMessage = {
        _id: Math.random().toString(),
        text: "",
        createdAt: new Date(),
        user: {
          _id: auth.currentUser.uid,
        },
        customType: "workSession",
        timerStatus: "stopped",
      };
      onSend([sessionMessage]);
    }
  };

  const startTimer = async () => {
    const timerRef = doc(db, "chats", chatId, "timer", "current");
    const now = new Date();
    await setDoc(
      timerRef,
      {
        running: true,
        startTime: now,
      },
      { merge: true }
    );
    updateWorkSessionMessageInState("running");
  };

  const pauseTimer = async () => {
    const timerRef = doc(db, "chats", chatId, "timer", "current");
    const docSnap = await getDoc(timerRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.startTime) {
        const now = new Date();
        const newElapsed =
          Math.floor(
            (now.getTime() - data.startTime.toDate().getTime()) / 1000
          ) + (data.elapsed || 0);
        await setDoc(
          timerRef,
          {
            running: false,
            elapsed: newElapsed,
          },
          { merge: true }
        );
      }
    }
    updateWorkSessionMessageInState("paused");
  };

  const stopTimer = async () => {
    const timerRef = doc(db, "chats", chatId, "timer", "current");
    await setDoc(
      timerRef,
      {
        running: false,
        startTime: null,
        elapsed: 0,
      },
      { merge: true }
    );
    updateWorkSessionMessageInState("stopped");
  };

  const doesWorkSessionExist = () => {
    return messages.some((message) => message.customType === "workSession");
  };

  const updateTimer = async () => {
    const timerRef = doc(db, "chats", chatId, "timer", "current");
    const docSnap = await getDoc(timerRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.running && data.startTime) {
        const now = new Date();
        const newElapsed =
          Math.floor(
            (now.getTime() - data.startTime.toDate().getTime()) / 1000
          ) + (data.elapsed || 0);
        setTimer({ ...timer, elapsed: newElapsed });
      }
    }
  };

  const updateWorkSessionMessageInState = (newStatus) => {
    setMessages((prevMessages) => {
      return prevMessages.map((message) => {
        if (message.customType === "workSession") {
          return { ...message, timerStatus: newStatus };
        }
        return message;
      });
    });
  };

  useEffect(() => {
    let interval;
    if (timer.running) {
      interval = setInterval(updateTimer, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timer.running]);

  useEffect(() => {
    const timerRef = doc(db, "chats", chatId, "timer", "current");

    const unsubscribe = onSnapshot(timerRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setTimer({
          running: data.running,
          startTime: data.startTime?.toDate(),
          elapsed: data.elapsed || 0,
        });
      }
    });

    return unsubscribe;
  }, [chatId]);

  const CustomButtons = () => (
    <View>
      {!isUserAdCreator && !doesAgreementRequestExist() && (
        <TouchableOpacity onPress={sendAgreementCard} style={styles.requestBtn}>
          <Text>Inngå Avtale</Text>
        </TouchableOpacity>
      )}

      {!isUserAdCreator && !doesWorkSessionExist() && (
        <TouchableOpacity
          onPress={sendStartWorkRequest}
          style={styles.requestBtn}
        >
          <Text>Start Arbeid</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderMessage = (props) => {
    const { currentMessage } = props;

    /* Agreement request */
    if (currentMessage.customType === "agreementProposal") {
      return (
        <AgreementProposalCard
          {...props}
          status={currentMessage.status} // Send statusen for denne meldinge
          proposalData={currentMessage.proposalData || {}}
          sendProposal={sendProposal}
          isUserAdCreator={isUserAdCreator}
        />
      );
    }

    /* Work request */
    if (currentMessage.customType === "workSession") {
      return (
        <WorkSessionCard
          currentMessage={currentMessage}
          onStart={() => startTimer()}
          onPause={() => pauseTimer()}
          onStop={() => stopTimer()}
          elapsed={timer.elapsed}
          isRunning={timer.running}
          isUserAdCreator={isUserAdCreator}
        />
      );
    } else {
      // This is the default case for messages that don't meet any custom criteria
      return <Message {...props} />;
    }
  };

  useEffect(() => {
    const chatDocRef = doc(db, "chats", chatId);

    // Lytter til endringer i chat-dokumentet
    const unsubscribe = onSnapshot(chatDocRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
      }
    });

    return () => unsubscribe(); // Rydd opp lytteren når komponenten unmounts
  }, [chatId]);

  return (
    <View style={{ backgroundColor: "#F7F7F9", flex: 1, paddingBottom: 20 }}>
      <ChatAdCard adData={adData} />
      <CustomButtons />
      <GiftedChat
        timeFormat="HH:mm"
        dateFormat="D. MMMM"
        locale="nb-NO"
        messages={messages}
        onSend={(messages) => onSend(messages)}
        sendProposal={sendProposal}
        proposalData={proposalData}
        user={{ _id: auth.currentUser.uid }}
        renderMessage={renderMessage}
        placeholder={"Skriv her..."}
        renderInputToolbar={(props) => (
          <InputToolbar
            {...props}
            containerStyle={{ marginBottom: 0 /* paddingBottom: 32  */ }}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  requestBox: {},
  requestBoxSender: {
    backgroundColor: colors.primary,
    paddingVertical: 20,
    paddingHorizontal: 12,
    marginHorizontal: 32,
    marginVertical: 12,
  },
  requestBoxReceiver: {
    backgroundColor: colors.primary,
    paddingVertical: 20,
    paddingHorizontal: 12,
    marginHorizontal: 32,
    marginBottom: 12,
  },
  confirmedRequestBox: {
    backgroundColor: colors.lightGreen,
    padding: 10,
    marginHorizontal: 32,
    marginBottom: 12,
    borderRadius: 10,
  },
  declinedRequestBox: {
    backgroundColor: colors.lightRed,
    padding: 10,
    marginHorizontal: 32,
    marginBottom: 12,
    borderRadius: 10,
  },
  requestBtn: {
    backgroundColor: colors.primary,
    marginHorizontal: 32,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 5,
  },
  offerConfirmationCard: {
    padding: 15,
    margin: 5,
    backgroundColor: "#e0e0e0", // Eksempel bakgrunnsfarge
    borderRadius: 10,
  },
});

export default ChatScreen;
