class AppConstants {
  // Use your computer's local IP address instead of localhost for physical devices/emulators
  // Run 'ipconfig' in your terminal to find your IPv4 address
  static const String baseUrl = 'http://10.0.2.2:5000/api'; // Standard for Android Emulator
  
  // Storage Keys
  static const String tokenKey = 'jwt_token';
  static const String userKey = 'user_data';
  
  // Timeout settings
  static const int connectTimeout = 30000; // 30 seconds
  static const int receiveTimeout = 30000; // 30 seconds
}
