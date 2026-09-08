import 'package:flutter/material.dart';

import '../../core/theme/app_theme.dart';
import '../../models/listing.dart';
import '../../screens/listings/listing_details_screen.dart';
import '../../services/listing_service.dart';

class ListingCard extends StatefulWidget {
  const ListingCard({super.key, required this.listing});

  final Listing listing;

  @override
  State<ListingCard> createState() => _ListingCardState();
}

class _ListingCardState extends State<ListingCard> {
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
    return Material(
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
          ),
          clipBehavior: Clip.antiAlias,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Stack(
  children: [
    SizedBox(
      width: double.infinity,
      child: AspectRatio(
        aspectRatio: 1.25,
        child: _buildImage(),
      ),
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
  ],
),
              Padding(
                padding: const EdgeInsets.fromLTRB(13, 12, 13, 14),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      listing.title,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        fontSize: 14,
                        height: 1.25,
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
                        color: AppTheme.primaryOrange,
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
                    Text(
                      _condition(listing),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                        color: AppTheme.mutedText,
                      ),
                    ),
                  ],
                ),
              ),
            ],
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
        size: 36,
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
          width: 36,
          height: 36,
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
                    size: 20,
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
