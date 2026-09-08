import 'dart:convert';

import '../core/constants/api_constants.dart';
import 'api_client.dart';

class ListingAssistantResult {
  final String suggestedTitle;
  final String improvedDescription;
  final String? suggestedFaultSeverity;
  final List<String> suggestions;

  const ListingAssistantResult({
    required this.suggestedTitle,
    required this.improvedDescription,
    required this.suggestedFaultSeverity,
    required this.suggestions,
  });

  factory ListingAssistantResult.fromJson(
    Map<String, dynamic> json,
  ) {
    final rawSeverity = json['suggestedFaultSeverity'];

    String? severity;

    if (rawSeverity is String) {
      const allowedSeverities = {
        'MINOR',
        'MODERATE',
        'MAJOR',
        'CRITICAL',
      };

      if (allowedSeverities.contains(rawSeverity)) {
        severity = rawSeverity;
      }
    }

    final rawSuggestions = json['suggestions'];

    final suggestions = rawSuggestions is List
        ? rawSuggestions
            .whereType<String>()
            .where((item) => item.trim().isNotEmpty)
            .toList()
        : <String>[];

    return ListingAssistantResult(
      suggestedTitle:
          json['suggestedTitle'] is String
              ? json['suggestedTitle'] as String
              : '',
      improvedDescription:
          json['improvedDescription'] is String
              ? json['improvedDescription'] as String
              : '',
      suggestedFaultSeverity: severity,
      suggestions: suggestions,
    );
  }
}

class AiService {
  AiService._();

  static Future<ListingAssistantResult> generateListingAssistant({
    String? title,
    String? description,
    String? category,
    String? condition,
    String? faultSeverity,
    String? faultDescription,
  }) async {
    final payload = <String, dynamic>{};

    void addIfPresent(String key, String? value) {
      if (value != null && value.trim().isNotEmpty) {
        payload[key] = value.trim();
      }
    }

    addIfPresent('title', title);
    addIfPresent('description', description);
    addIfPresent('category', category);
    addIfPresent('condition', condition);
    addIfPresent('faultSeverity', faultSeverity);
    addIfPresent('faultDescription', faultDescription);

    final response = await ApiClient.post(
      Uri.parse(ApiConstants.listingAssistant),
      headers: const {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: jsonEncode(payload),
    );

    if (response.statusCode < 200 ||
        response.statusCode >= 300) {
      String message = 'Unable to generate AI suggestions.';

      try {
        final decoded = jsonDecode(response.body);

        if (decoded is Map<String, dynamic>) {
          final serverMessage = decoded['message'];

          if (serverMessage is String &&
              serverMessage.trim().isNotEmpty) {
            message = serverMessage;
          }
        }
      } catch (_) {
        // Keep the fallback message.
      }

      throw Exception(message);
    }

    final decoded = jsonDecode(response.body);

    if (decoded is! Map<String, dynamic>) {
      throw Exception('Invalid AI response.');
    }

    final data = decoded['data'];

    if (data is! Map<String, dynamic>) {
      throw Exception('Invalid AI response data.');
    }

    return ListingAssistantResult.fromJson(data);
  }
}
