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
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const channels = [
    "general",
    "tech",
    "sports",
    "fashion",
    "lifestyle",
    "education",
  ];

  const [activeChannel, setActiveChannel] = useState("general");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const messagesEndRef = useRef(null);

  // 🔒 Protect route + online presence
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/");
      } else {
        setUser(currentUser);

        await setDoc(doc(db, "onlineUsers", currentUser.uid), {
          email: currentUser.email,
          photoURL: currentUser.photoURL || "",
          lastActive: new Date(),
        });

        setLoading(false);
      }
    });

    const unsubscribeOnline = onSnapshot(
      collection(db, "onlineUsers"),
      (snapshot) => {
        setOnlineUsers(snapshot.docs.map((doc) => doc.data()));
      }
    );

    return () => {
      unsubscribeAuth();
      unsubscribeOnline();
    };
  }, [router]);

  // 🔥 Listen to channel messages
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "channels", activeChannel, "messages"),
      (snapshot) => {
        const msgs = snapshot.docs
          .map((doc) => doc.data())
          .sort((a, b) => a.createdAt?.seconds - b.createdAt?.seconds || 0);
        setMessages(msgs);
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    );

    return unsubscribe;
  }, [activeChannel]);

  // 🔥 Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    await addDoc(collection(db, "channels", activeChannel, "messages"), {
      text: newMessage,
      senderEmail: user.email,
      senderPhotoURL: user.photoURL || "",
      createdAt: new Date(),
    });

    setNewMessage("");
  };

  const handleLogout = async () => {
    await deleteDoc(doc(db, "onlineUsers", user.uid));
    await signOut(auth);
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-indigo-600 text-white">
        Loading Vibra...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* Sidebar - Channels */}
      <div className="w-64 bg-white shadow p-4">
        <h2 className="text-xl font-bold mb-6 text-indigo-600">
          Vibra Channels
        </h2>

        {channels.map((channel) => (
          <div
            key={channel}
            onClick={() => setActiveChannel(channel)}
            className={`p-3 mb-2 rounded cursor-pointer capitalize ${
              activeChannel === channel
                ? "bg-indigo-100 font-semibold"
                : "hover:bg-gray-100"
            }`}
          >
            #{channel}
          </div>
        ))}

        <div className="mt-10">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">

        {/* Chat Header */}
        <div className="bg-white shadow p-4 font-semibold text-lg capitalize">
          #{activeChannel}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, index) => (
            <div key={index} className="flex items-start gap-3">
              {msg.senderPhotoURL ? (
                <img
                  src={msg.senderPhotoURL}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                  {msg.senderEmail?.charAt(0).toUpperCase()}
                </div>
              )}

              <div>
                <span className="font-semibold text-sm">
                  {msg.senderEmail}
                </span>
                <p>{msg.text}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 bg-white border-t flex gap-3">
          <input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 border rounded px-3 py-2"
          />
          <button
            onClick={sendMessage}
            className="bg-indigo-600 text-white px-5 py-2 rounded hover:bg-indigo-700 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
