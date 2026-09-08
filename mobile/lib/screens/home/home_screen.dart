import 'package:flutter/material.dart';

import '../../models/homepage.dart';
import '../../services/listing_service.dart';
import '../../widgets/home/home_categories.dart';
import '../../widgets/home/home_cta.dart';
import '../../widgets/home/home_featured_listings.dart';
import '../../widgets/home/home_footer.dart';
import '../../widgets/home/home_header.dart';
import '../profile/notifications_screen.dart';
import '../../widgets/home/home_hero.dart';
import '../../widgets/home/home_how_it_works.dart';
import '../../widgets/home/home_latest_listings.dart';
import '../../widgets/home/home_marketplace_stats.dart';
import '../../widgets/home/home_popular_listings.dart';
import '../../widgets/home/home_search.dart';
import '../../widgets/home/home_why_choose.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({
    super.key,
    required this.onNavigate,
    required this.onFooterAction,
  });

  final void Function(int index, {String? search}) onNavigate;
  final ValueChanged<FooterAction> onFooterAction;

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  HomepageData? _homepage;
  bool _isLoading = true;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _loadHomepage();
  }

  Future<void> _loadHomepage() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final homepage = await ListingService.getHomepage();

      if (!mounted) return;

      setState(() {
        _homepage = homepage;
        _isLoading = false;
      });
    } catch (_) {
      if (!mounted) return;

      setState(() {
        _isLoading = false;
        _errorMessage = 'Unable to load the homepage. Please try again.';
      });
    }
  }

  Future<void> _refreshHomepage() async {
    await _loadHomepage();
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    if (_errorMessage != null) {
      return Scaffold(
        body: SafeArea(
          child: RefreshIndicator(
            onRefresh: _refreshHomepage,
            child: ListView(
              physics: const AlwaysScrollableScrollPhysics(),
              children: [
                SizedBox(height: MediaQuery.of(context).size.height * 0.35),
                Center(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24),
                    child: Column(
                      children: [
                        const Icon(Icons.cloud_off_outlined, size: 56),
                        const SizedBox(height: 16),
                        Text(
                          _errorMessage!,
                          textAlign: TextAlign.center,
                          style: Theme.of(context).textTheme.bodyLarge,
                        ),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: _loadHomepage,
                          child: const Text('Try Again'),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      );
    }

    final homepage = _homepage!;

    return Scaffold(
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: _refreshHomepage,
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                HomeHeader(
                  onNotifications: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (_) => const NotificationsScreen(),
                      ),
                    );
                  },
                  onAccount: () {
                    widget.onNavigate(4);
                  },
                ),

                HomeHero(
                  onBrowseListings: () {
                    widget.onNavigate(1);
                  },
                  onSellItem: () {
                    widget.onNavigate(2);
                  },
                ),

                HomeSearch(
                  onSearch: (query) => widget.onNavigate(1, search: query),
                ),

                HomeCategories(categories: homepage.categories),

                HomeFeaturedListings(
                  listings: homepage.featured,
                  onSeeAll: () {
                    widget.onNavigate(1);
                  },
                ),

                HomeLatestListings(
                  listings: homepage.latest,
                  onSeeAll: () {
                    widget.onNavigate(1);
                  },
                ),

                HomePopularListings(
                  listings: homepage.popular,
                  onSeeAll: () {
                    widget.onNavigate(1);
                  },
                ),

                const HomeHowItWorks(),

                const HomeWhyChoose(),

                HomeMarketplaceStats(statistics: homepage.statistics),

                const HomeCta(),

                HomeFooter(onAction: widget.onFooterAction),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
