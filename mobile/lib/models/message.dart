class Message {
  const Message({
    required this.id,
    required this.conversationId,
    required this.senderId,
    required this.type,
    required this.content,
    required this.isRead,
    required this.createdAt,
    this.sender,
  });

  final String id;
  final String conversationId;
  final String senderId;
  final String type;
  final String content;
  final bool isRead;
  final DateTime createdAt;
  final MessageSender? sender;

  factory Message.fromJson(Map<String, dynamic> json) {
    return Message(
      id: json['id']?.toString() ?? '',
      conversationId: json['conversationId']?.toString() ?? '',
      senderId: json['senderId']?.toString() ?? '',
      type: json['type']?.toString() ?? 'TEXT',
      content: json['content']?.toString() ?? '',
      isRead: json['isRead'] == true,
      createdAt: DateTime.tryParse(
            json['createdAt']?.toString() ?? '',
          ) ??
          DateTime.now(),
      sender: _parseSender(json['sender']),
    );
  }

  static MessageSender? _parseSender(dynamic value) {
    if (value is Map) {
      return MessageSender.fromJson(
        Map<String, dynamic>.from(value),
      );
    }

    return null;
  }
}

class MessageSender {
  const MessageSender({
    required this.id,
    required this.firstName,
    required this.lastName,
    this.profileImage,
  });

  final String id;
  final String firstName;
  final String lastName;
  final String? profileImage;

  String get displayName {
    final name = '$firstName $lastName'.trim();

    if (name.isNotEmpty) {
      return name;
    }

    return 'User';
  }

  factory MessageSender.fromJson(Map<String, dynamic> json) {
    return MessageSender(
      id: json['id']?.toString() ?? '',
      firstName: json['firstName']?.toString() ?? '',
      lastName: json['lastName']?.toString() ?? '',
      profileImage: json['profileImage']?.toString(),
    );
  }
}
