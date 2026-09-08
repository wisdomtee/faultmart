import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:image_picker/image_picker.dart';

import '../core/constants/api_constants.dart';
import '../models/homepage.dart';
import '../models/listing.dart';
import 'api_client.dart';
import 'auth_storage.dart';

class ListingService {
  ListingService._();

  /// Fetch public homepage data.
  static Future<HomepageData> getHomepage() async {
    final response = await http.get(
      Uri.parse(ApiConstants.home),
      headers: const {'Accept': 'application/json'},
    );

    final decoded = _decode(response);

    _ensureSuccess(response, decoded, fallback: 'Failed to retrieve homepage.');

    if (decoded is! Map<String, dynamic>) {
      throw Exception('Invalid server response.');
    }

    final data = decoded['data'];

    if (data is! Map<String, dynamic>) {
      throw Exception('Invalid homepage data returned by server.');
    }

    return HomepageData.fromJson(data);
  }

  /// Fetch public marketplace listings.
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

    final decoded = _decode(response);

    _ensureSuccess(response, decoded, fallback: 'Failed to retrieve listings.');

    if (decoded is! Map<String, dynamic>) {
      throw Exception('Invalid server response.');
    }

    final data = decoded['data'];

    if (data is! Map<String, dynamic>) {
      throw Exception('Invalid listings data returned by server.');
    }

