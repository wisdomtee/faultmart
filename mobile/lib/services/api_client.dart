import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:http_cookie_store/http_cookie_store.dart';

import '../core/constants/api_constants.dart';
import 'auth_storage.dart';

class ApiClient {
  ApiClient._();

  static final CookieClient client = CookieClient();


  static Future<http.Response> get(
    Uri url, {
    Map<String, String>? headers,
  }) {
    return _request(
      method: 'GET',
      url: url,
      headers: headers,
    );
  }

  static Future<http.Response> post(
    Uri url, {
    Map<String, String>? headers,
    Object? body,
  }) {
    return _request(
      method: 'POST',
      url: url,
      headers: headers,
      body: body,
    );
  }

  static Future<http.Response> patch(
    Uri url, {
    Map<String, String>? headers,
    Object? body,
  }) {
    return _request(
      method: 'PATCH',
      url: url,
      headers: headers,
      body: body,
    );
  }

  static Future<http.Response> put(
    Uri url, {
    Map<String, String>? headers,
    Object? body,
  }) {
    return _request(
      method: 'PUT',
      url: url,
      headers: headers,
      body: body,
    );
  }

  static Future<http.Response> delete(
    Uri url, {
    Map<String, String>? headers,
    Object? body,
  }) {
    return _request(
      method: 'DELETE',
      url: url,
      headers: headers,
      body: body,
    );
  }

  static Future<http.StreamedResponse> sendMultipart(
    Future<http.MultipartRequest> Function(String accessToken) builder,
  ) async {
    final accessToken = await AuthStorage.getAccessToken();

    if (accessToken == null || accessToken.isEmpty) {
      throw Exception('You must be logged in.');
    }

    final request = await builder(accessToken);

    request.headers['Authorization'] = 'Bearer $accessToken';

    final response = await client.send(request);

    if (response.statusCode != 401) {
      return response;
    }

    final newAccessToken = await _refreshAccessToken(
      failedAccessToken: accessToken,
    );

    if (newAccessToken == null || newAccessToken.isEmpty) {
      return response;
    }

    final retryRequest = await builder(newAccessToken);
    retryRequest.headers['Authorization'] = 'Bearer $newAccessToken';

    return client.send(retryRequest);
  }

  static Future<http.Response> _request({
    required String method,
    required Uri url,
    Map<String, String>? headers,
    Object? body,
  }) async {
    final accessToken = await AuthStorage.getAccessToken();

    final requestHeaders = <String, String>{
      ...?headers,
      if (accessToken != null && accessToken.isNotEmpty)
        'Authorization': 'Bearer $accessToken',
    };

    final response = await _send(
      method: method,
      url: url,
      headers: requestHeaders,
      body: body,
    );

    if (response.statusCode != 401) {
      return response;
    }

    final newAccessToken = await _refreshAccessToken(
      failedAccessToken: accessToken,
    );

    if (newAccessToken == null || newAccessToken.isEmpty) {
      return response;
    }

    final retryHeaders = <String, String>{
      ...?headers,
      'Authorization': 'Bearer $newAccessToken',
    };

    return _send(
      method: method,
      url: url,
      headers: retryHeaders,
      body: body,
    );
  }

  static Future<http.Response> _send({
    required String method,
    required Uri url,
    required Map<String, String> headers,
    Object? body,
  }) {
    switch (method) {
      case 'GET':
        return client.get(url, headers: headers);

      case 'POST':
        return client.post(
          url,
          headers: headers,
          body: body,
        );

      case 'PATCH':
        return client.patch(
          url,
          headers: headers,
          body: body,
        );

      case 'PUT':
        return client.put(
          url,
          headers: headers,
          body: body,
        );

      case 'DELETE':
        return client.delete(
          url,
          headers: headers,
          body: body,
        );

      default:
        throw ArgumentError('Unsupported HTTP method: $method');
    }
  }

  static Future<String?> _refreshAccessToken({
    String? failedAccessToken,
  }) async {
    final currentAccessToken = await AuthStorage.getAccessToken();

    // Another request may already have refreshed the token.
    if (failedAccessToken != null &&
        currentAccessToken != null &&
        currentAccessToken.isNotEmpty &&
        currentAccessToken != failedAccessToken) {
      return currentAccessToken;
    }

    if (_refreshFuture != null) {
      return _refreshFuture;
    }

    _refreshFuture = _performRefresh();

    try {
      return await _refreshFuture!;
    } finally {
      _refreshFuture = null;
    }
  }

  static Future<String?>? _refreshFuture;

  static Future<String?> _performRefresh() async {
    try {
      final response = await client.post(
        Uri.parse(ApiConstants.refresh),
        headers: const {
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode < 200 || response.statusCode >= 300) {
        // Only clear the session when the refresh credential itself
        // is rejected. Network/server failures must not silently log
        // the user out.
        if (response.statusCode == 401 || response.statusCode == 403) {
          await AuthStorage.clear();
          client.store.clear();
        }

        return null;
      }

      if (response.body.isEmpty) {
        return null;
      }

      final decoded = jsonDecode(response.body);

      if (decoded is! Map<String, dynamic>) {
        return null;
      }

      final accessToken = decoded['accessToken'];

      if (accessToken is! String || accessToken.isEmpty) {
        return null;
      }

      await AuthStorage.saveAccessToken(accessToken);

      return accessToken;
    } catch (_) {
      // Do not log the user out because of a temporary network failure.
      return null;
    }
  }

  static void clearCookies() {
    client.store.clear();
  }
}
