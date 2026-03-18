import '../../data/models/resume_analyzer_models.dart';

abstract class ResumeAnalyzerRepository {
  Future<ResumeUploadResult> uploadResume(String filePath, String fileName);
  Future<ResumeChatResponse> chatWithResume(String resumeId, String message);
}
