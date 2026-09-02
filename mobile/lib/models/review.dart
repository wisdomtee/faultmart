class ReviewUser {
  const ReviewUser({
    required this.id,
    this.firstName,
    this.lastName,
    this.username,
    this.profileImage,
  });

  final String id;
  final String? firstName;
  final String? lastName;
  final String? username;
  final String? profileImage;

  factory ReviewUser.fromJson(Map<String, dynamic> json) {
    return ReviewUser(
      id: json['id']?.toString() ?? '',
      firstName: json['firstName']?.toString(),
      lastName: json['lastName']?.toString(),
      username: json['username']?.toString(),
      profileImage: json['profileImage']?.toString(),
    );
  }

  String get displayName {
    final name = [firstName, lastName]
        .where((value) => value != null && value.trim().isNotEmpty)
        .join(' ')
        .trim();

    if (name.isNotEmpty) return name;
    if (username != null && username!.trim().isNotEmpty) return username!;
    return 'FaultMart User';
  }
}

class Review {
  const Review({
    required this.id,
    required this.orderId,
    required this.reviewerId,
    required this.revieweeId,
    required this.listingId,
    required this.rating,
    required this.type,
    this.comment,
    this.reviewer,
    this.reviewee,
    this.listing,
    this.createdAt,
    this.updatedAt,
  });

  final String id;
  final String orderId;
  final String reviewerId;
  final String revieweeId;
  final String listingId;
  final int rating;
  final String type;
  final String? comment;
  final ReviewUser? reviewer;
  final ReviewUser? reviewee;
  final Map<String, dynamic>? listing;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  factory Review.fromJson(Map<String, dynamic> json) {
    return Review(
      id: json['id']?.toString() ?? '',
      orderId: json['orderId']?.toString() ?? '',
      reviewerId: json['reviewerId']?.toString() ?? '',
      revieweeId: json['revieweeId']?.toString() ?? '',
      listingId: json['listingId']?.toString() ?? '',
      rating: (json['rating'] as num?)?.toInt() ?? 0,
      type: json['type']?.toString() ?? '',
      comment: json['comment']?.toString(),
      reviewer: json['reviewer'] is Map<String, dynamic>
          ? ReviewUser.fromJson(json['reviewer'] as Map<String, dynamic>)
          : null,
      reviewee: json['reviewee'] is Map<String, dynamic>
          ? ReviewUser.fromJson(json['reviewee'] as Map<String, dynamic>)
          : null,
      listing: json['listing'] is Map<String, dynamic>
          ? Map<String, dynamic>.from(json['listing'] as Map)
          : null,
      createdAt: DateTime.tryParse(json['createdAt']?.toString() ?? ''),
      updatedAt: DateTime.tryParse(json['updatedAt']?.toString() ?? ''),
    );
  }
}

class ReviewPage {
  const ReviewPage({
    required this.items,
    required this.page,
    required this.limit,
    required this.total,
    required this.totalPages,
    required this.hasNext,
    required this.hasPrev,
  });

  final List<Review> items;
  final int page;
  final int limit;
  final int total;
  final int totalPages;
  final bool hasNext;
  final bool hasPrev;

  factory ReviewPage.fromJson(Map<String, dynamic> json) {
    final rawItems = json['items'];

    final pagination = json['pagination'] is Map<String, dynamic>
        ? json['pagination'] as Map<String, dynamic>
        : <String, dynamic>{};

    return ReviewPage(
      items: rawItems is List
          ? rawItems
                .whereType<Map>()
                .map((item) => Review.fromJson(Map<String, dynamic>.from(item)))
                .toList()
          : const [],
      page: (pagination['page'] as num?)?.toInt() ?? 1,
      limit: (pagination['limit'] as num?)?.toInt() ?? 20,
      total: (pagination['total'] as num?)?.toInt() ?? 0,
      totalPages: (pagination['totalPages'] as num?)?.toInt() ?? 0,
      hasNext: pagination['hasNext'] == true,
      hasPrev: pagination['hasPrev'] == true,
    );
  }
}

class RatingSummary {
  const RatingSummary({
    required this.averageRating,
    required this.totalReviews,
    this.fiveStar = 0,
    this.fourStar = 0,
    this.threeStar = 0,
    this.twoStar = 0,
    this.oneStar = 0,
  });

  final double averageRating;
  final int totalReviews;
  final int fiveStar;
  final int fourStar;
  final int threeStar;
  final int twoStar;
  final int oneStar;

  factory RatingSummary.fromJson(Map<String, dynamic> json) {
    double readDouble(String key) {
      final value = json[key];
      if (value is num) return value.toDouble();
      return double.tryParse(value?.toString() ?? '') ?? 0;
    }

    int readInt(String key) {
      final value = json[key];
      if (value is num) return value.toInt();
      return int.tryParse(value?.toString() ?? '') ?? 0;
    }

    return RatingSummary(
      averageRating: readDouble('averageRating'),
      totalReviews: readInt('totalReviews'),
      fiveStar: readInt('fiveStar'),
      fourStar: readInt('fourStar'),
      threeStar: readInt('threeStar'),
      twoStar: readInt('twoStar'),
      oneStar: readInt('oneStar'),
    );
  }
}