    return ListingPage.fromJson(data);
  }

  /// Fetch the current user's listings.
  static Future<List<Listing>> getMyListings() async {
    final response = await ApiClient.get(
      Uri.parse(ApiConstants.myListings),
      headers: const {'Accept': 'application/json'},
    );

    final decoded = _decode(response);

    _ensureSuccess(
      response,
      decoded,
      fallback: 'Failed to retrieve your listings.',
    );

    if (decoded is! Map<String, dynamic>) {
      throw Exception('Invalid server response.');
    }

    final data = decoded['data'];

    if (data is! List) {
      throw Exception('Invalid my listings response.');
    }

    return data
        .whereType<Map<String, dynamic>>()
        .map(Listing.fromJson)
        .toList();
  }

  /// Create a listing with optional images.
  ///
  /// ApiClient.sendMultipart automatically retries once after a successful
  /// token refresh if the original request receives a 401.
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

    final streamedResponse = await ApiClient.sendMultipart((token) async {
      final request = http.MultipartRequest(
        'POST',
        Uri.parse(ApiConstants.listings),
      );

      request.headers.addAll({
        'Authorization': 'Bearer $token',
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
          http.MultipartFile.fromBytes('images', bytes, filename: image.name),
        );
      }

      return request;
    });

    final response = await http.Response.fromStream(streamedResponse);

    final decoded = _decode(response);

    _ensureSuccess(response, decoded, fallback: 'Failed to create listing.');

    if (decoded is! Map<String, dynamic>) {
      throw Exception('Invalid server response.');
    }

    final data = decoded['data'];

    if (data is! Map<String, dynamic>) {
      throw Exception('Invalid listing data returned by server.');
    }

    return Listing.fromJson(data);
  }

  /// Fetch a single public listing by slug.
  static Future<Listing> getListingBySlug(String slug) async {
    final response = await http.get(
      Uri.parse(ApiConstants.listingBySlug(slug)),
      headers: const {'Accept': 'application/json'},
    );

    final decoded = _decode(response);

    _ensureSuccess(response, decoded, fallback: 'Failed to retrieve listing.');

    if (decoded is! Map<String, dynamic>) {
      throw Exception('Invalid server response.');
    }

    final data = decoded['data'];

    if (data is! Map<String, dynamic>) {
      throw Exception('Invalid listing data returned by server.');
    }

    return Listing.fromJson(data);
  }

  /// Update an existing listing owned by the current user.
  ///
  /// The backend accepts multipart/form-data so sellers can update
  /// listing fields and optionally replace the listing images.
  static Future<Listing> updateListing({
    required String listingId,
    required String title,
    required String description,
    required String categoryId,
    required double price,
    required String currency,
    required String condition,
    required String faultSeverity,
    required String faultDescription,
    required String location,
    required String state,
    required String city,
    required bool negotiable,
    List<XFile> images = const [],
  }) async {
    final accessToken = await AuthStorage.getAccessToken();

    if (accessToken == null || accessToken.isEmpty) {
      throw Exception('You must be logged in to update a listing.');
    }

    final streamedResponse = await ApiClient.sendMultipart((token) async {
      final request = http.MultipartRequest(
        'PUT',
        Uri.parse(ApiConstants.updateListing(listingId)),
      );

      request.headers.addAll({
        'Authorization': 'Bearer $token',
        'Accept': 'application/json',
      });

      request.fields.addAll({
        'title': title.trim(),
        'description': description.trim(),
        'categoryId': categoryId,
        'price': price.toString(),
        'currency': currency,
        'condition': condition,
        'faultSeverity': faultSeverity,
        'faultDescription': faultDescription.trim(),
        'location': location.trim(),
        'state': state.trim(),
        'city': city.trim(),
        'negotiable': negotiable.toString(),
      });

      for (final image in images.take(10)) {
        final bytes = await image.readAsBytes();

        request.files.add(
          http.MultipartFile.fromBytes('images', bytes, filename: image.name),
        );
      }

      return request;
    });

    final response = await http.Response.fromStream(streamedResponse);

    final decoded = _decode(response);

    _ensureSuccess(response, decoded, fallback: 'Failed to update listing.');

    if (decoded is! Map<String, dynamic>) {
      throw Exception('Invalid update listing response.');
    }

    final data = decoded['data'];

    if (data is! Map<String, dynamic>) {
      throw Exception('Invalid updated listing data returned by server.');
    }

    return Listing.fromJson(data);
  }

  /// Check whether the current user has favorited a listing.
  static Future<bool> isFavorited(String listingId) async {
    final accessToken = await AuthStorage.getAccessToken();

    if (accessToken == null || accessToken.isEmpty) {
      return false;
    }

    final response = await ApiClient.get(
      Uri.parse(ApiConstants.favoriteCheck(listingId)),
      headers: const {'Accept': 'application/json'},
    );

    final decoded = _decode(response);

    _ensureSuccess(
      response,
      decoded,
      fallback: 'Failed to check favorite status.',
    );

    if (decoded is! Map<String, dynamic>) {
      throw Exception('Invalid favorite status response.');
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

    final response = await ApiClient.post(
      Uri.parse(ApiConstants.favoriteByListing(listingId)),
      headers: const {'Accept': 'application/json'},
    );

    final decoded = _decode(response);

    _ensureSuccess(response, decoded, fallback: 'Failed to save listing.');
  }

  /// Remove a listing from the current user's favorites.
  static Future<void> removeFavorite(String listingId) async {
    final accessToken = await AuthStorage.getAccessToken();

    if (accessToken == null || accessToken.isEmpty) {
      throw Exception('You must be logged in to manage saved listings.');
    }

    final response = await ApiClient.delete(
      Uri.parse(ApiConstants.favoriteByListing(listingId)),
      headers: const {'Accept': 'application/json'},
    );

    final decoded = _decode(response);

    _ensureSuccess(
      response,
      decoded,
      fallback: 'Failed to remove saved listing.',
    );
  }

  /// Fetch the current user's saved listings.
  static Future<List<Listing>> getMyFavorites() async {
    final accessToken = await AuthStorage.getAccessToken();

    if (accessToken == null || accessToken.isEmpty) {
      throw Exception('You must be logged in to view saved listings.');
    }

    final response = await ApiClient.get(
      Uri.parse(ApiConstants.favorites),
      headers: const {'Accept': 'application/json'},
    );

    final decoded = _decode(response);

    _ensureSuccess(
      response,
      decoded,
      fallback: 'Failed to retrieve saved listings.',
    );

    if (decoded is! Map<String, dynamic>) {
      throw Exception('Invalid saved listings response.');
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

  static dynamic _decode(http.Response response) {
    if (response.body.isEmpty) {
      return null;
    }

    try {
      return jsonDecode(response.body);
    } catch (_) {
      throw Exception(
        'Invalid server response. Status: ${response.statusCode}.',
      );
    }
  }

  static void _ensureSuccess(
    http.Response response,
    dynamic decoded, {
    required String fallback,
  }) {
    if (response.statusCode < 200 || response.statusCode >= 300) {
      if (decoded is Map<String, dynamic>) {
        throw Exception(decoded['message']?.toString() ?? fallback);
      }

      throw Exception('$fallback Status: ${response.statusCode}.');
    }

    if (decoded is Map<String, dynamic> && decoded['success'] != true) {
      throw Exception(decoded['message']?.toString() ?? fallback);
    }
  }
}
