import 'package:flutter/material.dart';

class AppTheme {
  AppTheme._();

  static const Color primaryRed = Color(0xFFDC2626);
  static const Color primaryOrange = Color(0xFFF97316);
  static const Color darkText = Color(0xFF171717);
  static const Color mutedText = Color(0xFF737373);
  static const Color lightBackground = Color(0xFFF8F8F8);

  static final ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    scaffoldBackgroundColor: Colors.white,
    colorScheme: ColorScheme.fromSeed(
      seedColor: primaryRed,
      brightness: Brightness.light,
    ),
    fontFamily: 'Arial',
    appBarTheme: const AppBarTheme(
      backgroundColor: Colors.white,
      foregroundColor: darkText,
      elevation: 0,
      surfaceTintColor: Colors.transparent,
    ),
  );
}
