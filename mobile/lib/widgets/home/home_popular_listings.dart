import 'package:flutter/material.dart';

import '../../models/listing.dart';
import 'featured_listing_card.dart';

class HomePopularListings extends StatelessWidget {
  const HomePopularListings({
    super.key,
    required this.listings,
    required this.onSeeAll,
  });

  final List<Listing> listings;
  final VoidCallback onSeeAll;

  @override
  Widget build(BuildContext context) {
    if (listings.isEmpty) {
      return const SizedBox.shrink();
    }

    return Padding(
      padding: const EdgeInsets.only(top: 36),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Row(
              children: [
                const Expanded(
                  child: Text(
                    'Popular Listings',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w900,
                      color: Color(0xFF171717),
                    ),
                  ),
                ),
                TextButton(onPressed: onSeeAll, child: const Text('See all')),
              ],
            ),
          ),
          const SizedBox(height: 12),
          SizedBox(
            height: 310,
            child: ListView.separated(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              scrollDirection: Axis.horizontal,
              itemCount: listings.length,
              separatorBuilder: (_, _) => const SizedBox(width: 14),
              itemBuilder: (_, index) {
                final listing = listings[index];

                return FeaturedListingCard(listing: listing);
              },
            ),
          ),
        ],
      ),
    );
  }
}
