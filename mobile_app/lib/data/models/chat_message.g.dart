// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'chat_message.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$ChatMessageImpl _$$ChatMessageImplFromJson(Map<String, dynamic> json) =>
    _$ChatMessageImpl(
      id: json['id'] as String,
      message: json['message'] as String,
      senderId: json['userId'] as String,
      senderName: json['username'] as String,
      timestamp: DateTime.parse(json['timestamp'] as String),
      role:
          $enumDecodeNullable(_$ChatRoleEnumMap, json['role']) ?? ChatRole.user,
      room: json['room'] as String?,
    );

Map<String, dynamic> _$$ChatMessageImplToJson(_$ChatMessageImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'message': instance.message,
      'userId': instance.senderId,
      'username': instance.senderName,
      'timestamp': instance.timestamp.toIso8601String(),
      'role': _$ChatRoleEnumMap[instance.role]!,
      'room': instance.room,
    };

const _$ChatRoleEnumMap = {
  ChatRole.user: 'user',
  ChatRole.assistant: 'assistant',
  ChatRole.system: 'system',
};
