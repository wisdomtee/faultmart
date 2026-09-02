import 'package:shared_preferences/shared_preferences.dart';

class AuthStorage {
  AuthStorage._();

  static const String _accessTokenKey = 'faultmart_access_token';

  static Future<void> saveAccessToken(String token) async {
    final preferences = await SharedPreferences.getInstance();

    await preferences.setString(_accessTokenKey, token);
  }

  static Future<String?> getAccessToken() async {
    final preferences = await SharedPreferences.getInstance();

    return preferences.getString(_accessTokenKey);
  }

  static Future<void> clearAccessToken() async {
    final preferences = await SharedPreferences.getInstance();

    await preferences.remove(_accessTokenKey);
  }

  static Future<void> clear() async {
    await clearAccessToken();
  }

  static Future<bool> hasAccessToken() async {
    final token = await getAccessToken();

    return token != null && token.isNotEmpty;
  }
}
