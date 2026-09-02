import 'package:flutter/material.dart';

import '../../models/order.dart';
import '../../models/user.dart';
import '../../services/auth_service.dart';
import '../../services/order_service.dart';
import '../../services/review_service.dart';

class MyOrdersScreen extends StatefulWidget {
  const MyOrdersScreen({super.key});

  @override
  State<MyOrdersScreen> createState() => _MyOrdersScreenState();
}

class _MyOrdersScreenState extends State<MyOrdersScreen> {
  bool _loading = true;
  String? _error;
  List<Order> _orders = const [];
  User? _currentUser;

  @override
  void initState() {
    super.initState();
    _loadOrders();
  }

  Future<void> _loadOrders() async {
    if (mounted) {
      setState(() {
        _loading = true;
        _error = null;
      });
    }

    try {
      final user = await AuthService.getCurrentUser();
      final orders = await OrderService.getMyOrders();

      if (!mounted) return;

      setState(() {
        _currentUser = user;
        _orders = orders;
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;

      setState(() {
        _loading = false;
        _error = e.toString().replaceFirst('Exception: ', '');
      });
    }
  }

  Future<void> _confirmReceipt(Order order) async {
    final shouldConfirm = await showDialog<bool>(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Confirm receipt'),
          content: const Text(
            'Have you received this order? This will mark the order as delivered and make it eligible for review.',
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context, false),
              child: const Text('Not yet'),
            ),
            FilledButton(
              onPressed: () => Navigator.pop(context, true),
              child: const Text('Yes, received'),
            ),
          ],
        );
      },
    );

    if (shouldConfirm != true) return;

    try {
      await OrderService.confirmReceipt(order.id);

      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Order marked as received.'),
        ),
      );

      await _loadOrders();
    } catch (e) {
      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            e.toString().replaceFirst('Exception: ', ''),
          ),
        ),
      );
    }
  }

  Future<void> _cancelOrder(Order order) async {
    final shouldCancel = await showDialog<bool>(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Cancel order'),
          content: const Text(
            'Are you sure you want to cancel this order?',
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context, false),
              child: const Text('Keep order'),
            ),
            FilledButton(
              onPressed: () => Navigator.pop(context, true),
              child: const Text('Cancel order'),
            ),
          ],
        );
      },
    );

    if (shouldCancel != true) return;

    try {
      await OrderService.cancelOrder(order.id);

      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Order cancelled successfully.'),
        ),
      );

      await _loadOrders();
    } catch (e) {
      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            e.toString().replaceFirst('Exception: ', ''),
          ),
        ),
      );
    }
  }

  Future<void> _updateOrderStatus(
    Order order,
    String status,
  ) async {
    final labels = <String, String>{
      'CONFIRMED': 'confirm this order',
      'PROCESSING': 'start processing this order',
      'SHIPPED': 'mark this order as shipped',
    };

    final action = labels[status] ?? 'update this order';

    final shouldUpdate = await showDialog<bool>(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text(
            status == 'CONFIRMED'
                ? 'Confirm order'
                : status == 'PROCESSING'
                    ? 'Start processing'
                    : 'Mark as shipped',
          ),
          content: Text(
            'Are you sure you want to $action?',
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context, false),
              child: const Text('Not now'),
            ),
            FilledButton(
              onPressed: () => Navigator.pop(context, true),
              child: const Text('Continue'),
            ),
          ],
        );
      },
    );

    if (shouldUpdate != true) return;

    try {
      await OrderService.updateStatus(order.id, status);

      if (!mounted) return;

      final successMessage = status == 'CONFIRMED'
          ? 'Order confirmed.'
          : status == 'PROCESSING'
              ? 'Order is now processing.'
              : 'Order marked as shipped.';

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(successMessage),
        ),
      );

      await _loadOrders();
    } catch (e) {
      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            e.toString().replaceFirst('Exception: ', ''),
          ),
        ),
      );
    }
  }

  Future<void> _openReview(Order order) async {
    final result = await showDialog<bool>(
      context: context,
      builder: (context) => _OrderReviewDialog(order: order),
    );

    if (result == true) {
      await _loadOrders();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Orders'),
      ),
      body: RefreshIndicator(
        onRefresh: _loadOrders,
        child: _buildBody(),
      ),
    );
  }

  Widget _buildBody() {
    if (_loading && _orders.isEmpty) {
      return const Center(
        child: CircularProgressIndicator(),
      );
    }

    if (_error != null && _orders.isEmpty) {
      return ListView(
        physics: const AlwaysScrollableScrollPhysics(),
        children: [
          const SizedBox(height: 120),
          Icon(
            Icons.error_outline,
            size: 48,
            color: Theme.of(context).colorScheme.error,
          ),
          const SizedBox(height: 16),
          Center(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Text(
                _error!,
                textAlign: TextAlign.center,
              ),
            ),
          ),
          const SizedBox(height: 16),
          Center(
            child: FilledButton(
              onPressed: _loadOrders,
              child: const Text('Try again'),
            ),
          ),
        ],
      );
    }

    if (_orders.isEmpty) {
      return ListView(
        physics: const AlwaysScrollableScrollPhysics(),
        children: const [
          SizedBox(height: 130),
          Icon(
            Icons.receipt_long_outlined,
            size: 56,
          ),
          SizedBox(height: 16),
          Center(
            child: Text(
              'No orders yet',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
          SizedBox(height: 8),
          Center(
            child: Padding(
              padding: EdgeInsets.symmetric(horizontal: 32),
              child: Text(
                'Your purchases and sales will appear here.',
                textAlign: TextAlign.center,
              ),
            ),
          ),
        ],
      );
    }

    final currentUserId = _currentUser?.id;

    if (currentUserId == null || currentUserId.isEmpty) {
      return ListView(
        physics: const AlwaysScrollableScrollPhysics(),
        children: const [
          SizedBox(height: 120),
          Center(
            child: Text(
              'Unable to determine the current user.',
              textAlign: TextAlign.center,
            ),
          ),
        ],
      );
    }

    return ListView.separated(
      physics: const AlwaysScrollableScrollPhysics(),
      padding: const EdgeInsets.all(16),
      itemCount: _orders.length,
      separatorBuilder: (context, index) => const SizedBox(height: 12),
      itemBuilder: (context, index) {
        final order = _orders[index];

        return _OrderCard(
          order: order,
          isBuyer: order.isBuyerFor(currentUserId),
          isSeller: order.isSellerFor(currentUserId),
          onConfirmReceipt: () => _confirmReceipt(order),
          onCancel: () => _cancelOrder(order),
          onConfirmOrder: () => _updateOrderStatus(
            order,
            'CONFIRMED',
          ),
          onStartProcessing: () => _updateOrderStatus(
            order,
            'PROCESSING',
          ),
          onMarkShipped: () => _updateOrderStatus(
            order,
            'SHIPPED',
          ),
          onReview: () => _openReview(order),
        );
      },
    );
  }
}

