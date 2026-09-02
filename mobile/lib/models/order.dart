class OrderUser {
  final String id;
  final String firstName;
  final String lastName;
  final String? username;
  final String? profileImage;
  final String? email;
  final String? phone;

  const OrderUser({
    required this.id,
    required this.firstName,
    required this.lastName,
    this.username,
    this.profileImage,
    this.email,
    this.phone,
  });

  factory OrderUser.fromJson(Map<String, dynamic> json) {
    return OrderUser(
      id: json['id']?.toString() ?? '',
      firstName: json['firstName']?.toString() ?? '',
      lastName: json['lastName']?.toString() ?? '',
      username: json['username']?.toString(),
      profileImage: json['profileImage']?.toString(),
      email: json['email']?.toString(),
      phone: json['phone']?.toString(),
    );
  }

  String get displayName {
    final name = '$firstName $lastName'.trim();
    if (name.isNotEmpty) return name;
    if (username != null && username!.trim().isNotEmpty) {
      return username!;
    }
    return 'FaultMart User';
  }
}

class OrderListingImage {
  final String id;
  final String url;

  const OrderListingImage({
    required this.id,
    required this.url,
  });

  factory OrderListingImage.fromJson(Map<String, dynamic> json) {
    return OrderListingImage(
      id: json['id']?.toString() ?? '',
      url: json['url']?.toString() ??
          json['secureUrl']?.toString() ??
          json['imageUrl']?.toString() ??
          '',
    );
  }
}

class OrderListing {
  final String id;
  final String title;
  final String? slug;
  final String? description;
  final String? price;
  final String? currency;
  final List<OrderListingImage> images;

  const OrderListing({
    required this.id,
    required this.title,
    this.slug,
    this.description,
    this.price,
    this.currency,
    this.images = const [],
  });

  factory OrderListing.fromJson(Map<String, dynamic> json) {
    final rawImages = json['images'];

    return OrderListing(
      id: json['id']?.toString() ?? '',
      title: json['title']?.toString() ??
          json['name']?.toString() ??
          'Untitled listing',
      slug: json['slug']?.toString(),
      description: json['description']?.toString(),
      price: json['price']?.toString(),
      currency: json['currency']?.toString(),
      images: rawImages is List
          ? rawImages
              .whereType<Map>()
              .map(
                (image) => OrderListingImage.fromJson(
                  Map<String, dynamic>.from(image),
                ),
              )
              .toList()
          : const [],
    );
  }

  String? get primaryImage {
    for (final image in images) {
      if (image.url.trim().isNotEmpty) {
        return image.url;
      }
    }
    return null;
  }
}

class OrderDelivery {
  final String id;
  final String status;
  final String? courier;
  final String? trackingCode;
  final String? pickupDate;
  final String? deliveredAt;

  const OrderDelivery({
    required this.id,
    required this.status,
    this.courier,
    this.trackingCode,
    this.pickupDate,
    this.deliveredAt,
  });

  factory OrderDelivery.fromJson(Map<String, dynamic> json) {
    return OrderDelivery(
      id: json['id']?.toString() ?? '',
      status: json['status']?.toString() ?? 'PENDING',
      courier: json['courier']?.toString(),
      trackingCode: json['trackingCode']?.toString(),
      pickupDate: json['pickupDate']?.toString(),
      deliveredAt: json['deliveredAt']?.toString(),
    );
  }
}

class OrderReviewStatus {
  final bool canReview;
  final bool hasReviewed;
  final String type;
  final String? reviewId;

  const OrderReviewStatus({
    required this.canReview,
    required this.hasReviewed,
    required this.type,
    this.reviewId,
  });

  factory OrderReviewStatus.fromJson(Map<String, dynamic>? json) {
    return OrderReviewStatus(
      canReview: json?['canReview'] == true,
      hasReviewed: json?['hasReviewed'] == true,
      type: json?['type']?.toString() ?? 'BUYER_TO_SELLER',
      reviewId: json?['reviewId']?.toString(),
    );
  }

