import 'package:flutter/material.dart';

import '../../core/theme/app_theme.dart';

class AboutScreen extends StatelessWidget {
  const AboutScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.lightBackground,
      appBar: AppBar(
        title: const Text('About FaultMart'),
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(20, 20, 20, 32),
        children: [
          Center(
            child: Container(
              width: 92,
              height: 92,
              padding: const EdgeInsets.all(15),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.06),
                    blurRadius: 20,
                    offset: const Offset(0, 8),
                  ),
                ],
              ),
              child: Image.asset(
                'assets/images/faultmart-logo.png',
                fit: BoxFit.contain,
              ),
            ),
          ),
          const SizedBox(height: 20),
          const Center(
            child: Text(
              'FaultMart',
              style: TextStyle(
                fontSize: 26,
                fontWeight: FontWeight.w900,
                color: AppTheme.darkText,
              ),
            ),
          ),
          const SizedBox(height: 6),
          const Center(
            child: Text(
              'The marketplace for repairable goods',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 13,
                color: AppTheme.mutedText,
              ),
            ),
          ),
          const SizedBox(height: 28),
          _InfoCard(
            title: 'What is FaultMart?',
            text:
                'FaultMart is a marketplace built to connect buyers and sellers of faulty, damaged, used, and repairable goods.',
          ),
          const SizedBox(height: 12),
          _InfoCard(
            title: 'Our Mission',
            text:
                'We make it easier to give repairable goods a second life by connecting people who have items to sell with people who can repair, reuse, restore, or repurpose them.',
          ),
          const SizedBox(height: 12),
          _InfoCard(
            title: 'Built for Africa',
            text:
                'FaultMart is designed with African buyers, sellers, technicians, repairers, and businesses in mind.',
          ),
          const SizedBox(height: 24),
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: AppTheme.primaryRed.withValues(alpha: 0.06),
              borderRadius: BorderRadius.circular(18),
            ),
            child: const Column(
              children: [
                Text(
                  'FaultMart',
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w800,
                    color: AppTheme.darkText,
                  ),
                ),
                SizedBox(height: 5),
                Text(
                  'Buy. Sell. Repair. Reuse.',
                  style: TextStyle(
                    fontSize: 12,
                    color: AppTheme.primaryRed,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _InfoCard extends StatelessWidget {
  const _InfoCard({
    required this.title,
    required this.text,
  });

  final String title;
  final String text;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(
          color: Colors.black.withValues(alpha: 0.05),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: const TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.w800,
              color: AppTheme.darkText,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            text,
            style: const TextStyle(
              fontSize: 13,
              height: 1.55,
              color: AppTheme.mutedText,
            ),
          ),
        ],
      ),
    );
  }
}
