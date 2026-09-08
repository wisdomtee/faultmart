import 'dart:convert';

import 'package:http/http.dart' as http;

import '../core/constants/api_constants.dart';
import '../models/user.dart';
import 'api_client.dart';
import 'auth_storage.dart';

class AuthService {
  AuthService._();

  static final http.Client _client = ApiClient.client;

  static Future<Map<String, dynamic>> register({
    required String firstName,
    required String lastName,
    required String email,
    String? phone,
    required String password,
  }) async {
    final response = await _client.post(
      Uri.parse(ApiConstants.register),
      headers: const {
        'Content-Type': 'application/json',
      },
      body: jsonEncode({
        'firstName': firstName,
        'lastName': lastName,
        'email': email,
        if (phone != null && phone.trim().isNotEmpty) 'phone': phone.trim(),
        'password': password,
      }),
    );

    final result = _handleResponse(response);

    await _saveAccessTokenFromResponse(result);

    return result;
  }

  static Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    final response = await _client.post(
      Uri.parse(ApiConstants.login),
      headers: const {
        'Content-Type': 'application/json',
      },
      body: jsonEncode({
        'email': email,
        'password': password,
      }),
    );

    final result = _handleResponse(response);

    await _saveAccessTokenFromResponse(result);

    return result;
  }

  static Future<Map<String, dynamic>> forgotPassword({
    required String email,
  }) async {
    final response = await _client.post(
      Uri.parse(ApiConstants.forgotPassword),
      headers: const {
        'Content-Type': 'application/json',
      },
      body: jsonEncode({
        'email': email.trim().toLowerCase(),
      }),
    );

    return _handleResponse(response);
  }

  static Future<Map<String, dynamic>> resetPassword({
    required String token,
    required String password,
  }) async {
    final response = await _client.post(
      Uri.parse(ApiConstants.resetPassword),
      headers: const {
        'Content-Type': 'application/json',
      },
      body: jsonEncode({
        'token': token,
        'password': password,
      }),
    );

    return _handleResponse(response);
  }

  static Future<User?> restoreSession() async {
    final accessToken = await getAccessToken();

    if (accessToken == null || accessToken.isEmpty) {
      return null;
    }

    try {
      return await getCurrentUser();
    } catch (_) {
      try {
        await refresh();
        return await getCurrentUser();
      } catch (_) {
        await clearSession();
        return null;
      }
    }
  }

  static Future<String?> getAccessToken() async {
    return AuthStorage.getAccessToken();
  }

  static Future<bool> isLoggedIn() async {
    final accessToken = await getAccessToken();
    return accessToken != null && accessToken.isNotEmpty;
  }

  static Future<Map<String, dynamic>> me({
    required String accessToken,
  }) async {
    final response = await ApiClient.get(
      Uri.parse(ApiConstants.me),
      headers: const {
        'Content-Type': 'application/json',
      },
    );

    return _handleResponse(response);
  }

  static Future<User> getCurrentUser() async {
    final accessToken = await getAccessToken();

    if (accessToken == null || accessToken.isEmpty) {
      throw Exception('You must be logged in.');
    }

    final result = await me(accessToken: accessToken);

    final data = result['user'];

    if (data is! Map) {
      throw Exception('Invalid user data returned by server.');
    }

    return User.fromJson(
      Map<String, dynamic>.from(data),
    );
  }

  static Future<Map<String, dynamic>> refresh() async {
    final response = await _client.post(
      Uri.parse(ApiConstants.refresh),
      headers: const {
        'Content-Type': 'application/json',
      },
    );

    final result = _handleResponse(response);

    await _saveAccessTokenFromResponse(result);

    return result;
  }

  static Future<void> clearSession() async {
    await AuthStorage.clear();
    ApiClient.clearCookies();
  }

  static Future<Map<String, dynamic>> logout() async {
    try {
      final response = await _client.post(
        Uri.parse(ApiConstants.logout),
        headers: const {
          'Content-Type': 'application/json',
        },
      );

      return _handleResponse(response);
    } finally {
      await clearSession();
    }
  }

  static Future<void> _saveAccessTokenFromResponse(
    Map<String, dynamic> result,
  ) async {
    final accessToken = result['accessToken'];

    if (accessToken is String && accessToken.isNotEmpty) {
      await AuthStorage.saveAccessToken(accessToken);
    }
  }

  static Map<String, dynamic> _handleResponse(http.Response response) {
    dynamic decoded;

    try {
      decoded = jsonDecode(response.body);
    } catch (_) {
      throw Exception(
        'Request failed with status ${response.statusCode}.',
      );
    }

    if (response.statusCode >= 200 && response.statusCode < 300) {
      if (decoded is Map<String, dynamic>) {
        return decoded;
      }

      throw Exception('Invalid server response.');
    }

    if (decoded is Map<String, dynamic>) {
      throw Exception(
        decoded['message']?.toString() ??
            'Request failed with status ${response.statusCode}.',
      );
    }

    throw Exception(
      'Request failed with status ${response.statusCode}.',
    );
  }
}
