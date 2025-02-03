import { FC, memo } from "react";
import { ListItem, ListItemText, Paper, Typography } from "@mui/material";
import { IMessage } from "../types";
import { formatDateTime } from "../utils";

const Message: FC<IMessage> = ({ text, sender, read, timestamp }) => {
  const isMe = sender === "me";
  const formattedDate = timestamp && formatDateTime(timestamp);

  return (
    <ListItem sx={{ justifyContent: isMe ? "flex-end" : "flex-start" }}>
      <Paper
        elevation={3}
        sx={{
          p: 2,
          bgcolor: isMe ? "#f0f2f5" : "#4cae4f",
          borderRadius: isMe ? "10px 10px 0 10px" : "10px 10px 10px 0",
        }}>
        <ListItemText
          sx={{ display: "flex" }}
          primary={
            <>
              <Typography variant="body1">{text}</Typography>
              {timestamp && (
                <Typography variant="caption" sx={{ textAlign: "right" }}>
                  {formattedDate}
                </Typography>
              )}
              {isMe && (
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{ textAlign: "right", marginLeft: "5px" }}>
                  {read ? "Read" : "Sent"}
                </Typography>
              )}
            </>
          }
        />
      </Paper>
    </ListItem>
  );
};

export default memo(Message);