  bool get isBuyerReview => type == 'BUYER_TO_SELLER';

  String get actionLabel {
    return isBuyerReview ? 'Review Seller' : 'Review Buyer';
  }

  String get revieweeLabel {
    return isBuyerReview ? 'seller' : 'buyer';
  }
}

class Order {
  final String id;
  final String listingId;
  final String buyerId;
  final String sellerId;
  final String? offerId;
  final String amount;
  final String currency;
  final String status;
  final String? shippingAddress;
  final String createdAt;
  final String updatedAt;
  final OrderListing? listing;
  final OrderUser? buyer;
  final OrderUser? seller;
  final OrderDelivery? delivery;
  final OrderReviewStatus reviewStatus;

  const Order({
    required this.id,
    required this.listingId,
    required this.buyerId,
    required this.sellerId,
    this.offerId,
    required this.amount,
    required this.currency,
    required this.status,
    this.shippingAddress,
    required this.createdAt,
    required this.updatedAt,
    this.listing,
    this.buyer,
    this.seller,
    this.delivery,
    required this.reviewStatus,
  });

  factory Order.fromJson(Map<String, dynamic> json) {
    return Order(
      id: json['id']?.toString() ?? '',
      listingId: json['listingId']?.toString() ?? '',
      buyerId: json['buyerId']?.toString() ?? '',
      sellerId: json['sellerId']?.toString() ?? '',
      offerId: json['offerId']?.toString(),
      amount: json['amount']?.toString() ?? '0',
      currency: json['currency']?.toString() ?? 'NGN',
      status: json['status']?.toString() ?? 'PENDING',
      shippingAddress: json['shippingAddress']?.toString(),
      createdAt: json['createdAt']?.toString() ?? '',
      updatedAt: json['updatedAt']?.toString() ?? '',
      listing: json['listing'] is Map
          ? OrderListing.fromJson(
              Map<String, dynamic>.from(json['listing']),
            )
          : null,
      buyer: json['buyer'] is Map
          ? OrderUser.fromJson(
              Map<String, dynamic>.from(json['buyer']),
            )
          : null,
      seller: json['seller'] is Map
          ? OrderUser.fromJson(
              Map<String, dynamic>.from(json['seller']),
            )
          : null,
      delivery: json['delivery'] is Map
          ? OrderDelivery.fromJson(
              Map<String, dynamic>.from(json['delivery']),
            )
          : null,
      reviewStatus: OrderReviewStatus.fromJson(
        json['reviewStatus'] is Map
            ? Map<String, dynamic>.from(json['reviewStatus'])
            : null,
      ),
    );
  }

  bool get isBuyer {
    return reviewStatus.type == 'BUYER_TO_SELLER';
  }

  bool get isSeller {
    return reviewStatus.type == 'SELLER_TO_BUYER';
  }

  bool isBuyerFor(String userId) {
    return buyerId == userId;
  }

  bool isSellerFor(String userId) {
    return sellerId == userId;
  }

  OrderUser? get otherParty {
    return isBuyer ? seller : buyer;
  }

  OrderUser? otherPartyFor(String userId) {
    return isBuyerFor(userId) ? seller : buyer;
  }

  String get statusLabel {
    switch (status) {
      case 'PENDING':
        return 'Pending';
      case 'CONFIRMED':
        return 'Confirmed';
      case 'PROCESSING':
        return 'Processing';
      case 'SHIPPED':
        return 'Shipped';
      case 'DELIVERED':
        return 'Delivered';
      case 'CANCELLED':
        return 'Cancelled';
      case 'REFUNDED':
        return 'Refunded';
      default:
        return status;
    }
  }

  String get formattedAmount {
    final value = double.tryParse(amount);
    if (value == null) return '$currency $amount';

    final formatted = value.toStringAsFixed(2);
    return '$currency $formatted';
  }
}
