import 'package:flutter/foundation.dart';

import '../models/notification.dart';
import 'notification_service.dart';
import 'notification_socket_service.dart';

class NotificationManager extends ChangeNotifier {
  NotificationManager._();

  static final NotificationManager instance = NotificationManager._();

  final List<AppNotification> _notifications = [];

  List<AppNotification> get notifications => List.unmodifiable(_notifications);

  int get unreadCount =>
      _notifications.where((notification) => !notification.isRead).length;

  bool _started = false;

  Future<void> start() async {
    if (_started) {
      return;
    }

    _started = true;

    await _loadNotifications();

    await NotificationSocketService.instance.connect(
      onNotification: _handleIncomingNotification,
    );
  }

  Future<void> _loadNotifications() async {
    try {
      final notifications = await NotificationService.getNotifications();

      _notifications
        ..clear()
        ..addAll(notifications);

      notifyListeners();
    } catch (_) {
      // Notifications are non-blocking. The socket can still connect.
    }
  }

  void _handleIncomingNotification(Map<String, dynamic> data) {
    final notification = AppNotification.fromJson(data);

    if (notification.id.isEmpty) {
      return;
    }

    final existingIndex = _notifications.indexWhere(
      (item) => item.id == notification.id,
    );

    if (existingIndex >= 0) {
      _notifications[existingIndex] = notification;
    } else {
      _notifications.insert(0, notification);
    }

    notifyListeners();
  }

  Future<void> refresh() async {
    await _loadNotifications();
  }

  Future<void> markAsRead(String id) async {
    final index = _notifications.indexWhere(
      (notification) => notification.id == id,
    );

    if (index < 0) {
      return;
    }

    final notification = _notifications[index];

    if (!notification.isRead) {
      _notifications[index] = AppNotification(
        id: notification.id,
        userId: notification.userId,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        isRead: true,
        createdAt: notification.createdAt,
        referenceId: notification.referenceId,
        referenceType: notification.referenceType,
      );

      notifyListeners();
    }

    try {
      await NotificationService.markAsRead(id);
    } catch (_) {
      // Keep the local state responsive even if the request fails.
    }
  }

  Future<void> markAllAsRead() async {
    var changed = false;

    for (var i = 0; i < _notifications.length; i++) {
      final notification = _notifications[i];

      if (!notification.isRead) {
        _notifications[i] = AppNotification(
          id: notification.id,
          userId: notification.userId,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          isRead: true,
          createdAt: notification.createdAt,
          referenceId: notification.referenceId,
          referenceType: notification.referenceType,
        );

        changed = true;
      }
    }

    if (changed) {
      notifyListeners();
    }

    try {
      await NotificationService.markAllAsRead();
    } catch (_) {
      // Keep local state responsive.
    }
  }

  Future<void> deleteNotification(String id) async {
    final index = _notifications.indexWhere(
      (notification) => notification.id == id,
    );

    if (index < 0) {
      return;
    }

    final removed = _notifications.removeAt(index);
    notifyListeners();

    try {
      await NotificationService.deleteNotification(id);
    } catch (_) {
      _notifications.insert(index, removed);
      notifyListeners();
    }
  }

  void stop() {
    _started = false;
    NotificationSocketService.instance.disconnect();
  }
}
