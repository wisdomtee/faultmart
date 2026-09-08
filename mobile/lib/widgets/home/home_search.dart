import 'package:flutter/material.dart';

import '../../core/theme/app_theme.dart';

class HomeSearch extends StatefulWidget {
  const HomeSearch({super.key, required this.onSearch});

  final ValueChanged<String> onSearch;

  @override
  State<HomeSearch> createState() => _HomeSearchState();
}

class _HomeSearchState extends State<HomeSearch> {
  final TextEditingController _controller = TextEditingController();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _submitSearch([String? value]) {
    final query = (value ?? _controller.text).trim();

    if (query.isEmpty) {
      return;
    }

    FocusScope.of(context).unfocus();
    widget.onSearch(query);
  }

  void _quickSearch(String query) {
    _controller.text = query;
    _controller.selection = TextSelection.collapsed(
      offset: _controller.text.length,
    );
    _submitSearch(query);
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      color: Colors.white,
      padding: const EdgeInsets.fromLTRB(20, 22, 20, 18),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Find what you need',
            style: TextStyle(
              color: AppTheme.darkText,
              fontSize: 18,
              fontWeight: FontWeight.w800,
              letterSpacing: -0.3,
            ),
          ),
          const SizedBox(height: 5),
          const Text(
            'Search repairable products across Nigeria.',
            style: TextStyle(
              color: AppTheme.mutedText,
              fontSize: 12.5,
              height: 1.4,
            ),
          ),
          const SizedBox(height: 14),
          Container(
            height: 54,
            decoration: BoxDecoration(
              color: const Color(0xFFF7F7F7),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: const Color(0xFFE5E5E5)),
            ),
            child: TextField(
              controller: _controller,
              textInputAction: TextInputAction.search,
              onSubmitted: _submitSearch,
              decoration: InputDecoration(
                hintText: 'Search vehicles, phones, electronics...',
                hintStyle: const TextStyle(
                  color: AppTheme.mutedText,
                  fontSize: 12.5,
                ),
                prefixIcon: const Icon(
                  Icons.search_rounded,
                  color: AppTheme.darkText,
                  size: 22,
                ),
                suffixIcon: Padding(
                  padding: const EdgeInsets.all(7),
                  child: Material(
                    color: AppTheme.darkText,
                    borderRadius: BorderRadius.circular(9),
                    child: InkWell(
                      borderRadius: BorderRadius.circular(9),
                      onTap: () => _submitSearch(),
                      child: const SizedBox(
                        width: 40,
                        height: 40,
                        child: Icon(
                          Icons.search_rounded,
                          color: Colors.white,
                          size: 18,
                        ),
                      ),
                    ),
                  ),
                ),
                border: InputBorder.none,
                contentPadding: const EdgeInsets.symmetric(
                  vertical: 16,
                  horizontal: 4,
                ),
              ),
            ),
          ),
          const SizedBox(height: 12),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                _SearchFilter(
                  icon: Icons.directions_car_outlined,
                  label: 'Vehicles',
                  onTap: () => _quickSearch('vehicle'),
                ),
                const SizedBox(width: 8),
                _SearchFilter(
                  icon: Icons.phone_android_outlined,
                  label: 'Phones',
                  onTap: () => _quickSearch('phone'),
                ),
                const SizedBox(width: 8),
                _SearchFilter(
                  icon: Icons.devices_other_outlined,
                  label: 'Electronics',
                  onTap: () => _quickSearch('electronics'),
                ),
                const SizedBox(width: 8),
                _SearchFilter(
                  icon: Icons.kitchen_outlined,
                  label: 'Appliances',
                  onTap: () => _quickSearch('appliance'),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _SearchFilter extends StatelessWidget {
  const _SearchFilter({
    required this.icon,
    required this.label,
    required this.onTap,
  });

  final IconData icon;
  final String label;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        borderRadius: BorderRadius.circular(999),
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 11, vertical: 8),
          decoration: BoxDecoration(
            color: const Color(0xFFFFF7F0),
            borderRadius: BorderRadius.circular(999),
            border: Border.all(
              color: AppTheme.primaryOrange.withValues(alpha: 0.18),
            ),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.circle, size: 5, color: AppTheme.primaryOrange),
              const SizedBox(width: 6),
              Icon(icon, size: 15, color: AppTheme.darkText),
              const SizedBox(width: 5),
              Text(
                label,
                style: const TextStyle(
                  color: AppTheme.darkText,
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
