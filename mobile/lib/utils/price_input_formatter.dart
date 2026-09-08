import 'package:flutter/services.dart';

class PriceInputFormatter extends TextInputFormatter {
  const PriceInputFormatter();

  @override
  TextEditingValue formatEditUpdate(
    TextEditingValue oldValue,
    TextEditingValue newValue,
  ) {
    final digitsOnly = newValue.text.replaceAll(RegExp(r'[^0-9]'), '');

    if (digitsOnly.isEmpty) {
      return const TextEditingValue(
        text: '',
        selection: TextSelection.collapsed(offset: 0),
      );
    }

    final formatted = _formatWithCommas(digitsOnly);

    final cursorOffset = newValue.selection.baseOffset.clamp(
      0,
      newValue.text.length,
    );

    final digitsBeforeCursor = newValue.text
        .substring(0, cursorOffset)
        .replaceAll(RegExp(r'[^0-9]'), '')
        .length;

    final newCursorPosition = _cursorPositionForDigitCount(
      formatted,
      digitsBeforeCursor,
    );

    return TextEditingValue(
      text: formatted,
      selection: TextSelection.collapsed(
        offset: newCursorPosition,
      ),
    );
  }

  static String format(String value) {
    final normalized = value.replaceAll(',', '').trim();
    final number = num.tryParse(normalized);

    if (number == null) {
      return '';
    }

    return _formatWithCommas(number.toInt().toString());
  }

  static String _formatWithCommas(String digits) {
    final buffer = StringBuffer();

    for (var i = 0; i < digits.length; i++) {
      if (i > 0 && (digits.length - i) % 3 == 0) {
        buffer.write(',');
      }

      buffer.write(digits[i]);
    }

    return buffer.toString();
  }

  static int _cursorPositionForDigitCount(
    String formatted,
    int digitCount,
  ) {
    if (digitCount <= 0) {
      return 0;
    }

    var digitsSeen = 0;

    for (var i = 0; i < formatted.length; i++) {
      final code = formatted.codeUnitAt(i);

      if (code >= 48 && code <= 57) {
        digitsSeen++;

        if (digitsSeen == digitCount) {
          return i + 1;
        }
      }
    }

    return formatted.length;
  }
}
