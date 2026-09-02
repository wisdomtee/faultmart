import 'listing.dart';

class HomepageData {
  const HomepageData({
    required this.featured,
    required this.latest,
    required this.popular,
    required this.categories,
    required this.statistics,
  });

  final List<Listing> featured;
  final List<Listing> latest;
  final List<Listing> popular;
  final List<HomepageCategory> categories;
  final HomepageStatistics statistics;

  factory HomepageData.fromJson(Map<String, dynamic> json) {
    return HomepageData(
      featured: _parseListings(json['featured']),
      latest: _parseListings(json['latest']),
      popular: _parseListings(json['popular']),
      categories: _parseCategories(json['categories']),
      statistics: json['statistics'] is Map<String, dynamic>
          ? HomepageStatistics.fromJson(
              json['statistics'] as Map<String, dynamic>,
            )
          : const HomepageStatistics(
              users: 0,
              listings: 0,
              sold: 0,
              reviews: 0,
            ),
    );
  }

  static List<Listing> _parseListings(dynamic value) {
    if (value is! List) {
      return const [];
    }

    return value
        .whereType<Map<String, dynamic>>()
        .map(Listing.fromJson)
        .toList();
  }

  static List<HomepageCategory> _parseCategories(dynamic value) {
    if (value is! List) {
      return const [];
    }

    return value
        .whereType<Map<String, dynamic>>()
        .map(HomepageCategory.fromJson)
        .toList();
  }
}

class HomepageCategory {
  const HomepageCategory({
    required this.id,
    required this.name,
    required this.slug,
    required this.description,
    required this.type,
    required this.image,
    required this.isActive,
    required this.icon,
    required this.isFeatured,
    required this.sortOrder,
    required this.listingCount,
  });

  final String id;
  final String name;
  final String slug;
  final String? description;
  final String? type;
  final String? image;
  final bool isActive;
  final String? icon;
  final bool isFeatured;
  final int sortOrder;
  final int listingCount;

  factory HomepageCategory.fromJson(Map<String, dynamic> json) {
    final count = json['_count'];

    return HomepageCategory(
      id: json['id']?.toString() ?? '',
      name: json['name']?.toString() ?? '',
      slug: json['slug']?.toString() ?? '',
      description: json['description']?.toString(),
      type: json['type']?.toString(),
      image: json['image']?.toString(),
      isActive: json['isActive'] == true,
      icon: json['icon']?.toString(),
      isFeatured: json['isFeatured'] == true,
      sortOrder: _toInt(json['sortOrder']),
      listingCount: count is Map<String, dynamic>
          ? _toInt(count['listings'])
          : 0,
    );
  }

  static int _toInt(dynamic value) {
    if (value is num) {
      return value.toInt();
    }

    return int.tryParse(value?.toString() ?? '') ?? 0;
  }
}

class HomepageStatistics {
  const HomepageStatistics({
    required this.users,
    required this.listings,
    required this.sold,
    required this.reviews,
  });

  final int users;
  final int listings;
  final int sold;
  final int reviews;

  factory HomepageStatistics.fromJson(Map<String, dynamic> json) {
    return HomepageStatistics(
      users: _toInt(json['users']),
      listings: _toInt(json['listings']),
      sold: _toInt(json['sold']),
      reviews: _toInt(json['reviews']),
    );
  }

  static int _toInt(dynamic value) {
    if (value is num) {
      return value.toInt();
    }

    return int.tryParse(value?.toString() ?? '') ?? 0;
  }
}
