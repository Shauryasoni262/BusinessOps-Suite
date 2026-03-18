import 'package:freezed_annotation/freezed_annotation.dart';
import '../../domain/entities/user_entity.dart';

part 'user_model.freezed.dart';
part 'user_model.g.dart';

@freezed
class UserModel with _$UserModel {
  const UserModel._(); // Required for custom methods

  const factory UserModel({
    required String id,
    required String name,
    required String email,
    @JsonKey(name: 'avatar_url') String? avatarUrl,
  }) = _UserModel;

  factory UserModel.fromJson(Map<String, dynamic> json) => _$UserModelFromJson(json);

  // Helper to convert DTO to Domain Entity
  UserEntity toEntity() => UserEntity(
    id: id,
    name: name,
    email: email,
    avatarUrl: avatarUrl,
  );
}
