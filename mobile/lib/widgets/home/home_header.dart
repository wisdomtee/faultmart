import 'package:flutter/material.dart';

import '../../core/theme/app_theme.dart';

class HomeHeader extends StatelessWidget {
  const HomeHeader({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 8),
      child: Row(
        children: [
          Image.asset(
            'assets/images/faultmart-logo.png',
            width: 44,
            height: 44,
            fit: BoxFit.contain,
          ),
          const SizedBox(width: 10),
          const Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text.rich(
                  TextSpan(
                    children: [
                      TextSpan(
                        text: 'Fault',
                        style: TextStyle(
                          color: AppTheme.primaryRed,
                          fontSize: 23,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                      TextSpan(
                        text: 'Mart',
                        style: TextStyle(
                          color: AppTheme.darkText,
                          fontSize: 23,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                    ],
                  ),
                ),
                SizedBox(height: 2),
                Text(
                  'The marketplace for repairable goods',
                  style: TextStyle(color: AppTheme.mutedText, fontSize: 11),
                ),
              ],
            ),
          ),
          _HeaderIcon(icon: Icons.notifications_none_rounded, onTap: () {}),
          const SizedBox(width: 4),
          _HeaderIcon(icon: Icons.person_outline_rounded, onTap: () {}),
        ],
      ),
    );
  }
}

class _HeaderIcon extends StatelessWidget {
  const _HeaderIcon({required this.icon, required this.onTap});

  final IconData icon;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return IconButton(
      onPressed: onTap,
      tooltip: 'Open',
      icon: Icon(icon, size: 24, color: AppTheme.darkText),
    );
  }
}
