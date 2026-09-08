import 'listing.dart';

enum OfferStatus {
  pending,
  accepted,
  rejected,
  withdrawn,
  unknown,
}

class Offer {
  const Offer({
    required this.id,
    required this.listingId,
    required this.buyerId,
    required this.sellerId,
    required this.amount,
    required this.status,
    required this.message,
    required this.createdAt,
    required this.updatedAt,
    required this.listing,
    required this.buyer,
  });

  final String id;
  final String listingId;
  final String buyerId;
  final String sellerId;
  final double amount;
  final OfferStatus status;
  final String? message;
  final DateTime? createdAt;
  final DateTime? updatedAt;
  final Listing? listing;
  final OfferUser? buyer;

  bool get isPending => status == OfferStatus.pending;

  bool get isAccepted => status == OfferStatus.accepted;

  bool get isRejected => status == OfferStatus.rejected;

  bool get isWithdrawn => status == OfferStatus.withdrawn;

  factory Offer.fromJson(Map<String, dynamic> json) {
    return Offer(
      id: json['id']?.toString() ?? '',
      listingId: json['listingId']?.toString() ?? '',
      buyerId: json['buyerId']?.toString() ?? '',
      sellerId: json['sellerId']?.toString() ?? '',
      amount: _toDouble(json['amount']),
      status: _parseStatus(json['status']),
      message: json['message']?.toString(),
      createdAt: _parseDate(json['createdAt']),
      updatedAt: _parseDate(json['updatedAt']),
      listing: _parseListing(json['listing']),
      buyer: _parseBuyer(json['buyer']),
    );
  }

  static double _toDouble(dynamic value) {
    if (value is num) {
      return value.toDouble();
    }

    return double.tryParse(value?.toString() ?? '') ?? 0;
  }

  static DateTime? _parseDate(dynamic value) {
    if (value == null) {
      return null;
    }

    return DateTime.tryParse(value.toString());
  }

  static OfferStatus _parseStatus(dynamic value) {
    switch (value?.toString().toUpperCase()) {
      case 'PENDING':
        return OfferStatus.pending;
      case 'ACCEPTED':
        return OfferStatus.accepted;
      case 'REJECTED':
        return OfferStatus.rejected;
      case 'WITHDRAWN':
        return OfferStatus.withdrawn;
      default:
        return OfferStatus.unknown;
    }
  }

  static Listing? _parseListing(dynamic value) {
    if (value is Map<String, dynamic>) {
      return Listing.fromJson(value);
    }

    return null;
  }

  static OfferUser? _parseBuyer(dynamic value) {
    if (value is Map<String, dynamic>) {
      return OfferUser.fromJson(value);
    }

    return null;
  }
}

class OfferUser {
  const OfferUser({
    required this.id,
    required this.firstName,
    required this.lastName,
    required this.username,
    required this.profileImage,
  });

  final String id;
  final String firstName;
  final String lastName;
  final String? username;
  final String? profileImage;

  String get displayName {
    final fullName = '$firstName $lastName'.trim();

    if (fullName.isNotEmpty) {
      return fullName;
    }

    return username ?? 'Buyer';
  }

  factory OfferUser.fromJson(Map<String, dynamic> json) {
    return OfferUser(
      id: json['id']?.toString() ?? '',
      firstName: json['firstName']?.toString() ?? '',
      lastName: json['lastName']?.toString() ?? '',
      username: json['username']?.toString(),
      profileImage: json['profileImage']?.toString(),
    );
  }
}