class _OrderCard extends StatelessWidget {
  final Order order;
  final bool isBuyer;
  final bool isSeller;
  final VoidCallback onConfirmReceipt;
  final VoidCallback onCancel;
  final VoidCallback onConfirmOrder;
  final VoidCallback onStartProcessing;
  final VoidCallback onMarkShipped;
  final VoidCallback onReview;

  const _OrderCard({
    required this.order,
    required this.isBuyer,
    required this.isSeller,
    required this.onConfirmReceipt,
    required this.onCancel,
    required this.onConfirmOrder,
    required this.onStartProcessing,
    required this.onMarkShipped,
    required this.onReview,
  });

  Color _statusColor(BuildContext context) {
    switch (order.status) {
      case 'DELIVERED':
        return Colors.green;
      case 'CANCELLED':
      case 'REFUNDED':
        return Theme.of(context).colorScheme.error;
      case 'SHIPPED':
        return Colors.blue;
      case 'PROCESSING':
        return Colors.orange;
      case 'CONFIRMED':
        return Colors.indigo;
      default:
        return Theme.of(context).colorScheme.outline;
    }
  }

  @override
  Widget build(BuildContext context) {
    final listing = order.listing;
    final otherParty = isBuyer ? order.seller : order.buyer;
    final imageUrl = listing?.primaryImage;

    return Card(
      clipBehavior: Clip.antiAlias,
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _OrderImage(url: imageUrl),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        listing?.title ?? 'Order',
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontWeight: FontWeight.w700,
                          fontSize: 16,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        order.formattedAmount,
                        style: const TextStyle(
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      const SizedBox(height: 4),
                      if (otherParty != null)
                        Text(
                          '${isBuyer ? 'Seller' : 'Buyer'}: ${otherParty.displayName}',
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                    ],
                  ),
                ),
                const SizedBox(width: 8),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 9,
                    vertical: 5,
                  ),
                  decoration: BoxDecoration(
                    color: _statusColor(context).withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    order.statusLabel,
                    style: TextStyle(
                      color: _statusColor(context),
                      fontWeight: FontWeight.w700,
                      fontSize: 12,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            const Divider(height: 1),
            const SizedBox(height: 10),

            Row(
              children: [
                Icon(
                  isBuyer
                      ? Icons.shopping_bag_outlined
                      : Icons.storefront_outlined,
                  size: 18,
                ),
                const SizedBox(width: 6),
                Text(
                  isBuyer ? 'Purchase' : 'Sale',
                  style: const TextStyle(
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const Spacer(),
                Text(
                  'Order #${order.id.substring(0, order.id.length > 8 ? 8 : order.id.length)}',
                  style: Theme.of(context).textTheme.bodySmall,
                ),
              ],
            ),

            // -----------------------------
            // SELLER ACTIONS
            // -----------------------------
            if (isSeller && order.status == 'PENDING') ...[
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                child: FilledButton.icon(
                  onPressed: onConfirmOrder,
                  icon: const Icon(Icons.check_circle_outline),
                  label: const Text('Confirm Order'),
                ),
              ),
            ],

            if (isSeller && order.status == 'CONFIRMED') ...[
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                child: FilledButton.icon(
                  onPressed: onStartProcessing,
                  icon: const Icon(Icons.settings_outlined),
                  label: const Text('Start Processing'),
                ),
              ),
            ],

            if (isSeller && order.status == 'PROCESSING') ...[
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                child: FilledButton.icon(
                  onPressed: onMarkShipped,
                  icon: const Icon(Icons.local_shipping_outlined),
                  label: const Text('Mark as Shipped'),
                ),
              ),
            ],

            // -----------------------------
            // BUYER ACTIONS
            // -----------------------------
            if (isBuyer &&
                order.status != 'DELIVERED' &&
                order.status != 'CANCELLED' &&
                order.status != 'REFUNDED' &&
                (order.status == 'SHIPPED' ||
                    order.status == 'CONFIRMED' ||
                    order.status == 'PROCESSING')) ...[
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                child: OutlinedButton.icon(
                  onPressed: onConfirmReceipt,
                  icon: const Icon(Icons.check_circle_outline),
                  label: const Text('Confirm receipt'),
                ),
              ),
            ],

