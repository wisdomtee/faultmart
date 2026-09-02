import 'dart:convert';
import 'package:image_picker/image_picker.dart';

import 'package:http/http.dart' as http;

import '../core/constants/api_constants.dart';
import '../models/homepage.dart';
import '../models/listing.dart';
import 'auth_storage.dart';

class ListingService {
  ListingService._();

  /// Fetch all public homepage data from the FaultMart API.

  /// Fetch public listings from the FaultMart API.
  ///
  /// Supports:
  /// - pagination
  /// - search
  /// - category
  /// - state
  /// - city
  /// - price range
  /// - condition
  /// - fault severity
  /// - sorting

  static Future<HomepageData> getHomepage() async {
    final response = await http.get(
      Uri.parse(ApiConstants.home),
      headers: const {'Accept': 'application/json'},
    );

    dynamic decoded;

    try {
      decoded = jsonDecode(response.body);
    } catch (_) {
      throw Exception(
        'Invalid server response. Status: ${response.statusCode}.',
      );
    }

    if (response.statusCode < 200 || response.statusCode >= 300) {
      if (decoded is Map<String, dynamic>) {
        throw Exception(
          decoded['message']?.toString() ?? 'Failed to retrieve homepage.',
        );
      }

      throw Exception(
        'Failed to retrieve homepage. '
        'Status: ${response.statusCode}.',
      );
    }

    if (decoded is! Map<String, dynamic>) {
      throw Exception('Invalid server response.');
    }

    if (decoded['success'] != true) {
      throw Exception(
        decoded['message']?.toString() ?? 'Failed to retrieve homepage.',
      );
    }

    final data = decoded['data'];

    if (data is! Map<String, dynamic>) {
      throw Exception('Invalid homepage data returned by server.');
    }

    return HomepageData.fromJson(data);
  }

  static Future<ListingPage> getListings({
    int page = 1,
    int limit = 20,
    String? search,
    String? categoryId,
    String? state,
    String? city,
    double? minPrice,
    double? maxPrice,
    String? condition,
    String? faultSeverity,
    String? sort,
  }) async {
    final queryParameters = <String, String>{
      'page': page.toString(),
      'limit': limit.toString(),
    };

    void addParameter(String key, dynamic value) {
      if (value == null) return;

      final stringValue = value.toString().trim();

      if (stringValue.isNotEmpty) {
        queryParameters[key] = stringValue;
      }
    }

    addParameter('search', search);
    addParameter('categoryId', categoryId);
    addParameter('state', state);
    addParameter('city', city);
    addParameter('minPrice', minPrice);
    addParameter('maxPrice', maxPrice);
    addParameter('condition', condition);
    addParameter('faultSeverity', faultSeverity);
    addParameter('sort', sort);

    final uri = Uri.parse(
      ApiConstants.listings,
    ).replace(queryParameters: queryParameters);

    final response = await http.get(
      uri,
      headers: const {'Accept': 'application/json'},
    );

    dynamic decoded;

    try {
      decoded = jsonDecode(response.body);
    } catch (_) {
      throw Exception(
        'Invalid server response. Status: ${response.statusCode}.',
      );
    }

    if (response.statusCode < 200 || response.statusCode >= 300) {
      if (decoded is Map<String, dynamic>) {
        throw Exception(
          decoded['message']?.toString() ?? 'Failed to retrieve listings.',
        );
      }

      throw Exception(
        'Failed to retrieve listings. '
        'Status: ${response.statusCode}.',
      );
    }

    if (decoded is! Map<String, dynamic>) {
      throw Exception('Invalid server response.');
    }

    if (decoded['success'] != true) {
      throw Exception(
        decoded['message']?.toString() ?? 'Failed to retrieve listings.',
      );
    }

    final data = decoded['data'];

    if (data is! Map<String, dynamic>) {
      throw Exception('Invalid listings data returned by server.');
    }

    return ListingPage.fromJson(data);
  }

