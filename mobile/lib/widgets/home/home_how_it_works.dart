import 'package:flutter/material.dart';

import '../../core/theme/app_theme.dart';

class HomeHowItWorks extends StatelessWidget {
  const HomeHowItWorks({super.key});

  static const steps = [
    _StepData(
      number: '01',
      title: 'List What You Have',
      description:
          'Upload clear photos, set your price, choose the condition, and explain what works and what needs repair.',
      icon: Icons.add_photo_alternate_outlined,
    ),
    _StepData(
      number: '02',
      title: 'Connect & Negotiate',
      description:
          'Buyers can ask questions, message sellers, discuss the condition and make offers based on the item’s real value.',
      icon: Icons.forum_outlined,
    ),
    _StepData(
      number: '03',
      title: 'Make The Deal',
      description:
          'Agree on the right offer, complete the transaction and give a useful product a second life.',
      icon: Icons.handshake_outlined,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(top: 36),
      padding: const EdgeInsets.fromLTRB(20, 36, 20, 40),
      color: const Color(0xFF171717),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
            decoration: BoxDecoration(
              color: AppTheme.primaryOrange.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(999),
              border: Border.all(
                color: AppTheme.primaryOrange.withValues(alpha: 0.25),
              ),
            ),
            child: const Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  Icons.check_circle_outline,
                  size: 16,
                  color: AppTheme.primaryOrange,
                ),
                SizedBox(width: 7),
                Text(
                  'SIMPLE PROCESS',
                  style: TextStyle(
                    color: AppTheme.primaryOrange,
                    fontSize: 11,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 1.2,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 18),
          const Text(
            'How FaultMart Works',
            style: TextStyle(
              color: Colors.white,
              fontSize: 30,
              height: 1.1,
              fontWeight: FontWeight.w900,
            ),
          ),
          const SizedBox(height: 12),
          const Text(
            'From listing a faulty product to finding the right buyer, FaultMart keeps the process simple, transparent and direct.',
            style: TextStyle(
              color: Color(0xFFA3A3A3),
              fontSize: 15,
              height: 1.6,
            ),
          ),
          const SizedBox(height: 28),
          ...steps.map(
            (step) => Padding(
              padding: const EdgeInsets.only(bottom: 14),
              child: _StepCard(step: step),
            ),
          ),
        ],
      ),
    );
  }
}

class _StepData {
  const _StepData({
    required this.number,
    required this.title,
    required this.description,
    required this.icon,
  });

  final String number;
  final String title;
  final String description;
  final IconData icon;
}

class _StepCard extends StatelessWidget {
  const _StepCard({required this.step});

  final _StepData step;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.05),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
      ),
      child: Stack(
        children: [
          Positioned(
            right: 4,
            top: -8,
            child: Text(
              step.number,
              style: TextStyle(
                color: Colors.white.withValues(alpha: 0.04),
                fontSize: 64,
                fontWeight: FontWeight.w900,
              ),
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 54,
                height: 54,
                decoration: BoxDecoration(
                  color: AppTheme.primaryOrange,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Icon(step.icon, color: Colors.white, size: 27),
              ),
              const SizedBox(height: 18),
              Text(
                step.title,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 20,
                  fontWeight: FontWeight.w900,
                ),
              ),
              const SizedBox(height: 9),
              Text(
                step.description,
                style: const TextStyle(
                  color: Color(0xFFA3A3A3),
                  fontSize: 14,
                  height: 1.55,
                ),
              ),
              const SizedBox(height: 18),
              const Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    'Explore this step',
                    style: TextStyle(
                      color: AppTheme.primaryOrange,
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  SizedBox(width: 6),
                  Icon(
                    Icons.arrow_forward,
                    color: AppTheme.primaryOrange,
                    size: 16,
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }
}
