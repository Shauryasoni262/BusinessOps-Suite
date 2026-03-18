import '../entities/user_entity.dart';

abstract class AuthRepository {
  /// Sign in with email and password
  Future<UserEntity> signIn(String email, String password);
  
  /// Get current authenticated user
  Future<UserEntity?> getCurrentUser();
  
  /// Sign out and clear session
  Future<void> signOut();
  
  /// Check if user is already logged in
  Future<bool> isAuthenticated();
}
