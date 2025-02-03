export interface ICredentials {
  idInstance: string;
  apiTokenInstance: string;
}

export interface IMessage {
  text: string;
  sender: "me" | "other";
  read?: boolean;
  timestamp?: string;
}

export interface ChatProps {
  onReset: () => void;
}

export type methodURL = "get" | "post" | "delete" | "chatHistory";
