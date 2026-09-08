import 'package:flutter/material.dart';

import '../../core/theme/app_theme.dart';
import '../../models/listing.dart';
import '../../models/review.dart';
import '../../services/auth_service.dart';
import '../../services/conversation_service.dart';
import '../../services/listing_service.dart';
import '../../services/review_service.dart';
import '../../widgets/reviews/review_widgets.dart';
import '../auth/login_screen.dart';
import '../messages/conversation_screen.dart';

class ListingDetailsScreen extends StatefulWidget {
  const ListingDetailsScreen({super.key, required this.slug});

  final String slug;

  @override
  State<ListingDetailsScreen> createState() => _ListingDetailsScreenState();
}

class _ListingDetailsScreenState extends State<ListingDetailsScreen> {
  late Future<Listing> _listingFuture;

  bool _isFavorited = false;
  bool _favoriteLoading = false;
  bool _favoriteStatusLoading = false;
  String? _favoriteListingId;
  bool _favoriteStatusLoaded = false;

  @override
  void initState() {
    super.initState();

    _listingFuture = ListingService.getListingBySlug(widget.slug);
  }

  Future<void> _loadFavoriteStatus(String listingId) async {
    if (_favoriteStatusLoaded && _favoriteListingId == listingId) {
      return;
    }

    if (_favoriteStatusLoading && _favoriteListingId == listingId) {
      return;
    }

    _favoriteStatusLoading = true;
    _favoriteListingId = listingId;

    try {
      final isFavorited = await ListingService.isFavorited(listingId);

      if (!mounted) return;

      setState(() {
        _isFavorited = isFavorited;
        _favoriteListingId = listingId;
        _favoriteStatusLoaded = true;
      });
    } catch (_) {
      if (!mounted) return;

      setState(() {
        _favoriteListingId = listingId;
        _favoriteStatusLoaded = true;
      });
    }
  }

  Future<void> _toggleFavorite(String listingId) async {
    if (_favoriteLoading) return;

    setState(() {
      _favoriteLoading = true;
    });

    try {
      if (_isFavorited) {
        await ListingService.removeFavorite(listingId);

        if (!mounted) return;

        setState(() {
          _isFavorited = false;
        });

        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Removed from saved listings.')),
        );
      } else {
        await ListingService.addFavorite(listingId);

        if (!mounted) return;

        setState(() {
          _isFavorited = true;
        });

        ScaffoldMessenger.of(
          context,
        ).showSnackBar(const SnackBar(content: Text('Listing saved.')));
      }
    } catch (error) {
      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(error.toString().replaceFirst('Exception: ', '')),
        ),
      );
    } finally {
      if (mounted) {
        setState(() {
          _favoriteLoading = false;
        });
      }
    }
  }

Future<void> _contactSeller(Listing listing) async {
  final seller = listing.seller;

  if (seller == null || seller.id.isEmpty) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Seller information is unavailable.'),
      ),
    );
    return;
  }

  try {
    final user = await AuthService.getCurrentUser();

    if (!mounted) return;

    if (user.id == seller.id) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text(
            'You cannot contact yourself about your own listing.',
          ),
        ),
      );
      return;
    }

    final conversation =
        await ConversationService.createConversation(
      listingId: listing.id,
      sellerId: seller.id,
    );

    if (!mounted) return;

    await Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => ConversationScreen(
          conversation: conversation,
        ),
      ),
    );
  } catch (error) {
    if (!mounted) return;

    final message = error
        .toString()
        .replaceFirst('Exception: ', '');

    // If the user is not authenticated, take them through
    // the normal login flow. No session is cleared here.
    if (message.toLowerCase().contains('logged in') ||
        message.toLowerCase().contains('must be logged')) {
      await Navigator.of(context).push(
        MaterialPageRoute(
          builder: (_) => const LoginScreen(),
        ),
      );
      return;
    }

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message)),
    );
  }
}

  void _retry() {
    setState(() {
      _favoriteStatusLoaded = false;
      _favoriteListingId = null;
      _listingFuture = ListingService.getListingBySlug(widget.slug);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text('Listing Details'),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
      ),
      body: FutureBuilder<Listing>(
        future: _listingFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            return _ErrorView(
              message:
                  snapshot.error?.toString().replaceFirst('Exception: ', '') ??
                  'Failed to load listing.',
              onRetry: _retry,
            );
          }

          final listing = snapshot.data;

          if (listing == null) {
            return const _ErrorView(message: 'Listing not found.');
          }

          _loadFavoriteStatus(listing.id);

          return _ListingDetailsContent(
  listing: listing,
  isFavorited: _isFavorited,
  favoriteLoading: _favoriteLoading,
  onFavoritePressed: () => _toggleFavorite(listing.id),
  onContactSeller: () => _contactSeller(listing),
);
        },
      ),
    );
  }
}

class _ListingDetailsContent extends StatelessWidget {
  const _ListingDetailsContent({
    required this.listing,
    required this.isFavorited,
    required this.favoriteLoading,
    required this.onFavoritePressed,
    required this.onContactSeller,
  });

