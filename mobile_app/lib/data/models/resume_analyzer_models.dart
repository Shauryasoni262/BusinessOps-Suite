import 'package:freezed_annotation/freezed_annotation.dart';

part 'resume_analyzer_models.freezed.dart';
part 'resume_analyzer_models.g.dart';

@freezed
class ResumeUploadResult with _$ResumeUploadResult {
  const factory ResumeUploadResult({
    required bool success,
    required String message,
    required ResumeUploadData data,
  }) = _ResumeUploadResult;

  factory ResumeUploadResult.fromJson(Map<String, dynamic> json) =>
      _$ResumeUploadResultFromJson(json);
}

@freezed
class ResumeUploadData with _$ResumeUploadData {
  const factory ResumeUploadData({
    required String resumeId,
    required String fileName,
    required int textLength,
    required int chunksCreated,
    required int pageCount,
  }) = _ResumeUploadData;

  factory ResumeUploadData.fromJson(Map<String, dynamic> json) =>
      _$ResumeUploadDataFromJson(json);
}

@freezed
class ResumeChatResponse with _$ResumeChatResponse {
  const factory ResumeChatResponse({
    required String answer,
    required int sourcesUsed,
  }) = _ResumeChatResponse;

  factory ResumeChatResponse.fromJson(Map<String, dynamic> json) =>
      _$ResumeChatResponseFromJson(json);
}
