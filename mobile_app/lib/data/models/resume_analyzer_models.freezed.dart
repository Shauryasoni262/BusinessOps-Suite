// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'resume_analyzer_models.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

ResumeUploadResult _$ResumeUploadResultFromJson(Map<String, dynamic> json) {
  return _ResumeUploadResult.fromJson(json);
}

/// @nodoc
mixin _$ResumeUploadResult {
  bool get success => throw _privateConstructorUsedError;
  String get message => throw _privateConstructorUsedError;
  ResumeUploadData get data => throw _privateConstructorUsedError;

  /// Serializes this ResumeUploadResult to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of ResumeUploadResult
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ResumeUploadResultCopyWith<ResumeUploadResult> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ResumeUploadResultCopyWith<$Res> {
  factory $ResumeUploadResultCopyWith(
          ResumeUploadResult value, $Res Function(ResumeUploadResult) then) =
      _$ResumeUploadResultCopyWithImpl<$Res, ResumeUploadResult>;
  @useResult
  $Res call({bool success, String message, ResumeUploadData data});

  $ResumeUploadDataCopyWith<$Res> get data;
}

/// @nodoc
class _$ResumeUploadResultCopyWithImpl<$Res, $Val extends ResumeUploadResult>
    implements $ResumeUploadResultCopyWith<$Res> {
  _$ResumeUploadResultCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of ResumeUploadResult
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? success = null,
    Object? message = null,
    Object? data = null,
  }) {
    return _then(_value.copyWith(
      success: null == success
          ? _value.success
          : success // ignore: cast_nullable_to_non_nullable
              as bool,
      message: null == message
          ? _value.message
          : message // ignore: cast_nullable_to_non_nullable
              as String,
      data: null == data
          ? _value.data
          : data // ignore: cast_nullable_to_non_nullable
              as ResumeUploadData,
    ) as $Val);
  }

  /// Create a copy of ResumeUploadResult
  /// with the given fields replaced by the non-null parameter values.
  @override
  @pragma('vm:prefer-inline')
  $ResumeUploadDataCopyWith<$Res> get data {
    return $ResumeUploadDataCopyWith<$Res>(_value.data, (value) {
      return _then(_value.copyWith(data: value) as $Val);
    });
  }
}

/// @nodoc
abstract class _$$ResumeUploadResultImplCopyWith<$Res>
    implements $ResumeUploadResultCopyWith<$Res> {
  factory _$$ResumeUploadResultImplCopyWith(_$ResumeUploadResultImpl value,
          $Res Function(_$ResumeUploadResultImpl) then) =
      __$$ResumeUploadResultImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({bool success, String message, ResumeUploadData data});

  @override
  $ResumeUploadDataCopyWith<$Res> get data;
}

