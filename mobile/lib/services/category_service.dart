import 'dart:convert';

import 'package:http/http.dart' as http;

import '../core/constants/api_constants.dart';
import '../models/listing.dart';

class CategoryService {
  CategoryService._();

  static Future<List<ListingCategory>> getCategories() async {
    final response = await http.get(
      Uri.parse(ApiConstants.categories),
      headers: const {
        'Accept': 'application/json',
      },
    );

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception(
        'Failed to load categories (${response.statusCode}).',
      );
    }

    final decoded = jsonDecode(response.body);

    if (decoded is! Map<String, dynamic>) {
      throw Exception('Invalid categories response.');
    }

    final data = decoded['data'];

    if (data is! List) {
      throw Exception('Invalid categories data.');
    }

    return data
        .whereType<Map>()
        .map(
          (item) => ListingCategory.fromJson(
            Map<String, dynamic>.from(item),
          ),
        )
        .toList();
  }
}