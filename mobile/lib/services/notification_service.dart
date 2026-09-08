import 'dart:convert';

import '../core/constants/api_constants.dart';
import '../models/notification.dart';
import 'api_client.dart';

class NotificationService {
  NotificationService._();

  static Future<List<AppNotification>> getNotifications() async {
    final response = await ApiClient.get(
      Uri.parse(ApiConstants.notifications),
    );

    final decoded = jsonDecode(response.body);

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception(
        decoded is Map
            ? decoded['message']?.toString() ??
                'Failed to load notifications.'
            : 'Failed to load notifications.',
      );
    }

    final data = decoded is Map ? decoded['data'] : null;

    if (data is! List) {
      return [];
    }

    return data
        .map(
          (item) => AppNotification.fromJson(
            Map<String, dynamic>.from(item as Map),
          ),
        )
        .toList();
  }

  static Future<int> getUnreadCount() async {
    final response = await ApiClient.get(
      Uri.parse(ApiConstants.notificationUnreadCount),
    );

    final decoded = jsonDecode(response.body);

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception(
        decoded is Map
            ? decoded['message']?.toString() ??
                'Failed to load notification count.'
            : 'Failed to load notification count.',
      );
    }

    if (decoded is Map) {
      final unread = decoded['unread'];

      if (unread is int) {
        return unread;
      }

      return int.tryParse(unread?.toString() ?? '') ?? 0;
    }

    return 0;
  }

  static Future<void> markAsRead(String id) async {
    final response = await ApiClient.patch(
      Uri.parse(ApiConstants.markNotificationRead(id)),
    );

    if (response.statusCode < 200 || response.statusCode >= 300) {
      final decoded = jsonDecode(response.body);

      throw Exception(
        decoded is Map
            ? decoded['message']?.toString() ??
                'Failed to mark notification as read.'
            : 'Failed to mark notification as read.',
      );
    }
  }

  static Future<void> markAllAsRead() async {
    final response = await ApiClient.patch(
      Uri.parse(ApiConstants.markAllNotificationsRead),
    );

    if (response.statusCode < 200 || response.statusCode >= 300) {
      final decoded = jsonDecode(response.body);

      throw Exception(
        decoded is Map
            ? decoded['message']?.toString() ??
                'Failed to mark notifications as read.'
            : 'Failed to mark notifications as read.',
      );
    }
  }

  static Future<void> deleteNotification(String id) async {
    final response = await ApiClient.delete(
      Uri.parse(ApiConstants.deleteNotification(id)),
    );

    if (response.statusCode < 200 || response.statusCode >= 300) {
      final decoded = jsonDecode(response.body);

      throw Exception(
        decoded is Map
            ? decoded['message']?.toString() ??
                'Failed to delete notification.'
            : 'Failed to delete notification.',
      );
    }
  }
}
