import { FC, memo } from "react";
import { ListItem, ListItemText, Paper, Typography } from "@mui/material";
import { IMessage } from "../types";

const Message: FC<IMessage> = ({ text, sender, read }) => {
  const isMe = sender === "me";

  return (
    <ListItem sx={{ justifyContent: isMe ? "flex-end" : "flex-start" }}>
      <Paper
        elevation={3}
        sx={{
          p: 2,
          bgcolor: isMe ? "#dcf8c6" : "#ececec",
          borderRadius: isMe ? "10px 10px 0 10px" : "10px 10px 10px 0",
        }}>
        <ListItemText primary={text} />
        {isMe && (
          <Typography variant="caption" color="textSecondary">
            {read ? "Read" : "Sent"}
          </Typography>
        )}
      </Paper>
    </ListItem>
  );
};

export default memo(Message);
