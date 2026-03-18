// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'resume_analyzer_models.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$ResumeUploadResultImpl _$$ResumeUploadResultImplFromJson(
        Map<String, dynamic> json) =>
    _$ResumeUploadResultImpl(
      success: json['success'] as bool,
      message: json['message'] as String,
      data: ResumeUploadData.fromJson(json['data'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$$ResumeUploadResultImplToJson(
        _$ResumeUploadResultImpl instance) =>
    <String, dynamic>{
      'success': instance.success,
      'message': instance.message,
      'data': instance.data,
    };

_$ResumeUploadDataImpl _$$ResumeUploadDataImplFromJson(
        Map<String, dynamic> json) =>
    _$ResumeUploadDataImpl(
      resumeId: json['resumeId'] as String,
      fileName: json['fileName'] as String,
      textLength: (json['textLength'] as num).toInt(),
      chunksCreated: (json['chunksCreated'] as num).toInt(),
      pageCount: (json['pageCount'] as num).toInt(),
    );

Map<String, dynamic> _$$ResumeUploadDataImplToJson(
        _$ResumeUploadDataImpl instance) =>
    <String, dynamic>{
      'resumeId': instance.resumeId,
      'fileName': instance.fileName,
      'textLength': instance.textLength,
      'chunksCreated': instance.chunksCreated,
      'pageCount': instance.pageCount,
    };

_$ResumeChatResponseImpl _$$ResumeChatResponseImplFromJson(
        Map<String, dynamic> json) =>
    _$ResumeChatResponseImpl(
      answer: json['answer'] as String,
      sourcesUsed: (json['sourcesUsed'] as num).toInt(),
    );

Map<String, dynamic> _$$ResumeChatResponseImplToJson(
        _$ResumeChatResponseImpl instance) =>
    <String, dynamic>{
      'answer': instance.answer,
      'sourcesUsed': instance.sourcesUsed,
    };
