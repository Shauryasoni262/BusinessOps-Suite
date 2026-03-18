import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import '../../domain/repositories/resume_analyzer_repository.dart';
import '../../data/repositories/resume_analyzer_repository.dart';
import '../../data/models/resume_analyzer_models.dart';
import '../../data/models/chat_message.dart';
import '../../core/providers/network_providers.dart';

part 'resume_analyzer_providers.g.dart';
part 'resume_analyzer_providers.freezed.dart';

@riverpod
ResumeAnalyzerRepository resumeAnalyzerRepository(Ref ref) {
  final apiClient = ref.watch(apiClientProvider);
  return ResumeAnalyzerRepositoryImpl(apiClient);
}

@freezed
class ResumeAnalyzerState with _$ResumeAnalyzerState {
  const factory ResumeAnalyzerState({
    @Default(false) bool isUploading,
    @Default(null) ResumeUploadData? uploadData,
    @Default([]) List<ChatMessage> messages,
    @Default(false) bool isTyping,
    @Default(null) String? error,
  }) = _ResumeAnalyzerState;
}

@riverpod
class ResumeAnalyzerNotifier extends _$ResumeAnalyzerNotifier {
  @override
  ResumeAnalyzerState build() => const ResumeAnalyzerState();

  Future<void> uploadResume(String filePath, String fileName) async {
    state = state.copyWith(isUploading: true, error: null);
    try {
      final result = await ref.read(resumeAnalyzerRepositoryProvider).uploadResume(filePath, fileName);
      if (result.success) {
        state = state.copyWith(
          isUploading: false,
          uploadData: result.data,
          messages: [
            ChatMessage(
              id: 'welcome',
              message: "I've successfully read your resume! What would you like to know about it? \n\n*Try asking: 'What are my top skills?', 'Summarize my experience', or 'What am I missing for a Frontend role?'*",
              senderId: 'ai',
              senderName: 'AI Analyst',
              timestamp: DateTime.now(),
              role: ChatRole.assistant,
            ),
          ],
        );
      } else {
        state = state.copyWith(isUploading: false, error: result.message);
      }
    } catch (e) {
      state = state.copyWith(isUploading: false, error: 'Failed to upload resume. Please try again.');
    }
  }

  Future<void> sendMessage(String message) async {
    final resumeId = state.uploadData?.resumeId;
    if (resumeId == null || message.trim().isEmpty) return;

    final userMessage = ChatMessage(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      message: message,
      senderId: 'user',
      senderName: 'You',
      timestamp: DateTime.now(),
      role: ChatRole.user,
    );

    state = state.copyWith(
      messages: [...state.messages, userMessage],
      isTyping: true,
    );

    try {
      final response = await ref.read(resumeAnalyzerRepositoryProvider).chatWithResume(resumeId, message);
      final aiMessage = ChatMessage(
        id: (DateTime.now().millisecondsSinceEpoch + 1).toString(),
        message: response.answer,
        senderId: 'ai',
        senderName: 'AI Analyst',
        timestamp: DateTime.now(),
        role: ChatRole.assistant,
      );
      state = state.copyWith(
        messages: [...state.messages, aiMessage],
        isTyping: false,
      );
    } catch (e) {
      state = state.copyWith(
        isTyping: false,
        messages: [...state.messages, ChatMessage(
          id: 'error',
          message: 'Failed to get response. Please try again.',
          senderId: 'system',
          senderName: 'System',
          timestamp: DateTime.now(),
          role: ChatRole.system,
        )],
      );
    }
  }

  void reset() {
    state = const ResumeAnalyzerState();
  }
}
