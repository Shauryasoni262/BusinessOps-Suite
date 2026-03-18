import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../../core/constants/app_constants.dart';
import '../../domain/entities/user_entity.dart';
import '../../domain/repositories/auth_repository.dart';
import '../data_sources/auth_remote_data_source.dart';

class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource _remoteDataSource;
  final FlutterSecureStorage _storage;

  AuthRepositoryImpl(this._remoteDataSource, this._storage);

  @override
  Future<UserEntity> signIn(String email, String password) async {
    final result = await _remoteDataSource.signIn(email, password);
    
    // Save token to secure storage
    await _storage.write(key: AppConstants.tokenKey, value: result.token);
    
    return result.user.toEntity();
  }

  @override
  Future<UserEntity?> getCurrentUser() async {
    final token = await _storage.read(key: AppConstants.tokenKey);
    if (token == null) return null;

    try {
      final userModel = await _remoteDataSource.getProfile();
      return userModel.toEntity();
    } catch (e) {
      // If profile fetch fails (e.g., token expired), clear storage
      await _storage.delete(key: AppConstants.tokenKey);
      return null;
    }
  }

  @override
  Future<void> signOut() async {
    await _storage.delete(key: AppConstants.tokenKey);
  }

  @override
  Future<bool> isAuthenticated() async {
    final token = await _storage.read(key: AppConstants.tokenKey);
    return token != null;
  }
}
