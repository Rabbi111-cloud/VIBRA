import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  deleteDoc,
  addDoc,
} from "firebase/firestore";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Chat / Rooms state
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [newRoom, setNewRoom] = useState("");
  const messagesEndRef = useRef(null);

  // 🔒 Protect route + add to online users
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/");
      } else {
        setUser(currentUser);

        // Add/update user in onlineUsers collection
        await setDoc(doc(db, "onlineUsers", currentUser.uid), {
          email: currentUser.email,
          photoURL: currentUser.photoURL || "",
          lastActive: new Date(),
        });

        setLoading(false);
      }
    });

    // Listen to online users in real-time
    const unsubscribeOnline = onSnapshot(
      collection(db, "onlineUsers"),
      (snapshot) => {
        setOnlineUsers(snapshot.docs.map((doc) => doc.data()));
      }
    );

    // Listen to rooms in real-time
    const unsubscribeRooms = onSnapshot(collection(db, "rooms"), (snapshot) => {
      setRooms(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubscribeAuth();
      unsubscribeOnline();
      unsubscribeRooms();
    };
  }, [router]);

  // Listen to messages for active room
  useEffect(() => {
    if (!activeRoom) return;
    const unsubscribeMessages = onSnapshot(
      collection(db, "rooms", activeRoom, "messages"),
      (snapshot) => {
        const msgs = snapshot.docs
          .map((doc) => doc.data())
          .sort((a, b) => a.createdAt.seconds - b.createdAt.seconds);
        setMessages(msgs);
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    );

    return unsubscribeMessages;
  }, [activeRoom]);

  // Create a new room
  const createRoom = async () => {
    if (!newRoom) return;
    await setDoc(doc(db, "rooms", newRoom), { name: newRoom, createdAt: new Date() });
    setNewRoom("");
  };

  // Send a message
  const sendMessage = async () => {
    if (!newMessage || !activeRoom || !user) return;
    const msgData = {
      text: newMessage,
      senderEmail: user.email,
      senderPhotoURL: user.photoURL || "",
      createdAt: new Date(),
    };
    await addDoc(collection(db, "rooms", activeRoom, "messages"), msgData);
    setNewMessage("");
  };

  // Logout
  const handleLogout = async () => {
    if (!user) return;
    await deleteDoc(doc(db, "onlineUsers", user.uid));
    await signOut(auth);
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-indigo-600 text-white">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-indigo-600">Vibra Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* User Profile */}
        <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-indigo-500 flex items-center justify-center text-white text-2xl font-bold">
              {user.email?.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-medium">{user.email}</p>
            <p className="text-sm text-gray-500">Signed in with Google</p>
          </div>
        </div>

        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Rooms List */}
          <div className="w-full lg:w-1/4 bg-white p-4 rounded-xl shadow h-[500px] overflow-y-auto">
            <h3 className="font-semibold mb-4">Rooms</h3>
            {rooms.map((room) => (
              <div
                key={room.id}
                onClick={() => setActiveRoom(room.id)}
                className={`p-2 mb-2 rounded cursor-pointer ${
                  activeRoom === room.id ? "bg-indigo-100 font-bold" : ""
                }`}
              >
                {room.name}
              </div>
            ))}

            <input
              type="text"
              placeholder="New room..."
              value={newRoom}
              onChange={(e) => setNewRoom(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createRoom()}
              className="mt-2 p-2 w-full border rounded"
            />
          </div>

          {/* Chat Box */}
          <div className="flex-1 bg-white p-4 rounded-xl shadow h-[500px] flex flex-col">
            <div className="flex-1 overflow-y-auto mb-2">
              {messages.map((msg, idx) => (
                <div key={idx} className="flex items-center gap-2 mb-2">
                  {msg.senderPhotoURL ? (
                    <img
                      src={msg.senderPhotoURL}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-bold">
                      {msg.senderEmail.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <span className="font-semibold text-sm">{msg.senderEmail}</span>
                    <p>{msg.text}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="p-2 border rounded"
            />
          </div>

        </div>

        {/* Online Users */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">
            Online Users ({onlineUsers.length})
          </h2>

          <div className="space-y-3">
            {onlineUsers.map((onlineUser, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                {onlineUser.photoURL ? (
                  <img
                    src={onlineUser.photoURL}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                    {onlineUser.email?.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="font-medium">{onlineUser.email}</span>
                <span className="ml-auto text-green-500 text-sm">● Online</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