/// @nodoc
class __$$ResumeUploadResultImplCopyWithImpl<$Res>
    extends _$ResumeUploadResultCopyWithImpl<$Res, _$ResumeUploadResultImpl>
    implements _$$ResumeUploadResultImplCopyWith<$Res> {
  __$$ResumeUploadResultImplCopyWithImpl(_$ResumeUploadResultImpl _value,
      $Res Function(_$ResumeUploadResultImpl) _then)
      : super(_value, _then);

  /// Create a copy of ResumeUploadResult
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? success = null,
    Object? message = null,
    Object? data = null,
  }) {
    return _then(_$ResumeUploadResultImpl(
      success: null == success
          ? _value.success
          : success // ignore: cast_nullable_to_non_nullable
              as bool,
      message: null == message
          ? _value.message
          : message // ignore: cast_nullable_to_non_nullable
              as String,
      data: null == data
          ? _value.data
          : data // ignore: cast_nullable_to_non_nullable
              as ResumeUploadData,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$ResumeUploadResultImpl implements _ResumeUploadResult {
  const _$ResumeUploadResultImpl(
      {required this.success, required this.message, required this.data});

  factory _$ResumeUploadResultImpl.fromJson(Map<String, dynamic> json) =>
      _$$ResumeUploadResultImplFromJson(json);

  @override
  final bool success;
  @override
  final String message;
  @override
  final ResumeUploadData data;

  @override
  String toString() {
    return 'ResumeUploadResult(success: $success, message: $message, data: $data)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ResumeUploadResultImpl &&
            (identical(other.success, success) || other.success == success) &&
            (identical(other.message, message) || other.message == message) &&
            (identical(other.data, data) || other.data == data));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, success, message, data);

  /// Create a copy of ResumeUploadResult
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ResumeUploadResultImplCopyWith<_$ResumeUploadResultImpl> get copyWith =>
      __$$ResumeUploadResultImplCopyWithImpl<_$ResumeUploadResultImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$ResumeUploadResultImplToJson(
      this,
    );
  }
}

abstract class _ResumeUploadResult implements ResumeUploadResult {
  const factory _ResumeUploadResult(
      {required final bool success,
      required final String message,
      required final ResumeUploadData data}) = _$ResumeUploadResultImpl;

  factory _ResumeUploadResult.fromJson(Map<String, dynamic> json) =
      _$ResumeUploadResultImpl.fromJson;

  @override
  bool get success;
  @override
  String get message;
  @override
  ResumeUploadData get data;

  /// Create a copy of ResumeUploadResult
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ResumeUploadResultImplCopyWith<_$ResumeUploadResultImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

ResumeUploadData _$ResumeUploadDataFromJson(Map<String, dynamic> json) {
  return _ResumeUploadData.fromJson(json);
}

/// @nodoc
mixin _$ResumeUploadData {
  String get resumeId => throw _privateConstructorUsedError;
  String get fileName => throw _privateConstructorUsedError;
  int get textLength => throw _privateConstructorUsedError;
  int get chunksCreated => throw _privateConstructorUsedError;
  int get pageCount => throw _privateConstructorUsedError;

  /// Serializes this ResumeUploadData to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of ResumeUploadData
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ResumeUploadDataCopyWith<ResumeUploadData> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ResumeUploadDataCopyWith<$Res> {
  factory $ResumeUploadDataCopyWith(
          ResumeUploadData value, $Res Function(ResumeUploadData) then) =
      _$ResumeUploadDataCopyWithImpl<$Res, ResumeUploadData>;
  @useResult
  $Res call(
      {String resumeId,
      String fileName,
      int textLength,
      int chunksCreated,
      int pageCount});
}

/// @nodoc
class _$ResumeUploadDataCopyWithImpl<$Res, $Val extends ResumeUploadData>
    implements $ResumeUploadDataCopyWith<$Res> {
  _$ResumeUploadDataCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of ResumeUploadData
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? resumeId = null,
    Object? fileName = null,
    Object? textLength = null,
    Object? chunksCreated = null,
    Object? pageCount = null,
  }) {
    return _then(_value.copyWith(
      resumeId: null == resumeId
          ? _value.resumeId
          : resumeId // ignore: cast_nullable_to_non_nullable
              as String,
      fileName: null == fileName
          ? _value.fileName
          : fileName // ignore: cast_nullable_to_non_nullable
              as String,
      textLength: null == textLength
          ? _value.textLength
          : textLength // ignore: cast_nullable_to_non_nullable
              as int,
      chunksCreated: null == chunksCreated
          ? _value.chunksCreated
          : chunksCreated // ignore: cast_nullable_to_non_nullable
              as int,
      pageCount: null == pageCount
          ? _value.pageCount
          : pageCount // ignore: cast_nullable_to_non_nullable
              as int,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$ResumeUploadDataImplCopyWith<$Res>
    implements $ResumeUploadDataCopyWith<$Res> {
  factory _$$ResumeUploadDataImplCopyWith(_$ResumeUploadDataImpl value,
          $Res Function(_$ResumeUploadDataImpl) then) =
      __$$ResumeUploadDataImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String resumeId,
      String fileName,
      int textLength,
      int chunksCreated,
      int pageCount});
}

/// @nodoc
class __$$ResumeUploadDataImplCopyWithImpl<$Res>
    extends _$ResumeUploadDataCopyWithImpl<$Res, _$ResumeUploadDataImpl>
    implements _$$ResumeUploadDataImplCopyWith<$Res> {
  __$$ResumeUploadDataImplCopyWithImpl(_$ResumeUploadDataImpl _value,
      $Res Function(_$ResumeUploadDataImpl) _then)
      : super(_value, _then);

  /// Create a copy of ResumeUploadData
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? resumeId = null,
    Object? fileName = null,
    Object? textLength = null,
    Object? chunksCreated = null,
    Object? pageCount = null,
  }) {
    return _then(_$ResumeUploadDataImpl(
      resumeId: null == resumeId
          ? _value.resumeId
          : resumeId // ignore: cast_nullable_to_non_nullable
              as String,
      fileName: null == fileName
          ? _value.fileName
          : fileName // ignore: cast_nullable_to_non_nullable
              as String,
      textLength: null == textLength
          ? _value.textLength
          : textLength // ignore: cast_nullable_to_non_nullable
              as int,
      chunksCreated: null == chunksCreated
          ? _value.chunksCreated
          : chunksCreated // ignore: cast_nullable_to_non_nullable
              as int,
      pageCount: null == pageCount
          ? _value.pageCount
          : pageCount // ignore: cast_nullable_to_non_nullable
              as int,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$ResumeUploadDataImpl implements _ResumeUploadData {
  const _$ResumeUploadDataImpl(
      {required this.resumeId,
      required this.fileName,
      required this.textLength,
      required this.chunksCreated,
      required this.pageCount});

  factory _$ResumeUploadDataImpl.fromJson(Map<String, dynamic> json) =>
      _$$ResumeUploadDataImplFromJson(json);

  @override
  final String resumeId;
  @override
  final String fileName;
  @override
  final int textLength;
  @override
  final int chunksCreated;
  @override
  final int pageCount;

  @override
  String toString() {
    return 'ResumeUploadData(resumeId: $resumeId, fileName: $fileName, textLength: $textLength, chunksCreated: $chunksCreated, pageCount: $pageCount)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ResumeUploadDataImpl &&
            (identical(other.resumeId, resumeId) ||
                other.resumeId == resumeId) &&
            (identical(other.fileName, fileName) ||
                other.fileName == fileName) &&
            (identical(other.textLength, textLength) ||
                other.textLength == textLength) &&
            (identical(other.chunksCreated, chunksCreated) ||
                other.chunksCreated == chunksCreated) &&
            (identical(other.pageCount, pageCount) ||
                other.pageCount == pageCount));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
      runtimeType, resumeId, fileName, textLength, chunksCreated, pageCount);

  /// Create a copy of ResumeUploadData
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ResumeUploadDataImplCopyWith<_$ResumeUploadDataImpl> get copyWith =>
      __$$ResumeUploadDataImplCopyWithImpl<_$ResumeUploadDataImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$ResumeUploadDataImplToJson(
      this,
    );
  }
}

abstract class _ResumeUploadData implements ResumeUploadData {
  const factory _ResumeUploadData(
      {required final String resumeId,
      required final String fileName,
      required final int textLength,
      required final int chunksCreated,
      required final int pageCount}) = _$ResumeUploadDataImpl;

  factory _ResumeUploadData.fromJson(Map<String, dynamic> json) =
      _$ResumeUploadDataImpl.fromJson;

  @override
  String get resumeId;
  @override
  String get fileName;
  @override
  int get textLength;
  @override
  int get chunksCreated;
  @override
  int get pageCount;

  /// Create a copy of ResumeUploadData
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ResumeUploadDataImplCopyWith<_$ResumeUploadDataImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

ResumeChatResponse _$ResumeChatResponseFromJson(Map<String, dynamic> json) {
  return _ResumeChatResponse.fromJson(json);
}

/// @nodoc
mixin _$ResumeChatResponse {
  String get answer => throw _privateConstructorUsedError;
  int get sourcesUsed => throw _privateConstructorUsedError;

  /// Serializes this ResumeChatResponse to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of ResumeChatResponse
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ResumeChatResponseCopyWith<ResumeChatResponse> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ResumeChatResponseCopyWith<$Res> {
  factory $ResumeChatResponseCopyWith(
          ResumeChatResponse value, $Res Function(ResumeChatResponse) then) =
      _$ResumeChatResponseCopyWithImpl<$Res, ResumeChatResponse>;
  @useResult
  $Res call({String answer, int sourcesUsed});
}

/// @nodoc
class _$ResumeChatResponseCopyWithImpl<$Res, $Val extends ResumeChatResponse>
    implements $ResumeChatResponseCopyWith<$Res> {
  _$ResumeChatResponseCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of ResumeChatResponse
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? answer = null,
    Object? sourcesUsed = null,
  }) {
    return _then(_value.copyWith(
      answer: null == answer
          ? _value.answer
          : answer // ignore: cast_nullable_to_non_nullable
              as String,
      sourcesUsed: null == sourcesUsed
          ? _value.sourcesUsed
          : sourcesUsed // ignore: cast_nullable_to_non_nullable
              as int,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$ResumeChatResponseImplCopyWith<$Res>
    implements $ResumeChatResponseCopyWith<$Res> {
  factory _$$ResumeChatResponseImplCopyWith(_$ResumeChatResponseImpl value,
          $Res Function(_$ResumeChatResponseImpl) then) =
      __$$ResumeChatResponseImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String answer, int sourcesUsed});
}

/// @nodoc
class __$$ResumeChatResponseImplCopyWithImpl<$Res>
    extends _$ResumeChatResponseCopyWithImpl<$Res, _$ResumeChatResponseImpl>
    implements _$$ResumeChatResponseImplCopyWith<$Res> {
  __$$ResumeChatResponseImplCopyWithImpl(_$ResumeChatResponseImpl _value,
      $Res Function(_$ResumeChatResponseImpl) _then)
      : super(_value, _then);

  /// Create a copy of ResumeChatResponse
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? answer = null,
    Object? sourcesUsed = null,
  }) {
    return _then(_$ResumeChatResponseImpl(
      answer: null == answer
          ? _value.answer
          : answer // ignore: cast_nullable_to_non_nullable
              as String,
      sourcesUsed: null == sourcesUsed
          ? _value.sourcesUsed
          : sourcesUsed // ignore: cast_nullable_to_non_nullable
              as int,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$ResumeChatResponseImpl implements _ResumeChatResponse {
  const _$ResumeChatResponseImpl(
      {required this.answer, required this.sourcesUsed});

  factory _$ResumeChatResponseImpl.fromJson(Map<String, dynamic> json) =>
      _$$ResumeChatResponseImplFromJson(json);

  @override
  final String answer;
  @override
  final int sourcesUsed;

  @override
  String toString() {
    return 'ResumeChatResponse(answer: $answer, sourcesUsed: $sourcesUsed)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ResumeChatResponseImpl &&
            (identical(other.answer, answer) || other.answer == answer) &&
            (identical(other.sourcesUsed, sourcesUsed) ||
                other.sourcesUsed == sourcesUsed));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, answer, sourcesUsed);

  /// Create a copy of ResumeChatResponse
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ResumeChatResponseImplCopyWith<_$ResumeChatResponseImpl> get copyWith =>
      __$$ResumeChatResponseImplCopyWithImpl<_$ResumeChatResponseImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$ResumeChatResponseImplToJson(
      this,
    );
  }
}

abstract class _ResumeChatResponse implements ResumeChatResponse {
  const factory _ResumeChatResponse(
      {required final String answer,
      required final int sourcesUsed}) = _$ResumeChatResponseImpl;

  factory _ResumeChatResponse.fromJson(Map<String, dynamic> json) =
      _$ResumeChatResponseImpl.fromJson;

  @override
  String get answer;
  @override
  int get sourcesUsed;

  /// Create a copy of ResumeChatResponse
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ResumeChatResponseImplCopyWith<_$ResumeChatResponseImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
