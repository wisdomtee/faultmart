import 'package:flutter/material.dart';

import '../../core/theme/app_theme.dart';
import '../../models/review.dart';
import '../../models/user.dart';
import '../../services/auth_service.dart';
import '../../services/review_service.dart';
import '../../widgets/reviews/review_widgets.dart';

class MyReviewsScreen extends StatefulWidget {
  const MyReviewsScreen({super.key});

  @override
  State<MyReviewsScreen> createState() => _MyReviewsScreenState();
}

class _MyReviewsScreenState extends State<MyReviewsScreen> {
  late Future<_MyReviewsData> _future;

  @override
  void initState() {
    super.initState();
    _future = _load();
  }

  Future<_MyReviewsData> _load() async {
    final user = await AuthService.getCurrentUser();

    final results = await Future.wait([
      ReviewService.getUserReviews(user.id),
      ReviewService.getRatingSummary(user.id),
    ]);

    return _MyReviewsData(
      user: user,
      reviews: results[0] as ReviewPage,
      summary: results[1] as RatingSummary,
    );
  }

  void _retry() {
    setState(() {
      _future = _load();
    });
  }

  Future<void> _editReview(Review review) async {
    final result = await showDialog<_ReviewFormResult>(
      context: context,
      builder: (_) => _ReviewDialog(review: review),
    );

    if (result == null) return;

    try {
      await ReviewService.updateReview(
        reviewId: review.id,
        rating: result.rating,
        comment: result.comment,
      );

      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Review updated successfully.')),
      );

      _retry();
    } catch (error) {
      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(error.toString().replaceFirst('Exception: ', '')),
        ),
      );
    }
  }

  Future<void> _deleteReview(Review review) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Delete review?'),
          content: const Text(
            'This review will be permanently removed. This action cannot be undone.',
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context, false),
              child: const Text('Cancel'),
            ),
            FilledButton(
              onPressed: () => Navigator.pop(context, true),
              style: FilledButton.styleFrom(
                backgroundColor: AppTheme.primaryRed,
              ),
              child: const Text('Delete'),
            ),
          ],
        );
      },
    );

    if (confirmed != true) return;

    try {
      await ReviewService.deleteReview(review.id);

      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Review deleted successfully.')),
      );

      _retry();
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
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text('My Reviews'),
        backgroundColor: Colors.white,
        foregroundColor: AppTheme.darkText,
        elevation: 0,
      ),
      body: FutureBuilder<_MyReviewsData>(
        future: _future,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            return _ErrorView(
              message:
                  snapshot.error?.toString().replaceFirst('Exception: ', '') ??
                  'Unable to load your reviews.',
              onRetry: _retry,
            );
          }

          final data = snapshot.data;

          if (data == null) {
            return _ErrorView(
              message: 'Unable to load your review information.',
              onRetry: _retry,
            );
          }

          final reviews = data.reviews.items;

          return RefreshIndicator(
            onRefresh: () async {
              _retry();
              await _future;
            },
            child: ListView(
              padding: const EdgeInsets.fromLTRB(20, 16, 20, 32),
              children: [
                _ProfileHeader(user: data.user),
                const SizedBox(height: 20),
                RatingSummaryCard(summary: data.summary),
                const SizedBox(height: 28),
                const Text(
                  'Reviews You\'ve Written',
                  style: TextStyle(
                    fontSize: 19,
                    fontWeight: FontWeight.w800,
                    color: AppTheme.darkText,
                  ),
                ),
                const SizedBox(height: 12),
                if (reviews.isEmpty)
                  _EmptyReviews()
                else
                  for (final review in reviews) ...[
                    ReviewCard(
                      review: review,
                      onEdit: () => _editReview(review),
                      onDelete: () => _deleteReview(review),
                    ),
                    if (review != reviews.last) const SizedBox(height: 12),
                  ],
              ],
            ),
          );
        },
      ),
    );
  }
}

class _MyReviewsData {
  const _MyReviewsData({
    required this.user,
    required this.reviews,
    required this.summary,
  });

