import 'dart:convert';

import 'package:http/http.dart' as http;

import '../core/constants/api_constants.dart';
import '../models/review.dart';
import 'auth_storage.dart';

class ReviewService {
  ReviewService._();

  static Future<String> _token() async {
    final token = await AuthStorage.getAccessToken();

    if (token == null || token.isEmpty) {
      throw Exception('You must be logged in to manage reviews.');
    }

    return token;
  }

  static Future<ReviewPage> getUserReviews(
    String userId, {
    int page = 1,
    int limit = 20,
  }) async {
    final response = await http.get(
      Uri.parse(ApiConstants.reviewsByUser(userId)).replace(
        queryParameters: {'page': page.toString(), 'limit': limit.toString()},
      ),
      headers: const {'Accept': 'application/json'},
    );

    final decoded = _decode(response);

    if (!_isSuccess(response.statusCode)) {
      throw Exception(
        decoded['message']?.toString() ?? 'Failed to retrieve reviews.',
      );
    }

    final data = decoded['data'];

    if (data is! Map<String, dynamic>) {
      throw Exception('Invalid reviews data returned by server.');
    }

    return ReviewPage.fromJson(data);
  }

  static Future<RatingSummary> getRatingSummary(String userId) async {
    final response = await http.get(
      Uri.parse(ApiConstants.reviewSummary(userId)),
      headers: const {'Accept': 'application/json'},
    );

    final decoded = _decode(response);

    if (!_isSuccess(response.statusCode)) {
      throw Exception(
        decoded['message']?.toString() ?? 'Failed to retrieve rating summary.',
      );
    }

    final data = decoded['data'];

    if (data is! Map<String, dynamic>) {
      throw Exception('Invalid rating summary returned by server.');
    }

    return RatingSummary.fromJson(data);
  }

  static Future<Review> createReview({
    required String orderId,
    required int rating,
    required String type,
    String? comment,
  }) async {
    if (rating < 1 || rating > 5) {
      throw Exception('Rating must be between 1 and 5.');
    }

    final token = await _token();

    final body = <String, dynamic>{
      'orderId': orderId,
      'rating': rating,
      'type': type,
    };

    if (comment != null && comment.trim().isNotEmpty) {
      body['comment'] = comment.trim();
    }

    final response = await http.post(
      Uri.parse(ApiConstants.reviews),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode(body),
    );

    final decoded = _decode(response);

    if (!_isSuccess(response.statusCode)) {
      throw Exception(
        decoded['message']?.toString() ?? 'Failed to create review.',
      );
    }

    final data = decoded['data'];

    if (data is! Map<String, dynamic>) {
      throw Exception('Invalid review data returned by server.');
    }

    return Review.fromJson(data);
  }

  static Future<Review> updateReview({
    required String reviewId,
    int? rating,
    String? comment,
  }) async {
    final token = await _token();

    final body = <String, dynamic>{};

    if (rating != null) {
      if (rating < 1 || rating > 5) {
        throw Exception('Rating must be between 1 and 5.');
      }

      body['rating'] = rating;
    }

    if (comment != null) {
      body['comment'] = comment.trim();
    }

    if (body.isEmpty) {
      throw Exception('Nothing to update.');
    }

    final response = await http.patch(
      Uri.parse(ApiConstants.reviewById(reviewId)),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode(body),
    );

    final decoded = _decode(response);

    if (!_isSuccess(response.statusCode)) {
      throw Exception(
        decoded['message']?.toString() ?? 'Failed to update review.',
      );
    }

    final data = decoded['data'];

    if (data is! Map<String, dynamic>) {
      throw Exception('Invalid review data returned by server.');
    }

    return Review.fromJson(data);
  }

  static Future<void> deleteReview(String reviewId) async {
    final token = await _token();

    final response = await http.delete(
      Uri.parse(ApiConstants.reviewById(reviewId)),
      headers: {'Accept': 'application/json', 'Authorization': 'Bearer $token'},
    );

    final decoded = _decode(response);

    if (!_isSuccess(response.statusCode)) {
      throw Exception(
        decoded['message']?.toString() ?? 'Failed to delete review.',
      );
    }
  }

  static bool _isSuccess(int statusCode) {
    return statusCode >= 200 && statusCode < 300;
  }

  static Map<String, dynamic> _decode(http.Response response) {
    try {
      final decoded = jsonDecode(response.body);

      if (decoded is Map<String, dynamic>) {
        return decoded;
      }

      throw Exception('Invalid server response.');
    } catch (_) {
      throw Exception(
        'Invalid server response. Status: ${response.statusCode}.',
      );
    }
  }
}
