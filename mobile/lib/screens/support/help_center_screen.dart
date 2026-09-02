import 'package:flutter/material.dart';

import '../../core/theme/app_theme.dart';

class HelpCenterScreen extends StatelessWidget {
  const HelpCenterScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final faqs = [
      (
        'How do I create an account?',
        'Tap Create account on the login screen, enter your details, and submit the registration form.'
      ),
      (
        'How do I list an item?',
        'Open Sell from the bottom navigation and follow the listing form to provide your item details, condition, price, and images.'
      ),
      (
        'How do I make an offer?',
        'Open a listing and use the Make Offer action to submit an amount to the seller.'
      ),
      (
        'How do I save a listing?',
        'Open a listing and tap the save/favorite action. Your saved listings are available from the Saved tab.'
      ),
      (
        'How do reviews work?',
        'Reviews become available after eligible transactions are completed. You can manage your own reviews from your account.'
      ),
      (
        'How do I log out?',
        'Open Account, scroll to the bottom, and tap Sign Out.'
      ),
    ];

    return Scaffold(
      backgroundColor: AppTheme.lightBackground,
      appBar: AppBar(
        title: const Text('Help Center'),
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(20, 16, 20, 32),
        children: [
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppTheme.primaryRed,
              borderRadius: BorderRadius.circular(20),
            ),
            child: const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Icon(
                  Icons.help_outline_rounded,
                  color: Colors.white,
                  size: 32,
                ),
                SizedBox(height: 14),
                Text(
                  'How can we help?',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 21,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                SizedBox(height: 6),
                Text(
                  'Find answers to common FaultMart questions below.',
                  style: TextStyle(
                    color: Colors.white70,
                    fontSize: 13,
                    height: 1.45,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          const Text(
            'Frequently Asked Questions',
            style: TextStyle(
              fontSize: 19,
              fontWeight: FontWeight.w800,
              color: AppTheme.darkText,
            ),
          ),
          const SizedBox(height: 12),
          ...faqs.map(
            (faq) => Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: _FaqTile(
                question: faq.$1,
                answer: faq.$2,
              ),
            ),
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(18),
              border: Border.all(
                color: Colors.black.withValues(alpha: 0.06),
              ),
            ),
            child: const Row(
              children: [
                Icon(
                  Icons.support_agent_outlined,
                  color: AppTheme.primaryRed,
                  size: 28,
                ),
                SizedBox(width: 14),
                Expanded(
                  child: Text(
                    'Still need help? Open Contact Support from your Account page.',
                    style: TextStyle(
                      fontSize: 13,
                      height: 1.45,
                      color: AppTheme.mutedText,
                    ),
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

class _FaqTile extends StatelessWidget {
  const _FaqTile({
    required this.question,
    required this.answer,
  });

  final String question;
  final String answer;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: Colors.black.withValues(alpha: 0.06),
        ),
      ),
      child: ExpansionTile(
        tilePadding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 3,
        ),
        childrenPadding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
        title: Text(
          question,
          style: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w700,
            color: AppTheme.darkText,
          ),
        ),
        iconColor: AppTheme.primaryRed,
        collapsedIconColor: AppTheme.mutedText,
        children: [
          Align(
            alignment: Alignment.centerLeft,
            child: Text(
              answer,
              style: const TextStyle(
                fontSize: 13,
                height: 1.5,
                color: AppTheme.mutedText,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
