import 'package:freezed_annotation/freezed_annotation.dart';

part 'chat_message.freezed.dart';
part 'chat_message.g.dart';

@freezed
class ChatMessage with _$ChatMessage {
  const factory ChatMessage({
    required String id,
    required String message,
    @JsonKey(name: 'userId') required String senderId,
    @JsonKey(name: 'username') required String senderName,
    required DateTime timestamp,
    @Default(ChatRole.user) ChatRole role,
    String? room,
  }) = _ChatMessage;

  factory ChatMessage.fromJson(Map<String, dynamic> json) => _$ChatMessageFromJson(json);
}

enum ChatRole {
  @JsonValue('user') user,
  @JsonValue('assistant') assistant,
  @JsonValue('system') system,
}
