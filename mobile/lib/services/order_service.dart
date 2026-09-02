import 'dart:convert';

import 'package:http/http.dart' as http;

import '../core/constants/api_constants.dart';
import '../models/order.dart';
import 'auth_storage.dart';

class OrderService {
  static Future<String?> _token() async {
    return AuthStorage.getAccessToken();
  }

  static Future<Map<String, String>> _headers() async {
    final token = await _token();

    return {
      'Content-Type': 'application/json',
      if (token != null && token.isNotEmpty)
        'Authorization': 'Bearer $token',
    };
  }

  static dynamic _decode(http.Response response) {
    if (response.body.isEmpty) return null;

    try {
      return jsonDecode(response.body);
    } catch (_) {
      return null;
    }
  }

  static String _errorMessage(http.Response response) {
    final decoded = _decode(response);

    if (decoded is Map<String, dynamic>) {
      final message = decoded['message'];
      if (message != null && message.toString().trim().isNotEmpty) {
        return message.toString();
      }
    }

    return 'Request failed (${response.statusCode}).';
  }

  static Future<List<Order>> getMyOrders() async {
    final response = await http.get(
      Uri.parse(ApiConstants.orders),
      headers: await _headers(),
    );

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception(_errorMessage(response));
    }

    final decoded = _decode(response);

    if (decoded is! Map<String, dynamic>) {
      throw Exception('Invalid orders response.');
    }

    final rawData = decoded['data'];

    if (rawData is! List) {
      return const [];
    }

    return rawData
        .whereType<Map>()
        .map(
          (item) => Order.fromJson(
            Map<String, dynamic>.from(item),
          ),
        )
        .toList();
  }

  static Future<Order> getOrderById(String orderId) async {
    final response = await http.get(
      Uri.parse(ApiConstants.orderById(orderId)),
      headers: await _headers(),
    );

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception(_errorMessage(response));
    }

    final decoded = _decode(response);

    if (decoded is! Map<String, dynamic> || decoded['data'] is! Map) {
      throw Exception('Invalid order response.');
    }

    return Order.fromJson(
      Map<String, dynamic>.from(decoded['data']),
    );
  }

  static Future<Order> confirmReceipt(String orderId) async {
    final response = await http.patch(
      Uri.parse(ApiConstants.confirmOrderReceipt(orderId)),
      headers: await _headers(),
    );

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception(_errorMessage(response));
    }

    final decoded = _decode(response);

    if (decoded is! Map<String, dynamic> || decoded['data'] is! Map) {
      throw Exception('Invalid order response.');
    }

    return Order.fromJson(
      Map<String, dynamic>.from(decoded['data']),
    );
  }

  static Future<Order> cancelOrder(String orderId) async {
    final response = await http.patch(
      Uri.parse(ApiConstants.cancelOrder(orderId)),
      headers: await _headers(),
    );

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception(_errorMessage(response));
    }

    final decoded = _decode(response);

    if (decoded is! Map<String, dynamic> || decoded['data'] is! Map) {
      throw Exception('Invalid order response.');
    }

    return Order.fromJson(
      Map<String, dynamic>.from(decoded['data']),
    );
  }

  static Future<Order> updateStatus(
    String orderId,
    String status,
  ) async {
    final response = await http.patch(
      Uri.parse(ApiConstants.updateOrderStatus(orderId)),
      headers: await _headers(),
      body: jsonEncode({
        'status': status,
      }),
    );

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception(_errorMessage(response));
    }

    final decoded = _decode(response);

    if (decoded is! Map<String, dynamic> || decoded['data'] is! Map) {
      throw Exception('Invalid order response.');
    }

    return Order.fromJson(
      Map<String, dynamic>.from(decoded['data']),
    );
  }
}