  final Listing listing;
  final bool isFavorited;
  final bool favoriteLoading;
  final VoidCallback onFavoritePressed;
  final Future<void> Function() onContactSeller;

  @override
  Widget build(BuildContext context) {
    final sellerName = listing.seller?.displayName ?? 'Seller';

    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _ImageSection(listing: listing),

          Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: Text(
                        listing.title,
                        style: const TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    IconButton(
                      onPressed: favoriteLoading ? null : onFavoritePressed,
                      tooltip: isFavorited
                          ? 'Remove from saved'
                          : 'Save listing',
                      icon: favoriteLoading
                          ? const SizedBox(
                              width: 22,
                              height: 22,
                              child: CircularProgressIndicator(strokeWidth: 2),
                            )
                          : Icon(
                              isFavorited
                                  ? Icons.favorite_rounded
                                  : Icons.favorite_border_rounded,
                              color: isFavorited
                                  ? AppTheme.primaryRed
                                  : Colors.black54,
                              size: 28,
                            ),
                    ),
                  ],
                ),

                const SizedBox(height: 10),

                Text(
                  _formatPrice(listing.price, listing.currency),
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.w800,
                    color: AppTheme.primaryRed,
                  ),
                ),

                const SizedBox(height: 8),

                if (listing.isNegotiable)
                  const Text(
                    'Negotiable',
                    style: TextStyle(
                      color: Colors.green,
                      fontWeight: FontWeight.w600,
                    ),
                  ),

                const SizedBox(height: 20),

                _InfoRow(
                  icon: Icons.location_on_outlined,
                  label: 'Location',
                  value: _locationText(listing),
                ),

                if (listing.condition != null)
                  _InfoRow(
                    icon: Icons.inventory_2_outlined,
                    label: 'Condition',
                    value: listing.condition!,
                  ),

                if (listing.faultSeverity != null)
                  _InfoRow(
                    icon: Icons.warning_amber_rounded,
                    label: 'Fault severity',
                    value: listing.faultSeverity!,
                  ),

                if (listing.category != null)
                  _InfoRow(
                    icon: Icons.category_outlined,
                    label: 'Category',
                    value: listing.category!.name,
                  ),

                _InfoRow(
                  icon: Icons.visibility_outlined,
                  label: 'Views',
                  value: listing.views.toString(),
                ),

                const SizedBox(height: 24),

                const Text(
                  'Description',
                  style: TextStyle(fontSize: 19, fontWeight: FontWeight.w700),
                ),

                const SizedBox(height: 10),

                Text(
                  listing.description.isEmpty
                      ? 'No description provided.'
                      : listing.description,
                  style: const TextStyle(
                    fontSize: 15,
                    height: 1.6,
                    color: Colors.black87,
                  ),
                ),

                if (listing.faultDescription != null &&
                    listing.faultDescription!.trim().isNotEmpty) ...[
                  const SizedBox(height: 24),
                  const Text(
                    'Fault Description',
                    style: TextStyle(fontSize: 19, fontWeight: FontWeight.w700),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    listing.faultDescription!,
                    style: const TextStyle(
                      fontSize: 15,
                      height: 1.6,
                      color: Colors.black87,
                    ),
                  ),
                ],

                const SizedBox(height: 28),

                const Text(
                  'Seller',
                  style: TextStyle(fontSize: 19, fontWeight: FontWeight.w700),
                ),

                const SizedBox(height: 12),

                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.grey.shade50,
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: Row(
                    children: [
                      CircleAvatar(
                        radius: 24,
                        backgroundColor: AppTheme.primaryRed.withValues(
                          alpha: 0.10,
                        ),
                        backgroundImage: listing.seller?.profileImage != null
                            ? NetworkImage(listing.seller!.profileImage!)
                            : null,
                        child: listing.seller?.profileImage == null
                            ? const Icon(
                                Icons.person_outline,
                                color: AppTheme.primaryRed,
                              )
                            : null,
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          sellerName,
                          style: const TextStyle(
                            fontWeight: FontWeight.w700,
                            fontSize: 16,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 30),

                if (listing.seller != null) ...[
                  _SellerReviewsSection(sellerId: listing.seller!.id),
                  const SizedBox(height: 30),
                ],

                const SizedBox(height: 30),

                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: onContactSeller,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.primaryRed,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: const Text(
                      'Contact Seller',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                ),

                const SizedBox(height: 30),
              ],
            ),
          ),
        ],
      ),
    );
  }

  static String _locationText(Listing listing) {
    final parts = [listing.city, listing.state, listing.location]
        .where((value) => value != null && value.trim().isNotEmpty)
        .map((value) => value!.trim())
        .toList();

    if (parts.isEmpty) {
      return 'Location not specified';
    }

    return parts.join(', ');
  }

  static String _formatPrice(double value, String currency) {
    final symbol = currency.toUpperCase() == 'NGN' ? '₦' : '$currency ';

    return '$symbol${value.toStringAsFixed(0)}';
  }
}

class _SellerReviewsSection extends StatefulWidget {
  const _SellerReviewsSection({required this.sellerId});

  final String sellerId;

