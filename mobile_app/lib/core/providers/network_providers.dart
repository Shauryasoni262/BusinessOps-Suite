import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../network/api_client.dart';

// Provides the specialized Dio instance
final dioProvider = Provider<Dio>((ref) {
  return Dio();
});

// Provides the specialized FlutterSecureStorage instance
final storageProvider = Provider<FlutterSecureStorage>((ref) {
  return const FlutterSecureStorage();
});

// Provides our custom ApiClient
final apiClientProvider = Provider<ApiClient>((ref) {
  final dio = ref.watch(dioProvider);
  final storage = ref.watch(storageProvider);
  return ApiClient(dio, storage);
});