            if (isBuyer && order.status == 'PENDING') ...[
              const SizedBox(height: 8),
              SizedBox(
                width: double.infinity,
                child: TextButton(
                  onPressed: onCancel,
                  child: const Text('Cancel order'),
                ),
              ),
            ],

            // -----------------------------
            // REVIEWS
            // -----------------------------
            if (order.reviewStatus.canReview) ...[
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                child: FilledButton.icon(
                  onPressed: onReview,
                  icon: const Icon(Icons.star_outline),
                  label: Text(order.reviewStatus.actionLabel),
                ),
              ),
            ] else if (order.reviewStatus.hasReviewed) ...[
              const SizedBox(height: 10),
              Row(
                children: [
                  Icon(
                    Icons.verified,
                    size: 18,
                    color: Theme.of(context).colorScheme.primary,
                  ),
                  const SizedBox(width: 6),
                  Text(
                    'Review submitted',
                    style: TextStyle(
                      color: Theme.of(context).colorScheme.primary,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class _OrderImage extends StatelessWidget {
  final String? url;

  const _OrderImage({this.url});

  @override
  Widget build(BuildContext context) {
    if (url == null || url!.trim().isEmpty) {
      return Container(
        width: 76,
        height: 76,
        decoration: BoxDecoration(
          color: Theme.of(context).colorScheme.surfaceContainerHighest,
          borderRadius: BorderRadius.circular(10),
        ),
        child: const Icon(Icons.image_outlined),
      );
    }

    return ClipRRect(
      borderRadius: BorderRadius.circular(10),
      child: Image.network(
        url!,
        width: 76,
        height: 76,
        fit: BoxFit.cover,
        errorBuilder: (context, error, stackTrace) {
          return Container(
            width: 76,
            height: 76,
            color: Theme.of(context)
                .colorScheme
                .surfaceContainerHighest,
            child: const Icon(Icons.broken_image_outlined),
          );
        },
      ),
    );
  }
}

class _OrderReviewDialog extends StatefulWidget {
  final Order order;

  const _OrderReviewDialog({
    required this.order,
  });

  @override
  State<_OrderReviewDialog> createState() => _OrderReviewDialogState();
}

class _OrderReviewDialogState extends State<_OrderReviewDialog> {
  int _rating = 0;
  final _commentController = TextEditingController();
  bool _submitting = false;

  @override
  void dispose() {
    _commentController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (_rating == 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please select a rating.'),
        ),
      );
      return;
    }

    setState(() {
      _submitting = true;
    });

    try {
      await ReviewService.createReview(
        orderId: widget.order.id,
        rating: _rating,
        type: widget.order.reviewStatus.type,
        comment: _commentController.text.trim().isEmpty
            ? null
            : _commentController.text.trim(),
      );

      if (!mounted) return;

      Navigator.pop(context, true);

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Review submitted successfully.'),
        ),
      );
    } catch (e) {
      if (!mounted) return;

      setState(() {
        _submitting = false;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            e.toString().replaceFirst('Exception: ', ''),
          ),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final reviewee = widget.order.otherParty;

    return AlertDialog(
      title: Text(
        widget.order.reviewStatus.actionLabel,
      ),
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (reviewee != null)
              Text(
                'How was your experience with ${reviewee.displayName}?',
              ),
            const SizedBox(height: 20),
            const Text(
              'Your rating',
              style: TextStyle(
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 10),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(
                5,
                (index) {
                  final rating = index + 1;

                  return IconButton(
                    onPressed: _submitting
                        ? null
                        : () {
                            setState(() {
                              _rating = rating;
                            });
                          },
                    icon: Icon(
                      rating <= _rating
                          ? Icons.star
                          : Icons.star_border,
                      size: 34,
                    ),
                  );
                },
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _commentController,
              enabled: !_submitting,
              maxLines: 4,
              maxLength: 500,
              decoration: const InputDecoration(
                labelText: 'Comment',
                hintText: 'Share your experience...',
                border: OutlineInputBorder(),
              ),
            ),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: _submitting
              ? null
              : () => Navigator.pop(context, false),
          child: const Text('Cancel'),
        ),
        FilledButton(
          onPressed: _submitting ? null : _submit,
          child: _submitting
              ? const SizedBox(
                  width: 18,
                  height: 18,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                  ),
                )
              : const Text('Submit review'),
        ),
      ],
    );
  }
}
