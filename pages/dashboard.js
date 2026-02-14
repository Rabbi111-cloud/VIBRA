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
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const channels = ["general", "tech", "sports", "fashion", "lifestyle", "education"];
  const [activeChannel, setActiveChannel] = useState("general");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const messagesEndRef = useRef(null);

  // 🔒 Auth + Online presence
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

  // 🔥 Listen to messages
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "channels", activeChannel, "messages"),
      (snapshot) => {
        const msgs = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .sort(
            (a, b) =>
              (a.createdAt?.toMillis?.() || 0) -
              (b.createdAt?.toMillis?.() || 0)
          );

        setMessages(msgs);
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    );

    return unsubscribe;
  }, [activeChannel]);

  // 🚫 Profanity Filter
  const bannedWords = ["fuck", "shit", "bitch", "asshole", "damn"];

  const containsProfanity = (text) => {
    const lower = text.toLowerCase();
    return bannedWords.some((word) => lower.includes(word));
  };

  // 📤 Send Message
  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    if (containsProfanity(newMessage)) {
      alert("Please keep Vibra respectful. Profanity is not allowed.");
      return;
    }

    await addDoc(collection(db, "channels", activeChannel, "messages"), {
      text: newMessage,
      senderEmail: user.email,
      senderPhotoURL: user.photoURL || "",
      createdAt: serverTimestamp(),
      edited: false,
    });

    setNewMessage("");
  };

  // 🗑 Delete Message
  const deleteMessage = async (id) => {
    await deleteDoc(doc(db, "channels", activeChannel, "messages", id));
  };

  // ✏ Edit Message
  const startEdit = (msg) => {
    setEditingId(msg.id);
    setEditingText(msg.text);
  };

  const saveEdit = async () => {
    if (containsProfanity(editingText)) {
      alert("Please keep Vibra respectful.");
      return;
    }

    await updateDoc(
      doc(db, "channels", activeChannel, "messages", editingId),
      {
        text: editingText,
        edited: true,
      }
    );

    setEditingId(null);
    setEditingText("");
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

      {/* Sidebar */}
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

        <button
          onClick={handleLogout}
          className="mt-10 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">

        <div className="bg-white shadow p-4 font-semibold text-lg capitalize">
          #{activeChannel}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {messages.map((msg) => (
            <div key={msg.id} className="group">

              <div className="flex items-center gap-3">
                <strong>{msg.senderEmail}</strong>

                <span className="text-xs text-gray-400">
                  {msg.createdAt?.toDate?.().toLocaleTimeString()}
                </span>

                {msg.edited && (
                  <span className="text-xs text-gray-400">(edited)</span>
                )}

                {user.email === msg.senderEmail && (
                  <>
                    <button
                      onClick={() => startEdit(msg)}
                      className="text-xs text-blue-500 opacity-0 group-hover:opacity-100 ml-2"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteMessage(msg.id)}
                      className="text-xs text-red-500 opacity-0 group-hover:opacity-100 ml-2"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>

              {editingId === msg.id ? (
                <div className="flex gap-2 mt-1">
                  <input
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="border rounded px-2 py-1 flex-1"
                  />
                  <button
                    onClick={saveEdit}
                    className="bg-green-500 text-white px-3 rounded"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <p>{msg.text}</p>
              )}

            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
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
            className="bg-indigo-600 text-white px-5 py-2 rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
