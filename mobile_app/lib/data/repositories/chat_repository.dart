import 'package:socket_io_client/socket_io_client.dart' as io;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../../core/network/api_client.dart';
import '../models/chat_message.dart';
import '../../core/constants/app_constants.dart';
import '../../domain/repositories/chat_repository.dart';

class ChatRepositoryImpl implements ChatRepository {
  final ApiClient _apiClient;
  final _storage = const FlutterSecureStorage();
  io.Socket? _socket;

  ChatRepositoryImpl(this._apiClient);

  @override
  Future<List<ChatMessage>> getMessages(String roomId) async {
    // Placeholder for fetching history
    return [];
  }

  @override
  Future<ChatMessage> sendAiMessage(String message) async {
    final response = await _apiClient.dio.post('/ai/chat', data: {'message': message});
    
    return ChatMessage(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      message: response.data['response'],
      senderId: 'ai',
      senderName: 'Business AI',
      timestamp: DateTime.now(),
      role: ChatRole.assistant,
    );
  }

  @override
  void connectToRoom(String room, Function(ChatMessage) onMessageReceived) async {
    if (_socket?.connected == true) return;

    final token = await _storage.read(key: AppConstants.tokenKey);
    
    _socket = io.io(AppConstants.baseUrl, io.OptionBuilder()
      .setTransports(['websocket'])
      .setAuth({'token': token})
      .disableAutoConnect()
      .build());

    _socket?.connect();

    _socket?.onConnect((_) {
      _socket?.emit('join_room', room);
    });

    _socket?.on('receive_message', (data) {
      final message = ChatMessage.fromJson(data);
      onMessageReceived(message);
    });
  }

  @override
  void sendMessage(String room, String message, [String? senderId]) {
    _socket?.emit('send_message', {
      'room': room,
      'message': message,
    });
  }

  @override
  void disconnect() {
    _socket?.disconnect();
    _socket?.dispose();
    _socket = null;
  }
}
