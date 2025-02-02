import { FC, useState } from "react";
import { TextField, Button, Container, Box, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import Chat from "./components/Chat";
import chatStore from "./stores/ChatStore";

const App: FC = observer(() => {
  const [idInstance, setIdInstance] = useState("");
  const [apiTokenInstance, setApiTokenInstance] = useState("");
  const [recipient, setRecipient] = useState("");

  const handleStartChat = () => {
    chatStore.setCredentials(idInstance, apiTokenInstance);
    chatStore.setRecipient(recipient);
  };

  const handleReset = () => chatStore.reset();

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, textAlign: "center" }}>
        {!chatStore.recipient ? (
          <Box>
            <Typography variant="h4" gutterBottom>
              WhatsApp Chat
            </Typography>
            <TextField
              fullWidth
              label="ID Instance"
              value={idInstance}
              onChange={(e) => setIdInstance(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="API Token Instance"
              value={apiTokenInstance}
              onChange={(e) => setApiTokenInstance(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Recipient Phone Number"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              margin="normal"
            />
            <Button
              variant="contained"
              onClick={handleStartChat}
              sx={{ mt: 2 }}>
              Start Chat
            </Button>
          </Box>
        ) : (
          <Chat onReset={handleReset} />
        )}
      </Box>
    </Container>
  );
});

export default App;
