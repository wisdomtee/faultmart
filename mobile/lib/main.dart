import 'dart:async';

import 'package:app_links/app_links.dart';
import 'package:flutter/material.dart';

import 'core/theme/app_theme.dart';
import 'screens/auth/login_screen.dart';
import 'screens/auth/reset_password_screen.dart';
import 'screens/main_navigation.dart';
import 'services/auth_service.dart';

final GlobalKey<NavigatorState> navigatorKey =
    GlobalKey<NavigatorState>();

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const FaultMartApp());
}

class FaultMartApp extends StatefulWidget {
  const FaultMartApp({super.key});

  @override
  State<FaultMartApp> createState() => _FaultMartAppState();
}

class _FaultMartAppState extends State<FaultMartApp> {
  final AppLinks _appLinks = AppLinks();

  StreamSubscription<Uri>? _linkSubscription;
  String? _lastHandledResetToken;

  @override
  void initState() {
    super.initState();

    WidgetsBinding.instance.addPostFrameCallback((_) {
      _initializeAppLinks();
    });
  }

  Future<void> _initializeAppLinks() async {
    try {
      final initialUri = await _appLinks.getInitialLink();

      if (initialUri != null) {
        _handleIncomingUri(initialUri);
      }
    } catch (_) {
      // Ignore malformed or unavailable initial links.
    }

    _linkSubscription = _appLinks.uriLinkStream.listen(
      _handleIncomingUri,
      onError: (_) {},
    );
  }

  void _handleIncomingUri(Uri uri) {
    if (uri.scheme != 'https') {
      return;
    }

    if (uri.host != 'faultmart.vercel.app') {
      return;
    }

    if (uri.path != '/reset-password') {
      return;
    }

    final token = uri.queryParameters['token'];

    if (token == null || token.isEmpty) {
      return;
    }

    if (_lastHandledResetToken == token) {
      return;
    }

    _lastHandledResetToken = token;

    WidgetsBinding.instance.addPostFrameCallback((_) {
      final navigator = navigatorKey.currentState;

      if (navigator == null) {
        return;
      }

      navigator.push(
        MaterialPageRoute(
          builder: (_) => ResetPasswordScreen(token: token),
        ),
      );
    });
  }

  @override
  void dispose() {
    _linkSubscription?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      navigatorKey: navigatorKey,
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      home: const AuthGate(),
    );
  }
}

class AuthGate extends StatefulWidget {
  const AuthGate({super.key});

  @override
  State<AuthGate> createState() => _AuthGateState();
}

class _AuthGateState extends State<AuthGate> {
  late final Future<bool> _sessionFuture;

  @override
  void initState() {
    super.initState();
    _sessionFuture = _restoreSession();
  }

  Future<bool> _restoreSession() async {
    final user = await AuthService.restoreSession();
    return user != null;
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<bool>(
      future: _sessionFuture,
      builder: (context, snapshot) {
        if (snapshot.connectionState != ConnectionState.done) {
          return const _AuthLoadingScreen();
        }

        if (snapshot.data == true) {
          return const MainNavigation();
        }

        return const LoginScreen();
      },
    );
  }
}

class _AuthLoadingScreen extends StatelessWidget {
  const _AuthLoadingScreen();

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: CircularProgressIndicator(),
      ),
    );
  }
}
