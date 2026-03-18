import 'package:dio/dio.dart';
import '../../core/network/api_client.dart';
import '../models/user_model.dart';

class AuthRemoteDataSource {
  final ApiClient _apiClient;

  AuthRemoteDataSource(this._apiClient);

  Future<({UserModel user, String token})> signIn(
    String email,
    String password,
  ) async {
    final response = await _apiClient.dio.post(
      '/auth/login',
      data: {'email': email, 'password': password},
    );

    if (response.data['success'] == true) {
      final userData = response.data['data']['user'];
      final token = response.data['data']['token'] as String;

      return (user: UserModel.fromJson(userData), token: token);
    } else {
      throw DioException(
        requestOptions: response.requestOptions,
        response: response,
        error: response.data['message'] ?? 'Login failed',
      );
    }
  }

  Future<UserModel> getProfile() async {
    final response = await _apiClient.dio.get('/auth/profile');

    if (response.data['success'] == true) {
      return UserModel.fromJson(response.data['data']['user']);
    } else {
      throw Exception(response.data['message'] ?? 'Failed to get profile');
    }
  }
}
