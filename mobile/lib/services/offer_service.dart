import 'dart:convert';

import '../core/constants/api_constants.dart';
import '../models/offer.dart';
import 'api_client.dart';

class OfferService {
  OfferService._();

  static Future<List<Offer>> getMyOffers() async {
    final response = await ApiClient.get(
      Uri.parse(ApiConstants.myOffers),
    );

    return _parseOfferList(response);
  }

  static Future<List<Offer>> getReceivedOffers() async {
    final response = await ApiClient.get(
      Uri.parse(ApiConstants.receivedOffers),
    );

    return _parseOfferList(response);
  }

  static Future<Offer?> acceptOffer(String offerId) async {
    final response = await ApiClient.patch(
      Uri.parse(ApiConstants.acceptOffer(offerId)),
    );

    return _parseOfferFromActionResponse(response);
  }

  static Future<void> rejectOffer(String offerId) async {
    final response = await ApiClient.patch(
      Uri.parse(ApiConstants.rejectOffer(offerId)),
    );

    _ensureSuccess(response);
  }

  static Future<void> withdrawOffer(String offerId) async {
    final response = await ApiClient.patch(
      Uri.parse(ApiConstants.withdrawOffer(offerId)),
    );

    _ensureSuccess(response);
  }

  static List<Offer> _parseOfferList(dynamic response) {
    _ensureSuccess(response);

    final decoded = jsonDecode(response.body);

    if (decoded is! Map<String, dynamic>) {
      throw Exception('Invalid offers response.');
    }

    final data = decoded['data'];

    if (data is! List) {
      return const [];
    }

    return data
        .whereType<Map<String, dynamic>>()
        .map(Offer.fromJson)
        .toList();
  }

  static Offer? _parseOfferFromActionResponse(dynamic response) {
    _ensureSuccess(response);

    if (response.body.isEmpty) {
      return null;
    }

    final decoded = jsonDecode(response.body);

    if (decoded is! Map<String, dynamic>) {
      return null;
    }

    final data = decoded['data'];

    if (data is! Map<String, dynamic>) {
      return null;
    }

    final order = data['order'];

    if (order is Map<String, dynamic>) {
      return null;
    }

    final offer = data['offer'];

    if (offer is Map<String, dynamic>) {
      return Offer.fromJson(offer);
    }

    return null;
  }

  static void _ensureSuccess(dynamic response) {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return;
    }

    String message = 'Request failed.';

    try {
      final decoded = jsonDecode(response.body);

      if (decoded is Map<String, dynamic>) {
        final rawMessage = decoded['message'];

        if (rawMessage != null && rawMessage.toString().isNotEmpty) {
          message = rawMessage.toString();
        }
      }
    } catch (_) {
      if (response.body.isNotEmpty) {
        message = response.body;
      }
    }

    throw Exception(message);
  }
}
