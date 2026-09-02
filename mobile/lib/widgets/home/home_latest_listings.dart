import 'package:flutter/material.dart';

import '../../models/listing.dart';
import '../listings/listing_card.dart';

class HomeLatestListings extends StatelessWidget {
  const HomeLatestListings({
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
      padding: const EdgeInsets.fromLTRB(20, 32, 20, 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Expanded(
                child: Text(
                  'Latest Listings',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF171717),
                  ),
                ),
              ),
              TextButton(onPressed: onSeeAll, child: const Text('See all')),
            ],
          ),
          const SizedBox(height: 12),
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: listings.length,
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              crossAxisSpacing: 12,
              mainAxisSpacing: 14,
              childAspectRatio: 0.68,
            ),
            itemBuilder: (context, index) {
              final listing = listings[index];

              return ListingCard(listing: listing);
            },
          ),
        ],
      ),
    );
  }
}