  final User user;
  final ReviewPage reviews;
  final RatingSummary summary;
}

class _ProfileHeader extends StatelessWidget {
  const _ProfileHeader({required this.user});

  final User user;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.lightBackground,
        borderRadius: BorderRadius.circular(18),
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 28,
            backgroundColor: AppTheme.primaryRed.withValues(alpha: 0.10),
            backgroundImage:
                user.profileImage != null && user.profileImage!.isNotEmpty
                ? NetworkImage(user.profileImage!)
                : null,
            child: user.profileImage == null || user.profileImage!.isEmpty
                ? Text(
                    user.initials,
                    style: const TextStyle(
                      fontWeight: FontWeight.w900,
                      color: AppTheme.primaryRed,
                    ),
                  )
                : null,
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  user.displayName,
                  style: const TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.w800,
                    color: AppTheme.darkText,
                  ),
                ),
                if (user.email != null && user.email!.isNotEmpty) ...[
                  const SizedBox(height: 4),
                  Text(
                    user.email!,
                    style: const TextStyle(
                      fontSize: 12,
                      color: AppTheme.mutedText,
                    ),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _EmptyReviews extends StatelessWidget {
  const _EmptyReviews();

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        color: AppTheme.lightBackground,
        borderRadius: BorderRadius.circular(16),
      ),
      child: const Column(
        children: [
          Icon(Icons.rate_review_outlined, size: 42, color: AppTheme.mutedText),
          SizedBox(height: 12),
          Text(
            'No reviews yet',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w800,
              color: AppTheme.darkText,
            ),
          ),
          SizedBox(height: 6),
          Text(
            'Your reviews will appear here after you complete transactions on FaultMart.',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 13,
              height: 1.5,
              color: AppTheme.mutedText,
            ),
          ),
        ],
      ),
    );
  }
}

class _ReviewDialog extends StatefulWidget {
  const _ReviewDialog({required this.review});

  final Review review;

  @override
  State<_ReviewDialog> createState() => _ReviewDialogState();
}

class _ReviewDialogState extends State<_ReviewDialog> {
  late int _rating;
  late final TextEditingController _commentController;

  @override
  void initState() {
    super.initState();
    _rating = widget.review.rating;
    _commentController = TextEditingController(
      text: widget.review.comment ?? '',
    );
  }

  @override
  void dispose() {
    _commentController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Edit Review'),
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Your rating',
              style: TextStyle(fontWeight: FontWeight.w700),
            ),
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(5, (index) {
                final selected = index < _rating;

                return IconButton(
                  onPressed: () {
                    setState(() {
                      _rating = index + 1;
                    });
                  },
                  icon: Icon(
                    selected ? Icons.star_rounded : Icons.star_border_rounded,
                    color: Colors.amber,
                    size: 32,
                  ),
                );
              }),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _commentController,
              maxLines: 4,
              maxLength: 1000,
              decoration: InputDecoration(
                hintText: 'Share your experience...',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('Cancel'),
        ),
        FilledButton(
          onPressed: () {
            Navigator.pop(
              context,
              _ReviewFormResult(
                rating: _rating,
                comment: _commentController.text.trim(),
              ),
            );
          },
          style: FilledButton.styleFrom(backgroundColor: AppTheme.primaryRed),
          child: const Text('Save'),
        ),
      ],
    );
  }
}

class _ReviewFormResult {
  const _ReviewFormResult({required this.rating, required this.comment});

  final int rating;
  final String comment;
}

class _ErrorView extends StatelessWidget {
  const _ErrorView({required this.message, required this.onRetry});

  final String message;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.error_outline_rounded,
              size: 48,
              color: AppTheme.mutedText,
            ),
            const SizedBox(height: 14),
            Text(
              message,
              textAlign: TextAlign.center,
              style: const TextStyle(color: AppTheme.mutedText, height: 1.5),
            ),
            const SizedBox(height: 14),
            OutlinedButton(onPressed: onRetry, child: const Text('Try again')),
          ],
        ),
      ),
    );
  }
}
