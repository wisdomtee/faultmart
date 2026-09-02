import 'package:http_cookie_store/http_cookie_store.dart';

class ApiClient {
  ApiClient._();

  static final CookieClient client = CookieClient();
}
