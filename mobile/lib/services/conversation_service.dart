import 'dart:convert';

import 'package:http/http.dart' as http;

import '../core/constants/api_constants.dart';
import '../models/conversation.dart';
import '../models/message.dart';
import 'api_client.dart';

class ConversationService {
  ConversationService._();

  static Future<Conversation> createConversation({
    required String listingId,
    required String sellerId,
  }) async {
    final response = await ApiClient.post(
      Uri.parse(ApiConstants.conversations),
      headers: const {
        'Content-Type': 'application/json',
      },
      body: jsonEncode({
        'listingId': listingId,
        'sellerId': sellerId,
      }),
    );

    final decoded = _ensureSuccess(response);
    final data = decoded['data'];

    if (data is! Map) {
      throw Exception('Invalid conversation response.');
    }

    return Conversation.fromJson(
      Map<String, dynamic>.from(data),
    );
  }

  static Future<List<Conversation>> getMyConversations() async {
    final response = await ApiClient.get(
      Uri.parse(ApiConstants.conversations),
    );

    final decoded = _ensureSuccess(response);
    final data = decoded['data'];

    if (data is! List) {
      return const [];
    }

    return data
        .whereType<Map>()
        .map(
          (item) => Conversation.fromJson(
            Map<String, dynamic>.from(item),
          ),
        )
        .toList();
  }

  static Future<Conversation> getConversation(
    String conversationId,
  ) async {
    final response = await ApiClient.get(
      Uri.parse(
        ApiConstants.conversationById(conversationId),
      ),
    );

    final decoded = _ensureSuccess(response);
    final data = decoded['data'];

    if (data is! Map) {
      throw Exception('Invalid conversation response.');
    }

    return Conversation.fromJson(
      Map<String, dynamic>.from(data),
    );
  }

  static Future<List<Message>> getMessages(
    String conversationId,
  ) async {
    final response = await ApiClient.get(
      Uri.parse(
        ApiConstants.conversationMessages(conversationId),
      ),
    );

    final decoded = _ensureSuccess(response);
    final data = decoded['data'];

    if (data is! List) {
      return const [];
    }

    return data
        .whereType<Map>()
        .map(
          (item) => Message.fromJson(
            Map<String, dynamic>.from(item),
          ),
        )
        .toList();
  }

  static Future<Message> sendMessage({
    required String conversationId,
    required String content,
  }) async {
    final response = await ApiClient.post(
      Uri.parse(
        ApiConstants.conversationMessages(conversationId),
      ),
      headers: const {
        'Content-Type': 'application/json',
      },
      body: jsonEncode({
        'content': content.trim(),
      }),
    );

    final decoded = _ensureSuccess(response);
    final data = decoded['data'];

    if (data is! Map) {
      throw Exception('Invalid message response.');
    }

    return Message.fromJson(
      Map<String, dynamic>.from(data),
    );
  }

  static Future<void> markMessageRead(
    String messageId,
  ) async {
    final response = await ApiClient.patch(
      Uri.parse(
        ApiConstants.markMessageRead(messageId),
      ),
    );

    _ensureSuccess(response);
  }

  static Future<void> deleteMessage(
    String messageId,
  ) async {
    final response = await ApiClient.delete(
      Uri.parse(
        ApiConstants.deleteMessage(messageId),
      ),
    );

    _ensureSuccess(response);
  }

  static Map<String, dynamic> _ensureSuccess(
    http.Response response,
  ) {
    dynamic decoded;

    try {
      decoded = jsonDecode(response.body);
    } catch (_) {
      throw Exception(
        'Request failed with status ${response.statusCode}.',
      );
    }

    if (response.statusCode >= 200 &&
        response.statusCode < 300) {
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
