import 'package:flutter/material.dart';

import '../../core/theme/app_theme.dart';
import '../../models/listing.dart';
import '../../screens/listings/listing_details_screen.dart';
import '../../services/listing_service.dart';

class FeaturedListingCard extends StatefulWidget {
  const FeaturedListingCard({super.key, required this.listing});

  final Listing listing;

  @override
  State<FeaturedListingCard> createState() => _FeaturedListingCardState();
}

class _FeaturedListingCardState extends State<FeaturedListingCard> {
  bool _isFavorited = false;
  bool _favoriteStatusLoaded = false;
  bool _isFavoriteLoading = false;

  Listing get listing => widget.listing;

  @override
  void initState() {
    super.initState();
    _loadFavoriteStatus();
  }

  Future<void> _loadFavoriteStatus() async {
    if (_favoriteStatusLoaded) return;

    try {
      final isFavorited = await ListingService.isFavorited(listing.id);

      if (!mounted) return;

      setState(() {
        _isFavorited = isFavorited;
        _favoriteStatusLoaded = true;
      });
    } catch (_) {
      if (!mounted) return;

      setState(() {
        _favoriteStatusLoaded = true;
      });
    }
  }

  Future<void> _toggleFavorite() async {
    if (_isFavoriteLoading) return;

    setState(() {
      _isFavoriteLoading = true;
    });

    try {
      if (_isFavorited) {
        await ListingService.removeFavorite(listing.id);
      } else {
        await ListingService.addFavorite(listing.id);
      }

      if (!mounted) return;

      setState(() {
        _isFavorited = !_isFavorited;
      });
    } catch (error) {
      if (!mounted) return;

      final message = error.toString().replaceFirst('Exception: ', '');

      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text(message)));
    } finally {
      if (mounted) {
        setState(() {
          _isFavoriteLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 230,
      child: Material(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        clipBehavior: Clip.antiAlias,
        child: InkWell(
          onTap: () {
            Navigator.of(context).push(
              MaterialPageRoute(
                builder: (_) => ListingDetailsScreen(slug: listing.slug),
              ),
            );
          },
          child: Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: Colors.black.withValues(alpha: 0.07)),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.04),
                  blurRadius: 12,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            clipBehavior: Clip.antiAlias,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Stack(
                  children: [
                    SizedBox(
                      height: 155,
                      width: double.infinity,
                      child: _buildImage(),
                    ),
                    Positioned(
                      top: 10,
                      right: 10,
                      child: _FavoriteButton(
                        isFavorited: _isFavorited,
                        isLoading: _isFavoriteLoading,
                        onPressed: _toggleFavorite,
                      ),
                    ),
                    Positioned(
                      top: 10,
                      left: 10,
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 9,
                          vertical: 5,
                        ),
                        decoration: BoxDecoration(
                          color: AppTheme.primaryRed,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Text(
                          'FEATURED',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 9,
                            fontWeight: FontWeight.w800,
                            letterSpacing: 0.4,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                Padding(
                  padding: const EdgeInsets.fromLTRB(13, 12, 13, 13),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        listing.title,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w700,
                          color: AppTheme.darkText,
                        ),
                      ),
                      const SizedBox(height: 7),
                      Text(
                        _formatPrice(listing.price, listing.currency),
                        style: const TextStyle(
                          fontSize: 17,
                          fontWeight: FontWeight.w800,
                          color: AppTheme.primaryRed,
                        ),
                      ),
                      const SizedBox(height: 7),
                      Row(
                        children: [
                          const Icon(
                            Icons.location_on_outlined,
                            size: 14,
                            color: AppTheme.mutedText,
                          ),
                          const SizedBox(width: 3),
                          Expanded(
                            child: Text(
                              _location(listing),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                fontSize: 11,
                                color: AppTheme.mutedText,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 7,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: AppTheme.lightBackground,
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          _condition(listing),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w600,
                            color: AppTheme.darkText,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildImage() {
    if (listing.images.isEmpty || listing.images.first.url.trim().isEmpty) {
      return _placeholderImage();
    }

    return Image.network(
      listing.images.first.url,
      fit: BoxFit.cover,
      width: double.infinity,
      height: double.infinity,
      errorBuilder: (_, _, _) => _placeholderImage(),
      loadingBuilder: (context, child, loadingProgress) {
        if (loadingProgress == null) {
          return child;
        }

        return Container(
          color: AppTheme.lightBackground,
          alignment: Alignment.center,
          child: const SizedBox(
            width: 24,
            height: 24,
            child: CircularProgressIndicator(strokeWidth: 2),
          ),
        );
      },
    );
  }

  Widget _placeholderImage() {
    return Container(
      color: AppTheme.lightBackground,
      alignment: Alignment.center,
      child: const Icon(
        Icons.image_not_supported_outlined,
        size: 38,
        color: AppTheme.mutedText,
      ),
    );
  }

  String _location(Listing listing) {
    if (listing.location?.trim().isNotEmpty == true) {
      return listing.location!;
    }

    if (listing.city?.trim().isNotEmpty == true) {
      return listing.city!;
    }

    if (listing.state?.trim().isNotEmpty == true) {
      return listing.state!;
    }

    return 'Nigeria';
  }

  String _condition(Listing listing) {
    if (listing.faultDescription?.trim().isNotEmpty == true) {
      return listing.faultDescription!;
    }

    if (listing.condition?.trim().isNotEmpty == true) {
      return listing.condition!;
    }

    return 'Needs Repair';
  }

  String _formatPrice(double price, String currency) {
    final amount = price.toStringAsFixed(0);

    final formatted = amount.replaceAllMapped(
      RegExp(r'(\d)(?=(\d{3})+(?!\d))'),
      (match) => '${match[1]},',
    );

    if (currency.toUpperCase() == 'NGN') {
      return '₦$formatted';
    }

    return '$currency $formatted';
  }
}

class _FavoriteButton extends StatelessWidget {
  const _FavoriteButton({
    required this.isFavorited,
    required this.isLoading,
    required this.onPressed,
  });

  final bool isFavorited;
  final bool isLoading;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white.withValues(alpha: 0.94),
      shape: const CircleBorder(),
      child: InkWell(
        customBorder: const CircleBorder(),
        onTap: isLoading ? null : onPressed,
        child: SizedBox(
          width: 34,
          height: 34,
          child: Center(
            child: isLoading
                ? const SizedBox(
                    width: 16,
                    height: 16,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                : Icon(
                    isFavorited
                        ? Icons.favorite_rounded
                        : Icons.favorite_border_rounded,
                    size: 19,
                    color: isFavorited
                        ? AppTheme.primaryRed
                        : AppTheme.darkText,
                  ),
          ),
        ),
      ),
    );
  }
}
