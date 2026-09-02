import 'package:flutter/material.dart';

import '../../core/theme/app_theme.dart';

class HomeWhyChoose extends StatelessWidget {
  const HomeWhyChoose({super.key});

  static const features = [
    _Feature(
      title: 'Verified Sellers',
      description:
          'Every seller goes through verification to help buyers trade confidently and reduce fraud.',
      icon: Icons.verified_user_outlined,
    ),
    _Feature(
      title: 'Detailed Fault Reports',
      description:
          'Listings clearly explain what works, what does not and the repairs required before purchase.',
      icon: Icons.build_outlined,
    ),
    _Feature(
      title: 'Nationwide Marketplace',
      description:
          'Discover repairable vehicles, phones, electronics and appliances from sellers across Nigeria.',
      icon: Icons.location_on_outlined,
    ),
    _Feature(
      title: 'Save More Money',
      description:
          'Buy repairable products below market value and create more value after repairs.',
      icon: Icons.payments_outlined,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 40, 20, 8),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
            decoration: BoxDecoration(
              color: const Color(0xFFFFEDD5),
              borderRadius: BorderRadius.circular(999),
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
                  'TRUSTED MARKETPLACE',
                  style: TextStyle(
                    color: AppTheme.primaryOrange,
                    fontSize: 11,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 1,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 18),
          const Text(
            'Why Choose FaultMart?',
            textAlign: TextAlign.center,
            style: TextStyle(
              color: AppTheme.darkText,
              fontSize: 30,
              height: 1.1,
              fontWeight: FontWeight.w900,
            ),
          ),
          const SizedBox(height: 12),
          const Text(
            'We make buying and selling repairable products safer through verified sellers, transparent fault information and nationwide access.',
            textAlign: TextAlign.center,
            style: TextStyle(
              color: AppTheme.mutedText,
              fontSize: 15,
              height: 1.6,
            ),
          ),
          const SizedBox(height: 28),
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: features.length,
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              childAspectRatio: 0.82,
            ),
            itemBuilder: (_, index) {
              return _FeatureCard(feature: features[index]);
            },
          ),
        ],
      ),
    );
  }
}

class _Feature {
  const _Feature({
    required this.title,
    required this.description,
    required this.icon,
  });

  final String title;
  final String description;
  final IconData icon;
}

class _FeatureCard extends StatelessWidget {
  const _FeatureCard({required this.feature});

  final _Feature feature;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.black.withValues(alpha: 0.07)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 50,
            height: 50,
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFFF97316), Color(0xFFEA580C)],
              ),
              borderRadius: BorderRadius.circular(15),
            ),
            child: Icon(feature.icon, color: Colors.white, size: 25),
          ),
          const SizedBox(height: 16),
          Text(
            feature.title,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(
              color: AppTheme.darkText,
              fontSize: 16,
              height: 1.2,
              fontWeight: FontWeight.w900,
            ),
          ),
          const SizedBox(height: 9),
          Expanded(
            child: Text(
              feature.description,
              style: const TextStyle(
                color: AppTheme.mutedText,
                fontSize: 12,
                height: 1.45,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
