import {
  FC,
  useState,
  useEffect,
  useCallback,
  ChangeEvent,
  KeyboardEvent,
} from "react";
import {
  TextField,
  Button,
  Box,
  List,
  Paper,
  Typography,
  Badge,
} from "@mui/material";
import { observer } from "mobx-react-lite";
import Message from "./Message";
import chatStore from "../stores/ChatStore";
import { ChatProps, IMessage } from "../types";

const Chat: FC<ChatProps> = observer(({ onReset }) => {
  const [newMessage, setNewMessage] = useState("");
  const [optimisticMessages, setOptimisticMessages] = useState<IMessage[]>([]);

  const messages = [...chatStore.messages, ...optimisticMessages];
  const unreadCount = chatStore.unreadCount;

  const handleSendMessage = useCallback(async () => {
    if (newMessage.trim()) {
      setOptimisticMessages((prev) => [
        ...prev,
        {
          text: newMessage,
          sender: "me",
          read: true,
          timestamp: new Date().toISOString(),
        },
      ]);

      try {
        await chatStore.sendMessage(newMessage);
      } catch (error) {
        console.error("Error sending message:", error);
        setOptimisticMessages((prev) =>
          prev.filter((msg) => msg.text !== newMessage)
        );
      }

      setNewMessage("");
    }
  }, [newMessage]);

  const handleKeyUpTextField = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      e.key === "Enter" && handleSendMessage();
    },
    [handleSendMessage]
  );

  const handleChangeTextField = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setNewMessage(e.target.value);
    },
    []
  );

  useEffect(() => {
    chatStore.markAsRead();

    const interval = setInterval(() => {
      chatStore.fetchMessages();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 2, height: "400px", overflowY: "auto" }}>
        <Typography variant="h6" gutterBottom>
          Chat with {chatStore.recipient}
          <Badge badgeContent={unreadCount} color="error" sx={{ ml: 2 }} />
        </Typography>
        <List>
          {messages.map((msg, index) => (
            <Message
              key={index}
              text={msg.text}
              sender={msg.sender}
              read={msg.read}
              timestamp={msg.timestamp}
            />
          ))}
        </List>
      </Paper>
      <Box sx={{ display: "flex", mt: 2 }}>
        <TextField
          fullWidth
          value={newMessage}
          onChange={handleChangeTextField}
          onKeyUp={handleKeyUpTextField}
          placeholder="Type a message"
        />
        <Button variant="contained" onClick={handleSendMessage} sx={{ ml: 2 }}>
          Send
        </Button>
      </Box>
      <Box sx={{ mt: 2, textAlign: "center" }}>
        <Button variant="outlined" onClick={onReset}>
          Reset Instance
        </Button>
      </Box>
    </Box>
  );
});

export default Chat;
