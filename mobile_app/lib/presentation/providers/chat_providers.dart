import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../domain/repositories/chat_repository.dart';
import '../../data/repositories/chat_repository.dart';
import '../../data/models/chat_message.dart';
import '../../core/providers/network_providers.dart';

part 'chat_providers.g.dart';

@riverpod
ChatRepository chatRepository(Ref ref) {
  final apiClient = ref.watch(apiClientProvider);
  return ChatRepositoryImpl(apiClient);
}

@riverpod
class ChatNotifier extends _$ChatNotifier {
  @override
  List<ChatMessage> build(String mode) {
    ref.onDispose(() {
      if (mode != 'ai') {
        ref.read(chatRepositoryProvider).disconnect();
      }
    });
    return [];
  }

  void connectToRoom(String room) {
    ref.read(chatRepositoryProvider).connectToRoom(room, (msg) {
      state = [...state, msg];
    });
  }

  Future<void> sendMessage(String message, {String? roomId}) async {
    if (mode == 'ai') {
      final userMessage = ChatMessage(
        id: 'u_${DateTime.now().millisecondsSinceEpoch}',
        message: message,
        senderId: 'user',
        senderName: 'You',
        timestamp: DateTime.now(),
        role: ChatRole.user,
      );
      
      state = [...state, userMessage];

      try {
        final aiMessage = await ref.read(chatRepositoryProvider).sendAiMessage(message);
        state = [...state, aiMessage];
      } catch (e) {
        _addSystemMessage('Could not connect to AI. Please try again.');
      }
    } else if (roomId != null) {
      ref.read(chatRepositoryProvider).sendMessage(roomId, message, 'user');
    }
  }

  void _addSystemMessage(String text) {
    state = [...state, ChatMessage(
      id: 's_${DateTime.now().millisecondsSinceEpoch}',
      message: text,
      senderId: 'system',
      senderName: 'System',
      timestamp: DateTime.now(),
      role: ChatRole.system,
    )];
  }

  void clearMessages() {
    state = [];
  }
}
