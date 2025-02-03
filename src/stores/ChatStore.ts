import axios from "axios";
import { makeAutoObservable } from "mobx";
import { IMessage, methodURL } from "../types";

class ChatStore {
  messages: IMessage[] = [];
  credentials = { idInstance: "", apiTokenInstance: "" };
  recipient = "";

  constructor() {
    makeAutoObservable(this);
  }

  setCredentials(idInstance: string, apiTokenInstance: string) {
    this.credentials = { idInstance, apiTokenInstance };
  }

  setRecipient(recipient: string) {
    this.recipient = recipient;
  }

  addMessage(message: IMessage) {
    this.messages.push({
      ...message,
      timestamp: new Date().toISOString(),
    });
  }

  getURL(method: methodURL) {
    const { idInstance, apiTokenInstance } = this.credentials;

    const methods = {
      get: `receiveNotification`,
      post: `sendMessage`,
      delete: `deleteNotification`,
      chatHistory: `getChatHistory`,
    };

    return `https://1103.api.green-api.com/waInstance${idInstance}/${methods[method]}/${apiTokenInstance}`;
  }

  async fetchMessages() {
    const fetchUrl = this.getURL("get");
    const deleteUrl = this.getURL("delete");

    try {
      const response = await axios.get(fetchUrl);
      const notification = response.data;
      if (notification.body.typeWebhook === "incomingMessageReceived") {
        const text =
          notification.body.messageData.textMessageData?.textMessage ||
          notification.body.messageData.extendedTextMessageData.text;
        const timestamp = notification.body.timestamp;
        this.addMessage({ text, sender: "other", read: false, timestamp });
        await axios.delete(`${deleteUrl}/${notification.receiptId}`);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }

  async sendMessage(text: string) {
    const sendUrl = this.getURL("post");
    const data = {
      chatId: `${this.recipient}@c.us`,
      message: text,
    };

    try {
      await axios.post(sendUrl, data);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  get unreadCount() {
    return this.messages.filter((msg) => !msg.read && msg.sender === "other")
      .length;
  }

  markAsRead() {
    this.messages.forEach((msg) => msg.sender === "other" && (msg.read = true));
  }

  reset() {
    this.messages = [];
    this.credentials = { idInstance: "", apiTokenInstance: "" };
    this.recipient = "";
  }
}

const chatStore = new ChatStore();
export default chatStore;
