import 'package:flutter/material.dart';

import '../../core/theme/app_theme.dart';
import '../../models/homepage.dart';

class HomeMarketplaceStats extends StatelessWidget {
  const HomeMarketplaceStats({super.key, required this.statistics});

  final HomepageStatistics statistics;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(top: 40),
      padding: const EdgeInsets.fromLTRB(20, 32, 20, 32),
      color: const Color(0xFFF8F8F8),
      child: Column(
        children: [
          const Text(
            'The FaultMart Marketplace',
            textAlign: TextAlign.center,
            style: TextStyle(
              color: AppTheme.darkText,
              fontSize: 24,
              fontWeight: FontWeight.w900,
            ),
          ),
          const SizedBox(height: 10),
          const Text(
            'A growing marketplace connecting people with repairable products across Nigeria.',
            textAlign: TextAlign.center,
            style: TextStyle(
              color: AppTheme.mutedText,
              fontSize: 14,
              height: 1.5,
            ),
          ),
          const SizedBox(height: 24),
          Row(
            children: [
              Expanded(
                child: _Stat(value: _format(statistics.users), label: 'Users'),
              ),
              Expanded(
                child: _Stat(
                  value: _format(statistics.listings),
                  label: 'Listings',
                ),
              ),
              Expanded(
                child: _Stat(value: _format(statistics.sold), label: 'Sold'),
              ),
              Expanded(
                child: _Stat(
                  value: _format(statistics.reviews),
                  label: 'Reviews',
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  String _format(int value) {
    return value.toString().replaceAllMapped(
      RegExp(r'(\d)(?=(\d{3})+(?!\d))'),
      (match) => '${match[1]},',
    );
  }
}

class _Stat extends StatelessWidget {
  const _Stat({required this.value, required this.label});

  final String value;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          value,
          style: const TextStyle(
            color: AppTheme.primaryOrange,
            fontSize: 22,
            fontWeight: FontWeight.w900,
          ),
        ),
        const SizedBox(height: 5),
        Text(
          label,
          textAlign: TextAlign.center,
          style: const TextStyle(
            color: AppTheme.mutedText,
            fontSize: 11,
            fontWeight: FontWeight.w600,
          ),
        ),
      ],
    );
  }
}
