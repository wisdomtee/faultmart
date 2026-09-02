import 'package:flutter/material.dart';

import '../../core/theme/app_theme.dart';
import '../../models/listing.dart';
import '../../services/listing_service.dart';
import 'listing_details_screen.dart';

class SavedScreen extends StatefulWidget {
  const SavedScreen({super.key});

  @override
  State<SavedScreen> createState() => _SavedScreenState();
}

class _SavedScreenState extends State<SavedScreen> {
  late Future<List<Listing>> _favoritesFuture;

  @override
  void initState() {
    super.initState();
    _loadFavorites();
  }

  void _loadFavorites() {
    _favoritesFuture = ListingService.getMyFavorites();
  }

  Future<void> _refreshFavorites() async {
    setState(_loadFavorites);
    await _favoritesFuture;
  }

  Future<void> _removeFavorite(Listing listing) async {
    try {
      await ListingService.removeFavorite(listing.id);

      if (!mounted) return;

      setState(_loadFavorites);

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Removed from saved listings.')),
      );
    } catch (error) {
      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(error.toString().replaceFirst('Exception: ', '')),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: RefreshIndicator(
        onRefresh: _refreshFavorites,
        child: FutureBuilder<List<Listing>>(
          future: _favoritesFuture,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const _SavedLoadingView();
            }

            if (snapshot.hasError) {
              return _SavedErrorView(
                message:
                    snapshot.error?.toString().replaceFirst(
                      'Exception: ',
                      '',
                    ) ??
                    'Failed to load saved listings.',
                onRetry: () {
                  setState(_loadFavorites);
                },
              );
            }

            final listings = snapshot.data ?? const <Listing>[];

            if (listings.isEmpty) {
              return const _EmptySavedView();
            }

            return CustomScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              slivers: [
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(20, 20, 20, 8),
                    child: Row(
                      children: [
                        const Expanded(
                          child: Text(
                            'Saved Listings',
                            style: TextStyle(
                              fontSize: 26,
                              fontWeight: FontWeight.w800,
                              color: AppTheme.darkText,
                            ),
                          ),
                        ),
                        Text(
                          '${listings.length}',
                          style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w700,
                            color: AppTheme.mutedText,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(20, 0, 20, 24),
                    child: Text(
                      'Listings you want to keep an eye on.',
                      style: TextStyle(fontSize: 14, color: AppTheme.mutedText),
                    ),
                  ),
                ),
                SliverPadding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  sliver: SliverGrid(
                    delegate: SliverChildBuilderDelegate((context, index) {
                      final listing = listings[index];

                      return _SavedListingCard(
                        listing: listing,
                        onRemove: () => _removeFavorite(listing),
                        onTap: () {
                          Navigator.of(context).push(
                            MaterialPageRoute(
                              builder: (_) =>
                                  ListingDetailsScreen(slug: listing.slug),
                            ),
                          );
                        },
                      );
                    }, childCount: listings.length),
                    gridDelegate:
                        const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 2,
                          crossAxisSpacing: 12,
                          mainAxisSpacing: 14,
                          childAspectRatio: 0.72,
                        ),
                  ),
                ),
                const SliverToBoxAdapter(child: SizedBox(height: 30)),
              ],
            );
          },
        ),
      ),
    );
  }
}

class _SavedListingCard extends StatelessWidget {
  const _SavedListingCard({
    required this.listing,
    required this.onRemove,
    required this.onTap,
  });

  final Listing listing;
  final VoidCallback onRemove;
  final VoidCallback onTap;

  String _locationText() {
    final parts = [listing.city, listing.state, listing.location]
        .where((value) => value != null && value.trim().isNotEmpty)
        .map((value) => value!.trim())
        .toList();

    return parts.isEmpty ? 'Location not specified' : parts.join(', ');
  }

  String _formatPrice() {
    final symbol = listing.currency.toUpperCase() == 'NGN'
        ? '₦'
        : '${listing.currency} ';

    return '$symbol${listing.price.toStringAsFixed(0)}';
  }

