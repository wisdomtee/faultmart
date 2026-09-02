import 'package:flutter/material.dart';

import '../../models/review.dart';
import '../../core/theme/app_theme.dart';

class RatingSummaryCard extends StatelessWidget {
  const RatingSummaryCard({super.key, required this.summary});

  final RatingSummary summary;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: Colors.black.withValues(alpha: 0.06)),
      ),
      child: Row(
        children: [
          Column(
            children: [
              Text(
                summary.averageRating.toStringAsFixed(1),
                style: const TextStyle(
                  fontSize: 34,
                  fontWeight: FontWeight.w900,
                  color: AppTheme.darkText,
                ),
              ),
              _Stars(rating: summary.averageRating),
              const SizedBox(height: 4),
              Text(
                '${summary.totalReviews} review${summary.totalReviews == 1 ? '' : 's'}',
                style: const TextStyle(fontSize: 13, color: AppTheme.mutedText),
              ),
            ],
          ),
          const SizedBox(width: 24),
          Expanded(
            child: Column(
              children: [
                _RatingBar(
                  label: '5',
                  count: summary.fiveStar,
                  total: summary.totalReviews,
                ),
                _RatingBar(
                  label: '4',
                  count: summary.fourStar,
                  total: summary.totalReviews,
                ),
                _RatingBar(
                  label: '3',
                  count: summary.threeStar,
                  total: summary.totalReviews,
                ),
                _RatingBar(
                  label: '2',
                  count: summary.twoStar,
                  total: summary.totalReviews,
                ),
                _RatingBar(
                  label: '1',
                  count: summary.oneStar,
                  total: summary.totalReviews,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _RatingBar extends StatelessWidget {
  const _RatingBar({
    required this.label,
    required this.count,
    required this.total,
  });

  final String label;
  final int count;
  final int total;

  @override
  Widget build(BuildContext context) {
    final progress = total == 0 ? 0.0 : count / total;

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2),
      child: Row(
        children: [
          Text(
            label,
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: AppTheme.mutedText,
            ),
          ),
          const SizedBox(width: 4),
          const Icon(Icons.star_rounded, size: 13, color: Colors.amber),
          const SizedBox(width: 6),
          Expanded(
            child: ClipRRect(
              borderRadius: BorderRadius.circular(10),
              child: LinearProgressIndicator(
                value: progress,
                minHeight: 6,
                backgroundColor: AppTheme.lightBackground,
                valueColor: const AlwaysStoppedAnimation<Color>(
                  AppTheme.primaryRed,
                ),
              ),
            ),
          ),
          const SizedBox(width: 8),
          SizedBox(
            width: 24,
            child: Text(
              '$count',
              textAlign: TextAlign.right,
              style: const TextStyle(fontSize: 11, color: AppTheme.mutedText),
            ),
          ),
        ],
      ),
    );
  }
}

class ReviewCard extends StatelessWidget {
  const ReviewCard({
    super.key,
    required this.review,
    this.onEdit,
    this.onDelete,
  });

  final Review review;
  final VoidCallback? onEdit;
  final VoidCallback? onDelete;

  @override
  Widget build(BuildContext context) {
    final reviewer = review.reviewer;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.black.withValues(alpha: 0.06)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              CircleAvatar(
                radius: 20,
                backgroundColor: AppTheme.primaryRed.withValues(alpha: 0.10),
                backgroundImage:
                    reviewer?.profileImage != null &&
                        reviewer!.profileImage!.isNotEmpty
                    ? NetworkImage(reviewer.profileImage!)
                    : null,
                child:
                    reviewer?.profileImage == null ||
                        reviewer!.profileImage!.isEmpty
                    ? Text(
                        _initials(reviewer?.displayName ?? 'FaultMart User'),
                        style: const TextStyle(
                          fontWeight: FontWeight.w800,
                          color: AppTheme.primaryRed,
                        ),
                      )
                    : null,
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      reviewer?.displayName ?? 'FaultMart User',
                      style: const TextStyle(
                        fontWeight: FontWeight.w800,
                        color: AppTheme.darkText,
                      ),
                    ),
                    const SizedBox(height: 3),
                    Row(
                      children: [
                        _Stars(rating: review.rating.toDouble()),
                        if (review.createdAt != null) ...[
                          const SizedBox(width: 8),
                          Text(
                            _formatDate(review.createdAt!),
                            style: const TextStyle(
                              fontSize: 11,
                              color: AppTheme.mutedText,
                            ),
                          ),
                        ],
                      ],
                    ),
                  ],
                ),
              ),
              if (onEdit != null || onDelete != null)
                PopupMenuButton<String>(
                  onSelected: (value) {
                    if (value == 'edit') {
                      onEdit?.call();
                    } else if (value == 'delete') {
                      onDelete?.call();
                    }
                  },
                  itemBuilder: (context) => [
                    if (onEdit != null)
                      const PopupMenuItem(
                        value: 'edit',
                        child: Text('Edit review'),
                      ),
                    if (onDelete != null)
                      const PopupMenuItem(
                        value: 'delete',
                        child: Text('Delete review'),
                      ),
                  ],
                ),
            ],
          ),
          if (review.comment != null && review.comment!.trim().isNotEmpty) ...[
            const SizedBox(height: 12),
            Text(
              review.comment!,
              style: const TextStyle(
                height: 1.45,
                fontSize: 14,
                color: AppTheme.darkText,
              ),
            ),
          ],
        ],
      ),
    );
  }

  String _initials(String name) {
    final parts = name
        .trim()
        .split(RegExp(r'\s+'))
        .where((part) => part.isNotEmpty)
        .toList();

    if (parts.isEmpty) return 'F';
    if (parts.length == 1) return parts.first[0].toUpperCase();

    return '${parts.first[0]}${parts.last[0]}'.toUpperCase();
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }
}

class _Stars extends StatelessWidget {
  const _Stars({required this.rating});

  final double rating;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: List.generate(5, (index) {
        final filled = index + 1 <= rating;
        return Icon(
          filled ? Icons.star_rounded : Icons.star_border_rounded,
          size: 16,
          color: Colors.amber,
        );
      }),
    );
  }
}