  @override
  State<_SellerReviewsSection> createState() => _SellerReviewsSectionState();
}

class _SellerReviewsSectionState extends State<_SellerReviewsSection> {
  late Future<RatingSummary> _summaryFuture;
  late Future<ReviewPage> _reviewsFuture;

  @override
  void initState() {
    super.initState();
    _loadReviews();
  }

  void _loadReviews() {
    _summaryFuture = ReviewService.getRatingSummary(widget.sellerId);
    _reviewsFuture = ReviewService.getUserReviews(widget.sellerId);
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Seller Rating',
          style: TextStyle(fontSize: 19, fontWeight: FontWeight.w700),
        ),
        const SizedBox(height: 12),
        FutureBuilder<RatingSummary>(
          future: _summaryFuture,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Center(
                child: Padding(
                  padding: EdgeInsets.all(20),
                  child: CircularProgressIndicator(),
                ),
              );
            }

            if (snapshot.hasError) {
              return _ReviewError(
                message:
                    snapshot.error?.toString().replaceFirst(
                      'Exception: ',
                      '',
                    ) ??
                    'Unable to load seller rating.',
                onRetry: () {
                  setState(_loadReviews);
                },
              );
            }

            final summary = snapshot.data;

            if (summary == null) {
              return const Text('No rating information available.');
            }

            return RatingSummaryCard(summary: summary);
          },
        ),
        const SizedBox(height: 24),
        const Text(
          'Customer Reviews',
          style: TextStyle(fontSize: 19, fontWeight: FontWeight.w700),
        ),
        const SizedBox(height: 12),
        FutureBuilder<ReviewPage>(
          future: _reviewsFuture,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Center(
                child: Padding(
                  padding: EdgeInsets.all(20),
                  child: CircularProgressIndicator(),
                ),
              );
            }

            if (snapshot.hasError) {
              return _ReviewError(
                message:
                    snapshot.error?.toString().replaceFirst(
                      'Exception: ',
                      '',
                    ) ??
                    'Unable to load reviews.',
                onRetry: () {
                  setState(_loadReviews);
                },
              );
            }

            final page = snapshot.data;

            if (page == null || page.items.isEmpty) {
              return Container(
                width: double.infinity,
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: Colors.grey.shade50,
                  borderRadius: BorderRadius.circular(14),
                ),
                child: const Text(
                  'No reviews yet. Be the first to review this seller after a completed transaction.',
                  style: TextStyle(color: AppTheme.mutedText, height: 1.5),
                ),
              );
            }

            return Column(
              children: [
                for (final review in page.items) ...[
                  ReviewCard(review: review),
                  if (review != page.items.last) const SizedBox(height: 12),
                ],
              ],
            );
          },
        ),
      ],
    );
  }
}

class _ReviewError extends StatelessWidget {
  const _ReviewError({required this.message, required this.onRetry});

  final String message;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.grey.shade50,
        borderRadius: BorderRadius.circular(14),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            message,
            style: const TextStyle(color: AppTheme.mutedText, height: 1.4),
          ),
          const SizedBox(height: 10),
          TextButton(onPressed: onRetry, child: const Text('Try again')),
        ],
      ),
    );
  }
}

class _ImageSection extends StatelessWidget {
  const _ImageSection({required this.listing});

  final Listing listing;

  @override
  Widget build(BuildContext context) {
    if (listing.images.isEmpty) {
      return _placeholderImage(context);
    }

    return SizedBox(
      height: 280,
      width: double.infinity,
      child: PageView.builder(
        itemCount: listing.images.length,
        itemBuilder: (context, index) {
          final image = listing.images[index];

          return Image.network(
            image.url,
            fit: BoxFit.cover,
            errorBuilder: (_, _, _) => _placeholderImage(context),
          );
        },
      ),
    );
  }

  Widget _placeholderImage(BuildContext context) {
    return Container(
      height: 280,
      width: double.infinity,
      color: AppTheme.lightBackground,
      child: const Center(
        child: Icon(
          Icons.image_not_supported_outlined,
          size: 60,
          color: AppTheme.mutedText,
        ),
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  const _InfoRow({
    required this.icon,
    required this.label,
    required this.value,
  });

  final IconData icon;
  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 20, color: AppTheme.mutedText),
          const SizedBox(width: 10),
          SizedBox(
            width: 105,
            child: Text(
              label,
              style: const TextStyle(
                fontWeight: FontWeight.w600,
                color: AppTheme.mutedText,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(fontWeight: FontWeight.w500),
            ),
          ),
        ],
      ),
    );
  }
}

class _ErrorView extends StatelessWidget {
  const _ErrorView({required this.message, this.onRetry});

  final String message;
  final VoidCallback? onRetry;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(
              Icons.error_outline_rounded,
              size: 48,
              color: AppTheme.primaryRed,
            ),
            const SizedBox(height: 12),
            Text(message, textAlign: TextAlign.center),
            if (onRetry != null) ...[
              const SizedBox(height: 16),
              ElevatedButton(onPressed: onRetry, child: const Text('Retry')),
            ],
          ],
        ),
      ),
    );
  }
}