  @override
  Widget build(BuildContext context) {
    final imageUrl = listing.images.isNotEmpty
        ? listing.images.first.url
        : null;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(17),
          border: Border.all(color: Colors.black.withValues(alpha: 0.07)),
        ),
        clipBehavior: Clip.antiAlias,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: Container(
                width: double.infinity,
                color: AppTheme.lightBackground,
                child: Stack(
                  fit: StackFit.expand,
                  children: [
                    if (imageUrl != null && imageUrl.isNotEmpty)
                      Image.network(
                        imageUrl,
                        fit: BoxFit.cover,
                        errorBuilder: (_, _, _) => const _ImagePlaceholder(),
                      )
                    else
                      const _ImagePlaceholder(),
                    Positioned(
                      top: 9,
                      right: 9,
                      child: Material(
                        color: Colors.white,
                        shape: const CircleBorder(),
                        child: InkWell(
                          onTap: onRemove,
                          customBorder: const CircleBorder(),
                          child: const SizedBox(
                            width: 36,
                            height: 36,
                            child: Icon(
                              Icons.favorite_rounded,
                              size: 19,
                              color: AppTheme.primaryRed,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(11, 10, 11, 12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    listing.title,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontSize: 13,
                      height: 1.2,
                      fontWeight: FontWeight.w700,
                      color: AppTheme.darkText,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    _formatPrice(),
                    style: const TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w800,
                      color: AppTheme.primaryRed,
                    ),
                  ),
                  const SizedBox(height: 5),
                  Row(
                    children: [
                      const Icon(
                        Icons.location_on_outlined,
                        size: 13,
                        color: AppTheme.mutedText,
                      ),
                      const SizedBox(width: 2),
                      Expanded(
                        child: Text(
                          _locationText(),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontSize: 10,
                            color: AppTheme.mutedText,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ImagePlaceholder extends StatelessWidget {
  const _ImagePlaceholder();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Icon(
        Icons.image_outlined,
        size: 50,
        color: AppTheme.primaryRed.withValues(alpha: 0.55),
      ),
    );
  }
}

class _SavedLoadingView extends StatelessWidget {
  const _SavedLoadingView();

  @override
  Widget build(BuildContext context) {
    return const Center(child: CircularProgressIndicator());
  }
}

class _EmptySavedView extends StatelessWidget {
  const _EmptySavedView();

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      physics: const AlwaysScrollableScrollPhysics(),
      slivers: [
        SliverFillRemaining(
          hasScrollBody: false,
          child: Center(
            child: Padding(
              padding: const EdgeInsets.all(32),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    width: 72,
                    height: 72,
                    decoration: BoxDecoration(
                      color: AppTheme.primaryRed.withValues(alpha: 0.08),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.favorite_border_rounded,
                      size: 34,
                      color: AppTheme.primaryRed,
                    ),
                  ),
                  const SizedBox(height: 18),
                  const Text(
                    'No saved listings yet',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 19,
                      fontWeight: FontWeight.w800,
                      color: AppTheme.darkText,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Tap the heart on a listing to save it here.',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 14,
                      height: 1.5,
                      color: AppTheme.mutedText,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}

class _SavedErrorView extends StatelessWidget {
  const _SavedErrorView({required this.message, required this.onRetry});

  final String message;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.error_outline_rounded,
              size: 48,
              color: AppTheme.primaryRed,
            ),
            const SizedBox(height: 16),
            const Text(
              'Could not load saved listings',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w800,
                color: AppTheme.darkText,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              message,
              textAlign: TextAlign.center,
              style: const TextStyle(
                fontSize: 14,
                height: 1.5,
                color: AppTheme.mutedText,
              ),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: onRetry,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.primaryRed,
                foregroundColor: Colors.white,
              ),
              child: const Text('Try Again'),
            ),
          ],
        ),
      ),
    );
  }
}
