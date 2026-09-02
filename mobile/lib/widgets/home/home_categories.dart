import 'package:flutter/material.dart';

import '../../models/homepage.dart';
import '../../core/theme/app_theme.dart';
import 'category_card.dart';

class HomeCategories extends StatelessWidget {
  const HomeCategories({super.key, required this.categories});

  final List<HomepageCategory> categories;

  @override
  Widget build(BuildContext context) {
    if (categories.isEmpty) {
      return const SizedBox.shrink();
    }

    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 30, 0, 4),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Padding(
            padding: EdgeInsets.only(right: 20),
            child: Row(
              children: [
                Expanded(
                  child: Text(
                    'Browse Categories',
                    style: TextStyle(
                      fontSize: 21,
                      fontWeight: FontWeight.w900,
                      color: AppTheme.darkText,
                      letterSpacing: -0.4,
                    ),
                  ),
                ),
                Text(
                  'Explore',
                  style: TextStyle(
                    color: AppTheme.primaryOrange,
                    fontSize: 13,
                    fontWeight: FontWeight.w800,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 5),
          const Padding(
            padding: EdgeInsets.only(right: 20),
            child: Text(
              'Find repairable products by category',
              style: TextStyle(
                color: AppTheme.mutedText,
                fontSize: 13,
                height: 1.4,
              ),
            ),
          ),
          const SizedBox(height: 16),
          SizedBox(
            height: 132,
            child: ListView.separated(
              padding: const EdgeInsets.only(right: 20),
              scrollDirection: Axis.horizontal,
              itemCount: categories.length,
              separatorBuilder: (_, _) => const SizedBox(width: 12),
              itemBuilder: (context, index) {
                final category = categories[index];

                return CategoryCard(
                  title: category.name,
                  icon: _categoryIcon(category),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  IconData _categoryIcon(HomepageCategory category) {
    final name = category.name.toLowerCase();

    if (name.contains('car') || name.contains('vehicle')) {
      return Icons.directions_car_outlined;
    }

    if (name.contains('phone') || name.contains('mobile')) {
      return Icons.smartphone_outlined;
    }

    if (name.contains('appliance')) {
      return Icons.home_repair_service_outlined;
    }

    if (name.contains('part')) {
      return Icons.settings_outlined;
    }

    if (name.contains('electronic')) {
      return Icons.devices_other_outlined;
    }

    if (name.contains('tool')) {
      return Icons.build_outlined;
    }

    return Icons.category_outlined;
  }
}
