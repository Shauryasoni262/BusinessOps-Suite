// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'resume_analyzer_providers.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

/// @nodoc
mixin _$ResumeAnalyzerState {
  bool get isUploading => throw _privateConstructorUsedError;
  ResumeUploadData? get uploadData => throw _privateConstructorUsedError;
  List<ChatMessage> get messages => throw _privateConstructorUsedError;
  bool get isTyping => throw _privateConstructorUsedError;
  String? get error => throw _privateConstructorUsedError;

  /// Create a copy of ResumeAnalyzerState
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ResumeAnalyzerStateCopyWith<ResumeAnalyzerState> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ResumeAnalyzerStateCopyWith<$Res> {
  factory $ResumeAnalyzerStateCopyWith(
          ResumeAnalyzerState value, $Res Function(ResumeAnalyzerState) then) =
      _$ResumeAnalyzerStateCopyWithImpl<$Res, ResumeAnalyzerState>;
  @useResult
  $Res call(
      {bool isUploading,
      ResumeUploadData? uploadData,
      List<ChatMessage> messages,
      bool isTyping,
      String? error});

  $ResumeUploadDataCopyWith<$Res>? get uploadData;
}

/// @nodoc
class _$ResumeAnalyzerStateCopyWithImpl<$Res, $Val extends ResumeAnalyzerState>
    implements $ResumeAnalyzerStateCopyWith<$Res> {
  _$ResumeAnalyzerStateCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of ResumeAnalyzerState
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? isUploading = null,
    Object? uploadData = freezed,
    Object? messages = null,
    Object? isTyping = null,
    Object? error = freezed,
  }) {
    return _then(_value.copyWith(
      isUploading: null == isUploading
          ? _value.isUploading
          : isUploading // ignore: cast_nullable_to_non_nullable
              as bool,
      uploadData: freezed == uploadData
          ? _value.uploadData
          : uploadData // ignore: cast_nullable_to_non_nullable
              as ResumeUploadData?,
      messages: null == messages
          ? _value.messages
          : messages // ignore: cast_nullable_to_non_nullable
              as List<ChatMessage>,
      isTyping: null == isTyping
          ? _value.isTyping
          : isTyping // ignore: cast_nullable_to_non_nullable
              as bool,
      error: freezed == error
          ? _value.error
          : error // ignore: cast_nullable_to_non_nullable
              as String?,
    ) as $Val);
  }

  /// Create a copy of ResumeAnalyzerState
  /// with the given fields replaced by the non-null parameter values.
  @override
  @pragma('vm:prefer-inline')
  $ResumeUploadDataCopyWith<$Res>? get uploadData {
    if (_value.uploadData == null) {
      return null;
    }

    return $ResumeUploadDataCopyWith<$Res>(_value.uploadData!, (value) {
      return _then(_value.copyWith(uploadData: value) as $Val);
    });
  }
}

/// @nodoc
abstract class _$$ResumeAnalyzerStateImplCopyWith<$Res>
    implements $ResumeAnalyzerStateCopyWith<$Res> {
  factory _$$ResumeAnalyzerStateImplCopyWith(_$ResumeAnalyzerStateImpl value,
          $Res Function(_$ResumeAnalyzerStateImpl) then) =
      __$$ResumeAnalyzerStateImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {bool isUploading,
      ResumeUploadData? uploadData,
      List<ChatMessage> messages,
      bool isTyping,
      String? error});

  @override
  $ResumeUploadDataCopyWith<$Res>? get uploadData;
}

/// @nodoc
class __$$ResumeAnalyzerStateImplCopyWithImpl<$Res>
    extends _$ResumeAnalyzerStateCopyWithImpl<$Res, _$ResumeAnalyzerStateImpl>
    implements _$$ResumeAnalyzerStateImplCopyWith<$Res> {
  __$$ResumeAnalyzerStateImplCopyWithImpl(_$ResumeAnalyzerStateImpl _value,
      $Res Function(_$ResumeAnalyzerStateImpl) _then)
      : super(_value, _then);

  /// Create a copy of ResumeAnalyzerState
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? isUploading = null,
    Object? uploadData = freezed,
    Object? messages = null,
    Object? isTyping = null,
    Object? error = freezed,
  }) {
    return _then(_$ResumeAnalyzerStateImpl(
      isUploading: null == isUploading
          ? _value.isUploading
          : isUploading // ignore: cast_nullable_to_non_nullable
              as bool,
      uploadData: freezed == uploadData
          ? _value.uploadData
          : uploadData // ignore: cast_nullable_to_non_nullable
              as ResumeUploadData?,
      messages: null == messages
          ? _value._messages
          : messages // ignore: cast_nullable_to_non_nullable
              as List<ChatMessage>,
      isTyping: null == isTyping
          ? _value.isTyping
          : isTyping // ignore: cast_nullable_to_non_nullable
              as bool,
      error: freezed == error
          ? _value.error
          : error // ignore: cast_nullable_to_non_nullable
              as String?,
    ));
  }
}

/// @nodoc

class _$ResumeAnalyzerStateImpl implements _ResumeAnalyzerState {
  const _$ResumeAnalyzerStateImpl(
      {this.isUploading = false,
      this.uploadData = null,
      final List<ChatMessage> messages = const [],
      this.isTyping = false,
      this.error = null})
      : _messages = messages;

  @override
  @JsonKey()
  final bool isUploading;
  @override
  @JsonKey()
  final ResumeUploadData? uploadData;
  final List<ChatMessage> _messages;
  @override
  @JsonKey()
  List<ChatMessage> get messages {
    if (_messages is EqualUnmodifiableListView) return _messages;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_messages);
  }

  @override
  @JsonKey()
  final bool isTyping;
  @override
  @JsonKey()
  final String? error;

  @override
  String toString() {
    return 'ResumeAnalyzerState(isUploading: $isUploading, uploadData: $uploadData, messages: $messages, isTyping: $isTyping, error: $error)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ResumeAnalyzerStateImpl &&
            (identical(other.isUploading, isUploading) ||
                other.isUploading == isUploading) &&
            (identical(other.uploadData, uploadData) ||
                other.uploadData == uploadData) &&
            const DeepCollectionEquality().equals(other._messages, _messages) &&
            (identical(other.isTyping, isTyping) ||
                other.isTyping == isTyping) &&
            (identical(other.error, error) || other.error == error));
  }

  @override
  int get hashCode => Object.hash(runtimeType, isUploading, uploadData,
      const DeepCollectionEquality().hash(_messages), isTyping, error);

  /// Create a copy of ResumeAnalyzerState
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ResumeAnalyzerStateImplCopyWith<_$ResumeAnalyzerStateImpl> get copyWith =>
      __$$ResumeAnalyzerStateImplCopyWithImpl<_$ResumeAnalyzerStateImpl>(
          this, _$identity);
}

abstract class _ResumeAnalyzerState implements ResumeAnalyzerState {
  const factory _ResumeAnalyzerState(
      {final bool isUploading,
      final ResumeUploadData? uploadData,
      final List<ChatMessage> messages,
      final bool isTyping,
      final String? error}) = _$ResumeAnalyzerStateImpl;

  @override
  bool get isUploading;
  @override
  ResumeUploadData? get uploadData;
  @override
  List<ChatMessage> get messages;
  @override
  bool get isTyping;
  @override
  String? get error;

  /// Create a copy of ResumeAnalyzerState
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ResumeAnalyzerStateImplCopyWith<_$ResumeAnalyzerStateImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
