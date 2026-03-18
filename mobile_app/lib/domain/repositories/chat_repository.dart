import '../../data/models/chat_message.dart';

abstract class ChatRepository {
  Future<List<ChatMessage>> getMessages(String roomId);
  void connectToRoom(String roomId, Function(ChatMessage) onMessageReceived);
  void sendMessage(String roomId, String message, String senderId);
  void disconnect();
  
  // AI Chat
  Future<ChatMessage> sendAiMessage(String message);
}
