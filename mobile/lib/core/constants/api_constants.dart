class ApiConstants {
  ApiConstants._();

  static const String baseUrl = 'https://faultmart-backend.onrender.com';
  static const String webAppUrl = 'https://faultmart.vercel.app';

  static const String home = '$baseUrl/api/home';

  static const String register = '$baseUrl/api/auth/register';
  static const String login = '$baseUrl/api/auth/login';
  static const String refresh = '$baseUrl/api/auth/refresh';
  static const String logout = '$baseUrl/api/auth/logout';
  static const String me = '$baseUrl/api/auth/me';
  static const String listings = '$baseUrl/api/listings';

  static String listingBySlug(String slug) => '$listings/$slug';

  static String listingById(String id) => '$listings/id/$id';

  static const String favorites = '$baseUrl/api/favorites';

  static String favoriteCheck(String listingId) =>
      '$favorites/check/$listingId';

  static String favoriteByListing(String listingId) => '$favorites/$listingId';

  // Reviews
  static const String orders = '$baseUrl/api/orders';
  static String orderById(String orderId) => '$orders/$orderId';
  static String confirmOrderReceipt(String orderId) => '$orders/$orderId/confirm-receipt';
  static String cancelOrder(String orderId) => '$orders/$orderId/cancel';
  static String updateOrderStatus(String orderId) => '$orders/$orderId/status';

  static const String reviews = '$baseUrl/api/reviews';

  static String reviewsByUser(String userId) => '$reviews/user/$userId';

  static String reviewSummary(String userId) => '$reviews/summary/$userId';

  static String reviewById(String reviewId) => '$reviews/$reviewId';
}
