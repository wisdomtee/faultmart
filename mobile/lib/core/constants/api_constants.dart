class ApiConstants {
  ApiConstants._();

  static const String baseUrl = 'https://faultmart-backend.onrender.com';
  static const String webAppUrl = 'https://faultmart.vercel.app';

  static const String home = '$baseUrl/api/home';

  // Auth
  static const String register = '$baseUrl/api/auth/register';
  static const String login = '$baseUrl/api/auth/login';
  static const String refresh = '$baseUrl/api/auth/refresh';
  static const String logout = '$baseUrl/api/auth/logout';
  static const String me = '$baseUrl/api/auth/me';
  static const String categories = '$baseUrl/api/categories';
  static const String forgotPassword = '$baseUrl/api/auth/forgot-password';
  static const String resetPassword = '$baseUrl/api/auth/reset-password';

  // AI
  static const String listingAssistant = '$baseUrl/api/ai/listing-assistant';

  // Listings
  static const String listings = '$baseUrl/api/listings';
  static String updateListing(String id) => '$listings/$id';
  static const String myListings = '$listings/me';

  static String listingBySlug(String slug) => '$listings/$slug';

  static String listingById(String id) => '$listings/id/$id';

  // Offers
  static const String offers = '$baseUrl/api/offers';
  static const String myOffers = '$offers/my';
  static const String receivedOffers = '$offers/received';

  static String acceptOffer(String id) => '$offers/$id/accept';

  static String rejectOffer(String id) => '$offers/$id/reject';

  static String withdrawOffer(String id) => '$offers/$id/withdraw';

  // Favorites
  static const String favorites = '$baseUrl/api/favorites';

  static String favoriteCheck(String listingId) =>
      '$favorites/check/$listingId';

  static String favoriteByListing(String listingId) => '$favorites/$listingId';

  // Orders
  static const String orders = '$baseUrl/api/orders';

  static String orderById(String orderId) => '$orders/$orderId';

  static String confirmOrderReceipt(String orderId) =>
      '$orders/$orderId/confirm-receipt';

  static String cancelOrder(String orderId) => '$orders/$orderId/cancel';

  static String updateOrderStatus(String orderId) => '$orders/$orderId/status';

  // Reviews
  static const String reviews = '$baseUrl/api/reviews';

  static String reviewsByUser(String userId) => '$reviews/user/$userId';

  static String reviewSummary(String userId) => '$reviews/summary/$userId';

  static String reviewById(String reviewId) => '$reviews/$reviewId';

  // Conversations
  static const String conversations = '$baseUrl/api/conversations';

  static String conversationById(String conversationId) =>
      '$conversations/$conversationId';

  // Messages
  static const String messages = '$baseUrl/api/messages';

  static String conversationMessages(String conversationId) =>
      '$messages/$conversationId';

  static String markMessageRead(String messageId) =>
      '$messages/$messageId/read';

  static String deleteMessage(String messageId) => '$messages/$messageId';


  // Notifications
  static const String notifications = '$baseUrl/api/notifications';

  static const String notificationUnreadCount =
      '$notifications/unread-count';

  static String markNotificationRead(String notificationId) =>
      '$notifications/$notificationId/read';

  static const String markAllNotificationsRead =
      '$notifications/read-all';

  static String deleteNotification(String notificationId) =>
      '$notifications/$notificationId';
}
