import 'listing.dart';
import 'message.dart';

class Conversation {
  const Conversation({
    required this.id,
    required this.listingId,
    this.listing,
    required this.participants,
    this.latestMessage,
  });

  final String id;
  final String listingId;
  final Listing? listing;
  final List<ConversationParticipant> participants;
  final Message? latestMessage;

  factory Conversation.fromJson(Map<String, dynamic> json) {
    return Conversation(
      id: json['id']?.toString() ?? '',
      listingId: json['listingId']?.toString() ?? '',
      listing: _parseListing(json['listing']),
      participants: _parseParticipants(json['participants']),
      latestMessage: _parseLatestMessage(json['messages']),
    );
  }

  static Listing? _parseListing(dynamic value) {
    if (value is Map) {
      return Listing.fromJson(
        Map<String, dynamic>.from(value),
      );
    }

    return null;
  }

  static List<ConversationParticipant> _parseParticipants(
    dynamic value,
  ) {
    if (value is! List) {
      return const [];
    }

    return value
        .whereType<Map>()
        .map(
          (item) => ConversationParticipant.fromJson(
            Map<String, dynamic>.from(item),
          ),
        )
        .toList();
  }

  static Message? _parseLatestMessage(dynamic value) {
    if (value is List && value.isNotEmpty) {
      final latest = value.first;

      if (latest is Map) {
        return Message.fromJson(
          Map<String, dynamic>.from(latest),
        );
      }
    }

    return null;
  }

  ConversationParticipant? participantFor(String userId) {
    for (final participant in participants) {
      if (participant.user?.id == userId) {
        return participant;
      }
    }

    return null;
  }

  ConversationParticipant? otherParticipant(String userId) {
    for (final participant in participants) {
      if (participant.user?.id != userId) {
        return participant;
      }
    }

    return null;
  }
}

class ConversationParticipant {
  const ConversationParticipant({
    required this.id,
    required this.userId,
    this.user,
  });

  final String id;
  final String userId;
  final ConversationUser? user;

  factory ConversationParticipant.fromJson(
    Map<String, dynamic> json,
  ) {
    final rawUser = json['user'];

    return ConversationParticipant(
      id: json['id']?.toString() ?? '',
      userId: json['userId']?.toString() ?? '',
      user: rawUser is Map
          ? ConversationUser.fromJson(
              Map<String, dynamic>.from(rawUser),
            )
          : null,
    );
  }
}

class ConversationUser {
  const ConversationUser({
    required this.id,
    required this.firstName,
    required this.lastName,
    this.username,
    this.profileImage,
  });

  final String id;
  final String firstName;
  final String lastName;
  final String? username;
  final String? profileImage;

  String get displayName {
    final name = '$firstName $lastName'.trim();

    if (name.isNotEmpty) {
      return name;
    }

    return username ?? 'User';
  }

  factory ConversationUser.fromJson(
    Map<String, dynamic> json,
  ) {
    return ConversationUser(
      id: json['id']?.toString() ?? '',
      firstName: json['firstName']?.toString() ?? '',
      lastName: json['lastName']?.toString() ?? '',
      username: json['username']?.toString(),
      profileImage: json['profileImage']?.toString(),
    );
  }
}