  /// Create a new listing with optional images.
  static Future<Listing> createListing({
    required String title,
    required String description,
    required String categoryId,
    required double price,
    String currency = 'NGN',
    required String condition,
    String? faultSeverity,
    String? faultDescription,
    String? location,
    String? state,
    String? city,
    bool negotiable = true,
    List<XFile> images = const [],
  }) async {
    final accessToken = await AuthStorage.getAccessToken();

    if (accessToken == null || accessToken.isEmpty) {
      throw Exception('You must be logged in to create a listing.');
    }

    final request = http.MultipartRequest(
      'POST',
      Uri.parse(ApiConstants.listings),
    );

    request.headers.addAll({
      'Authorization': 'Bearer $accessToken',
      'Accept': 'application/json',
    });

    request.fields.addAll({
      'title': title,
      'description': description,
      'categoryId': categoryId,
      'price': price.toString(),
      'currency': currency,
      'condition': condition,
      'negotiable': negotiable.toString(),
    });

    if (faultSeverity != null && faultSeverity.trim().isNotEmpty) {
      request.fields['faultSeverity'] = faultSeverity.trim();
    }

    if (faultDescription != null && faultDescription.trim().isNotEmpty) {
      request.fields['faultDescription'] = faultDescription.trim();
    }

    if (location != null && location.trim().isNotEmpty) {
      request.fields['location'] = location.trim();
    }

    if (state != null && state.trim().isNotEmpty) {
      request.fields['state'] = state.trim();
    }

    if (city != null && city.trim().isNotEmpty) {
      request.fields['city'] = city.trim();
    }

    for (final image in images.take(10)) {
  final bytes = await image.readAsBytes();

  request.files.add(
    http.MultipartFile.fromBytes(
      'images',
      bytes,
      filename: image.name,
    ),
  );
}

    final streamedResponse = await request.send();

    final response = await http.Response.fromStream(streamedResponse);

    dynamic decoded;

    try {
      decoded = jsonDecode(response.body);
    } catch (_) {
      throw Exception(
        'Invalid server response. '
        'Status: ${response.statusCode}.',
      );
    }

    if (response.statusCode < 200 || response.statusCode >= 300) {
      if (decoded is Map<String, dynamic>) {
        throw Exception(
          decoded['message']?.toString() ?? 'Failed to create listing.',
        );
      }

      throw Exception(
        'Failed to create listing. '
        'Status: ${response.statusCode}.',
      );
    }

    if (decoded is! Map<String, dynamic>) {
      throw Exception('Invalid server response.');
    }

    if (decoded['success'] != true) {
      throw Exception(
        decoded['message']?.toString() ?? 'Failed to create listing.',
      );
    }

    final data = decoded['data'];

    if (data is! Map<String, dynamic>) {
      throw Exception('Invalid listing data returned by server.');
    }

    return Listing.fromJson(data);
  }

  /// Fetch a single listing using its slug.
  static Future<Listing> getListingBySlug(String slug) async {
    final response = await http.get(
      Uri.parse(ApiConstants.listingBySlug(slug)),
      headers: const {'Accept': 'application/json'},
    );

    dynamic decoded;

    try {
      decoded = jsonDecode(response.body);
    } catch (_) {
      throw Exception(
        'Invalid server response. Status: ${response.statusCode}.',
      );
    }

    if (response.statusCode < 200 || response.statusCode >= 300) {
      if (decoded is Map<String, dynamic>) {
        throw Exception(
          decoded['message']?.toString() ?? 'Failed to retrieve listing.',
        );
      }

      throw Exception(
        'Failed to retrieve listing. '
        'Status: ${response.statusCode}.',
      );
    }

    if (decoded is! Map<String, dynamic>) {
      throw Exception('Invalid server response.');
    }

    if (decoded['success'] != true) {
      throw Exception(
        decoded['message']?.toString() ?? 'Failed to retrieve listing.',
      );
    }

    final data = decoded['data'];

    if (data is! Map<String, dynamic>) {
      throw Exception('Invalid listing data returned by server.');
    }

    return Listing.fromJson(data);
  }

  /// Check whether the current user has favorited a listing.
  static Future<bool> isFavorited(String listingId) async {
    final accessToken = await AuthStorage.getAccessToken();

    if (accessToken == null || accessToken.isEmpty) {
      return false;
    }

    final response = await http.get(
      Uri.parse(ApiConstants.favoriteCheck(listingId)),
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer $accessToken',
      },
    );

    dynamic decoded;

    try {
      decoded = jsonDecode(response.body);
    } catch (_) {
      throw Exception(
        'Invalid server response. Status: ${response.statusCode}.',
      );
    }

    if (response.statusCode < 200 || response.statusCode >= 300) {
      if (decoded is Map<String, dynamic>) {
        throw Exception(
          decoded['message']?.toString() ?? 'Failed to check favorite status.',
        );
      }

      throw Exception(
        'Failed to check favorite status. '
        'Status: ${response.statusCode}.',
      );
    }

