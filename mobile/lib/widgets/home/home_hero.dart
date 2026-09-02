import 'package:flutter/material.dart';

import '../../core/theme/app_theme.dart';

class HomeHero extends StatelessWidget {
  const HomeHero({
    super.key,
    required this.onBrowseListings,
    required this.onSellItem,
  });

  final VoidCallback onBrowseListings;
  final VoidCallback onSellItem;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      decoration: const BoxDecoration(color: Color(0xFF080808)),
      child: Stack(
        children: [
          Positioned.fill(child: CustomPaint(painter: _HeroGridPainter())),
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 30, 20, 30),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Eyebrow
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 7,
                  ),
                  decoration: BoxDecoration(
                    color: AppTheme.primaryOrange.withValues(alpha: 0.10),
                    borderRadius: BorderRadius.circular(999),
                    border: Border.all(
                      color: AppTheme.primaryOrange.withValues(alpha: 0.35),
                    ),
                  ),
                  child: const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        Icons.handyman_outlined,
                        size: 15,
                        color: AppTheme.primaryOrange,
                      ),
                      SizedBox(width: 7),
                      Text(
                        "AFRICA'S REPAIRABLE GOODS MARKETPLACE",
                        style: TextStyle(
                          color: AppTheme.primaryOrange,
                          fontSize: 9.5,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 0.55,
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 22),

                // Main headline
                const Text(
                  'Buy & Sell',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 38,
                    height: 1.02,
                    fontWeight: FontWeight.w900,
                    letterSpacing: -1.1,
                  ),
                ),
                const Text(
                  'Repairable',
                  style: TextStyle(
                    color: AppTheme.primaryOrange,
                    fontSize: 38,
                    height: 1.02,
                    fontWeight: FontWeight.w900,
                    letterSpacing: -1.1,
                  ),
                ),
                const Text(
                  'Products With',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 38,
                    height: 1.02,
                    fontWeight: FontWeight.w900,
                    letterSpacing: -1.1,
                  ),
                ),
                const Text(
                  'Complete',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 38,
                    height: 1.02,
                    fontWeight: FontWeight.w900,
                    letterSpacing: -1.1,
                  ),
                ),
                const Text(
                  'Transparency',
                  style: TextStyle(
                    color: AppTheme.primaryOrange,
                    fontSize: 38,
                    height: 1.02,
                    fontWeight: FontWeight.w900,
                    letterSpacing: -1.1,
                  ),
                ),

                const SizedBox(height: 16),

                const Text(
                  'FaultMart is Africa\'s marketplace for vehicles, '
                  'phones, electronics and appliances that need repair.',
                  style: TextStyle(
                    color: Color(0xFFBDBDBD),
                    fontSize: 14,
                    height: 1.55,
                    fontWeight: FontWeight.w500,
                  ),
                ),

                const SizedBox(height: 22),

                // Action buttons
                Row(
                  children: [
                    Expanded(
                      child: ElevatedButton(
                        onPressed: onBrowseListings,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.primaryOrange,
                          foregroundColor: Colors.white,
                          elevation: 0,
                          padding: const EdgeInsets.symmetric(vertical: 15),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.search_rounded, size: 18),
                            SizedBox(width: 7),
                            Text(
                              'Browse Listings',
                              style: TextStyle(
                                fontWeight: FontWeight.w800,
                                fontSize: 13,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: OutlinedButton(
                        onPressed: onSellItem,
                        style: OutlinedButton.styleFrom(
                          foregroundColor: Colors.white,
                          side: const BorderSide(color: Color(0xFF404040)),
                          padding: const EdgeInsets.symmetric(vertical: 15),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.add_rounded, size: 18),
                            SizedBox(width: 6),
                            Text(
                              'Sell Your Item',
                              style: TextStyle(
                                fontWeight: FontWeight.w800,
                                fontSize: 13,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 26),

                // Listing showcase
                const _HeroListingShowcase(),

                const SizedBox(height: 22),

                // Trust row
                const Row(
                  children: [
                    Expanded(
                      child: _HeroTrustItem(
                        icon: Icons.verified_outlined,
                        title: 'Verified',
                        subtitle: 'Sellers',
                      ),
                    ),
                    Expanded(
                      child: _HeroTrustItem(
                        icon: Icons.visibility_outlined,
                        title: 'Transparent',
                        subtitle: 'Listings',
                      ),
                    ),
                    Expanded(
                      child: _HeroTrustItem(
                        icon: Icons.location_on_outlined,
                        title: 'Across',
                        subtitle: 'Nigeria',
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _HeroListingShowcase extends StatelessWidget {
  const _HeroListingShowcase();

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFFFF8A3D), Color(0xFFF97316)],
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: AppTheme.primaryOrange.withValues(alpha: 0.20),
            blurRadius: 24,
            offset: const Offset(0, 12),
          ),
        ],
      ),
      child: Stack(
        children: [
          const Positioned(
            right: -15,
            top: -20,
            child: Icon(
              Icons.directions_car_rounded,
              size: 115,
              color: Color(0x22FFFFFF),
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 9,
                      vertical: 5,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.92),
                      borderRadius: BorderRadius.circular(999),
                    ),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          Icons.build_circle_outlined,
                          size: 13,
                          color: AppTheme.primaryOrange,
                        ),
                        SizedBox(width: 5),
                        Text(
                          'FAULTY',
                          style: TextStyle(
                            color: AppTheme.darkText,
                            fontSize: 9,
                            fontWeight: FontWeight.w900,
                            letterSpacing: 0.5,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const Spacer(),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 5,
                    ),
                    decoration: BoxDecoration(
                      color: const Color(0xFF166534),
                      borderRadius: BorderRadius.circular(999),
                    ),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          Icons.verified_rounded,
                          size: 12,
                          color: Colors.white,
                        ),
                        SizedBox(width: 4),
                        Text(
                          'VERIFIED SELLER',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 8,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 62),

              const Text(
                'Toyota Camry',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 22,
                  fontWeight: FontWeight.w900,
                  letterSpacing: -0.4,
                ),
              ),

              const SizedBox(height: 4),

              const Text(
                '2010 • Automatic • Lagos',
                style: TextStyle(
                  color: Color(0xFFFFF1E8),
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                ),
              ),

              const SizedBox(height: 14),

              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(11),
                decoration: BoxDecoration(
                  color: Colors.black.withValues(alpha: 0.18),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Icon(
                      Icons.report_problem_outlined,
                      size: 17,
                      color: Colors.white,
                    ),
                    SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'Reported fault: Engine issue. Full condition disclosed.',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 10.5,
                          height: 1.35,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _HeroTrustItem extends StatelessWidget {
  const _HeroTrustItem({
    required this.icon,
    required this.title,
    required this.subtitle,
  });

  final IconData icon;
  final String title;
  final String subtitle;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, size: 18, color: AppTheme.primaryOrange),
        const SizedBox(width: 7),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 10.5,
                fontWeight: FontWeight.w800,
              ),
            ),
            Text(
              subtitle,
              style: const TextStyle(
                color: Color(0xFF8A8A8A),
                fontSize: 9.5,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ],
    );
  }
}

class _HeroGridPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0x12FFFFFF)
      ..strokeWidth = 0.5;

    const spacing = 32.0;

    for (double x = 0; x <= size.width; x += spacing) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), paint);
    }

    for (double y = 0; y <= size.height; y += spacing) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), paint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
