class Listing {
  const Listing({
    required this.id,
    required this.title,
    required this.slug,
    required this.description,
    required this.price,
    required this.currency,
    required this.condition,
    required this.faultSeverity,
    required this.faultDescription,
    required this.location,
    required this.state,
    required this.city,
    required this.isNegotiable,
    required this.status,
    required this.views,
    required this.category,
    required this.images,
    required this.seller,
  });

  final String id;
  final String title;
  final String slug;
  final String description;
  final double price;
  final String currency;
  final String? condition;
  final String? faultSeverity;
  final String? faultDescription;
  final String? location;
  final String? state;
  final String? city;
  final bool isNegotiable;
  final String status;
  final int views;
  final ListingCategory? category;
  final List<ListingImage> images;
  final ListingSeller? seller;

  factory Listing.fromJson(Map<String, dynamic> json) {
    return Listing(
      id: json['id']?.toString() ?? '',
      title: json['title']?.toString() ?? '',
      slug: json['slug']?.toString() ?? '',
      description: json['description']?.toString() ?? '',
      price: _toDouble(json['price']),
      currency: json['currency']?.toString() ?? 'NGN',
      condition: json['condition']?.toString(),
      faultSeverity: json['faultSeverity']?.toString(),
      faultDescription: json['faultDescription']?.toString(),
      location: json['location']?.toString(),
      state: json['state']?.toString(),
      city: json['city']?.toString(),
      isNegotiable: json['isNegotiable'] == true,
      status: json['status']?.toString() ?? '',
      views: _toInt(json['views']),
      category: _parseCategory(json['category']),
      images: _parseImages(json['images']),
      seller: _parseSeller(json['seller']),
    );
  }

  static double _toDouble(dynamic value) {
    if (value is num) {
      return value.toDouble();
    }

    return double.tryParse(value?.toString() ?? '') ?? 0;
  }

  static int _toInt(dynamic value) {
    if (value is num) {
      return value.toInt();
    }

    return int.tryParse(value?.toString() ?? '') ?? 0;
  }

  static ListingCategory? _parseCategory(dynamic value) {
    if (value is Map<String, dynamic>) {
      return ListingCategory.fromJson(value);
    }

    return null;
  }

  static List<ListingImage> _parseImages(dynamic value) {
    if (value is! List) {
      return const [];
    }

    return value
        .whereType<Map<String, dynamic>>()
        .map(ListingImage.fromJson)
        .toList();
  }

  static ListingSeller? _parseSeller(dynamic value) {
    if (value is Map<String, dynamic>) {
      return ListingSeller.fromJson(value);
    }

    return null;
  }
}

class ListingCategory {
  const ListingCategory({
    required this.id,
    required this.name,
    required this.slug,
  });

  final String id;
  final String name;
  final String slug;

  factory ListingCategory.fromJson(Map<String, dynamic> json) {
    return ListingCategory(
      id: json['id']?.toString() ?? '',
      name: json['name']?.toString() ?? '',
      slug: json['slug']?.toString() ?? '',
    );
  }
}

class ListingImage {
  const ListingImage({
    required this.id,
    required this.url,
    required this.publicId,
    required this.position,
  });

  final String id;
  final String url;
  final String publicId;
  final int position;

  factory ListingImage.fromJson(Map<String, dynamic> json) {
    return ListingImage(
      id: json['id']?.toString() ?? '',
      url: json['url']?.toString() ?? '',
      publicId: json['publicId']?.toString() ?? '',
      position: Listing._toInt(json['position']),
    );
  }
}

class ListingSeller {
  const ListingSeller({
    required this.id,
    required this.firstName,
    required this.lastName,
    required this.username,
    required this.profileImage,
    required this.verificationStatus,
  });

  final String id;
  final String firstName;
  final String lastName;
  final String? username;
  final String? profileImage;
  final String? verificationStatus;

  String get displayName {
    final fullName = '$firstName $lastName'.trim();

    if (fullName.isNotEmpty) {
      return fullName;
    }

    return username ?? 'Seller';
  }

  factory ListingSeller.fromJson(Map<String, dynamic> json) {
    return ListingSeller(
      id: json['id']?.toString() ?? '',
      firstName: json['firstName']?.toString() ?? '',
      lastName: json['lastName']?.toString() ?? '',
      username: json['username']?.toString(),
      profileImage: json['profileImage']?.toString(),
      verificationStatus: json['verificationStatus']?.toString(),
    );
  }
}

class ListingPagination {
  const ListingPagination({
    required this.page,
    required this.limit,
    required this.total,
    required this.totalPages,
    required this.hasNext,
    required this.hasPrev,
  });

  final int page;
  final int limit;
  final int total;
  final int totalPages;
  final bool hasNext;
  final bool hasPrev;

  factory ListingPagination.fromJson(Map<String, dynamic> json) {
    return ListingPagination(
      page: Listing._toInt(json['page']),
      limit: Listing._toInt(json['limit']),
      total: Listing._toInt(json['total']),
      totalPages: Listing._toInt(json['totalPages']),
      hasNext: json['hasNext'] == true,
      hasPrev: json['hasPrev'] == true,
    );
  }
}

class ListingPage {
  const ListingPage({required this.items, required this.pagination});

  final List<Listing> items;
  final ListingPagination pagination;

  factory ListingPage.fromJson(Map<String, dynamic> json) {
    final rawItems = json['items'];

    final items = rawItems is List
        ? rawItems
              .whereType<Map<String, dynamic>>()
              .map(Listing.fromJson)
              .toList()
        : const <Listing>[];

    final rawPagination = json['pagination'];

    return ListingPage(
      items: items,
      pagination: rawPagination is Map<String, dynamic>
          ? ListingPagination.fromJson(rawPagination)
          : const ListingPagination(
              page: 1,
              limit: 20,
              total: 0,
              totalPages: 0,
              hasNext: false,
              hasPrev: false,
            ),
    );
  }
}