    final data = decoded['data'];

    if (data is! Map<String, dynamic>) {
      throw Exception('Invalid favorite status response.');
    }

    return data['isFavorited'] == true;
  }

  /// Add a listing to the current user's favorites.
  static Future<void> addFavorite(String listingId) async {
    final accessToken = await AuthStorage.getAccessToken();

    if (accessToken == null || accessToken.isEmpty) {
      throw Exception('You must be logged in to save listings.');
    }

    final response = await http.post(
      Uri.parse(ApiConstants.favoriteByListing(listingId)),
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer $accessToken',
      },
    );

    dynamic decoded;

    try {
      decoded = jsonDecode(response.body);
    } catch (_) {
      throw Exception(
        'Invalid server response. Status: ${response.statusCode}.',
      );
    }

    if (response.statusCode < 200 || response.statusCode >= 300) {
      if (decoded is Map<String, dynamic>) {
        throw Exception(
          decoded['message']?.toString() ?? 'Failed to save listing.',
        );
      }

      throw Exception(
        'Failed to save listing. '
        'Status: ${response.statusCode}.',
      );
    }

    if (decoded is! Map<String, dynamic> || decoded['success'] != true) {
      throw Exception(
        decoded is Map<String, dynamic>
            ? decoded['message']?.toString() ?? 'Failed to save listing.'
            : 'Failed to save listing.',
      );
    }
  }

  /// Remove a listing from the current user's favorites.
  static Future<void> removeFavorite(String listingId) async {
    final accessToken = await AuthStorage.getAccessToken();

    if (accessToken == null || accessToken.isEmpty) {
      throw Exception('You must be logged in to manage saved listings.');
    }

    final response = await http.delete(
      Uri.parse(ApiConstants.favoriteByListing(listingId)),
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer $accessToken',
      },
    );

    dynamic decoded;

    try {
      decoded = jsonDecode(response.body);
    } catch (_) {
      throw Exception(
        'Invalid server response. Status: ${response.statusCode}.',
      );
    }

    if (response.statusCode < 200 || response.statusCode >= 300) {
      if (decoded is Map<String, dynamic>) {
        throw Exception(
          decoded['message']?.toString() ?? 'Failed to remove saved listing.',
        );
      }

      throw Exception(
        'Failed to remove saved listing. '
        'Status: ${response.statusCode}.',
      );
    }

    if (decoded is! Map<String, dynamic> || decoded['success'] != true) {
      throw Exception(
        decoded is Map<String, dynamic>
            ? decoded['message']?.toString() ??
                  'Failed to remove saved listing.'
            : 'Failed to remove saved listing.',
      );
    }
  }

  /// Fetch the current user's saved listings.
  static Future<List<Listing>> getMyFavorites() async {
    final accessToken = await AuthStorage.getAccessToken();

    if (accessToken == null || accessToken.isEmpty) {
      throw Exception('You must be logged in to view saved listings.');
    }

    final response = await http.get(
      Uri.parse(ApiConstants.favorites),
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer $accessToken',
      },
    );

    dynamic decoded;

    try {
      decoded = jsonDecode(response.body);
    } catch (_) {
      throw Exception(
        'Invalid server response. Status: ${response.statusCode}.',
      );
    }

    if (response.statusCode < 200 || response.statusCode >= 300) {
      if (decoded is Map<String, dynamic>) {
        throw Exception(
          decoded['message']?.toString() ??
              'Failed to retrieve saved listings.',
        );
      }

      throw Exception(
        'Failed to retrieve saved listings. '
        'Status: ${response.statusCode}.',
      );
    }

    if (decoded is! Map<String, dynamic> || decoded['success'] != true) {
      throw Exception(
        decoded is Map<String, dynamic>
            ? decoded['message']?.toString() ??
                  'Failed to retrieve saved listings.'
            : 'Failed to retrieve saved listings.',
      );
    }

    final data = decoded['data'];

    if (data is! List) {
      throw Exception('Invalid saved listings response.');
    }

    return data
        .whereType<Map<String, dynamic>>()
        .map((item) {
          final listingData = item['listing'];

          if (listingData is Map<String, dynamic>) {
            return Listing.fromJson(listingData);
          }

          return null;
        })
        .whereType<Listing>()
        .toList();
  }
}
