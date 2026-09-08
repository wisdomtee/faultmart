import 'package:socket_io_client/socket_io_client.dart' as io;

import '../core/constants/api_constants.dart';
import '../services/auth_service.dart';

class NotificationSocketService {
  NotificationSocketService._();

  static final NotificationSocketService instance =
      NotificationSocketService._();

  io.Socket? _socket;

  bool get isConnected => _socket?.connected ?? false;

  Future<void> connect({
    void Function(Map<String, dynamic> notification)? onNotification,
  }) async {
    final token = await AuthService.getAccessToken();

    if (token == null || token.isEmpty) {
      return;
    }

    disconnect();

    _socket = io.io(
      ApiConstants.baseUrl,
      io.OptionBuilder()
          .setTransports(['websocket'])
          .setAuth({
            'token': token,
          })
          .enableAutoConnect()
          .enableReconnection()
          .build(),
    );

    _socket!.onConnect((_) {
      // Socket connected.
    });

    _socket!.on('notification', (data) {
      if (data is Map) {
        onNotification?.call(
          Map<String, dynamic>.from(data),
        );
      }
    });

    _socket!.onDisconnect((_) {
      // Socket disconnected.
    });

    _socket!.onConnectError((error) {
      // Connection errors are handled by Socket.IO reconnection.
    });
  }

  void disconnect() {
    _socket?.disconnect();
    _socket?.dispose();
    _socket = null;
  }
}
