import 'package:dio/dio.dart';
import '../models/resume_analyzer_models.dart';
import '../../core/network/api_client.dart';
import '../../domain/repositories/resume_analyzer_repository.dart';

class ResumeAnalyzerRepositoryImpl implements ResumeAnalyzerRepository {
  final ApiClient _apiClient;

  ResumeAnalyzerRepositoryImpl(this._apiClient);

  @override
  Future<ResumeUploadResult> uploadResume(String filePath, String fileName) async {
    final formData = FormData.fromMap({
      'file': await MultipartFile.fromFile(filePath, filename: fileName),
    });

    final response = await _apiClient.dio.post(
      '/resume-analyzer/upload',
      data: formData,
    );

    return ResumeUploadResult.fromJson(response.data);
  }

  @override
  Future<ResumeChatResponse> chatWithResume(String resumeId, String message) async {
    final response = await _apiClient.dio.post(
      '/resume-analyzer/chat',
      data: {
        'resumeId': resumeId,
        'message': message,
      },
    );

    // Backend returns { success: true, data: { answer: ..., sourcesUsed: ... } }
    return ResumeChatResponse.fromJson(response.data['data']);
  }
}
