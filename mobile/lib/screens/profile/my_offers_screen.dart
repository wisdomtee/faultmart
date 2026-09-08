import 'package:flutter/material.dart';

import '../../models/offer.dart';
import '../../services/offer_service.dart';

class MyOffersScreen extends StatefulWidget {
  const MyOffersScreen({super.key});

  @override
  State<MyOffersScreen> createState() => _MyOffersScreenState();
}

class _MyOffersScreenState extends State<MyOffersScreen> {
  late Future<List<Offer>> _myOffersFuture;
  late Future<List<Offer>> _receivedOffersFuture;

  @override
  void initState() {
    super.initState();
    _loadOffers();
  }

  void _loadOffers() {
    _myOffersFuture = OfferService.getMyOffers();
    _receivedOffersFuture = OfferService.getReceivedOffers();
  }

  Future<void> _refresh() async {
    setState(_loadOffers);
    await Future.wait([
      _myOffersFuture,
      _receivedOffersFuture,
    ]);
  }

  Future<void> _withdrawOffer(Offer offer) async {
    final confirmed = await _confirmAction(
      title: 'Withdraw offer?',
      message: 'This will withdraw your offer for "${offer.listing?.title ?? 'this listing'}".',
      confirmLabel: 'Withdraw',
    );

    if (!confirmed || !mounted) return;

    await _runAction(
      action: () => OfferService.withdrawOffer(offer.id),
      successMessage: 'Offer withdrawn.',
    );
  }

  Future<void> _rejectOffer(Offer offer) async {
    final confirmed = await _confirmAction(
      title: 'Reject offer?',
      message: 'Reject the offer from ${offer.buyer?.displayName ?? 'this buyer'}?',
      confirmLabel: 'Reject',
    );

    if (!confirmed || !mounted) return;

    await _runAction(
      action: () => OfferService.rejectOffer(offer.id),
      successMessage: 'Offer rejected.',
    );
  }

  Future<void> _acceptOffer(Offer offer) async {
    final confirmed = await _confirmAction(
      title: 'Accept offer?',
      message:
          'Accept ${_formatAmount(offer)} from ${offer.buyer?.displayName ?? 'this buyer'}?',
      confirmLabel: 'Accept',
    );

    if (!confirmed || !mounted) return;

    await _runAction(
      action: () => OfferService.acceptOffer(offer.id),
      successMessage: 'Offer accepted and order created.',
    );
  }

  Future<void> _runAction({
    required Future<void> Function() action,
    required String successMessage,
  }) async {
    _showLoading();

    try {
      await action();

      if (!mounted) return;

      Navigator.of(context).pop();

      setState(_loadOffers);

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(successMessage)),
      );
    } catch (error) {
      if (!mounted) return;

      Navigator.of(context).pop();

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(_cleanError(error)),
        ),
      );
    }
  }

  void _showLoading() {
    showDialog<void>(
      context: context,
      barrierDismissible: false,
      builder: (_) => const Center(
        child: Card(
          child: Padding(
            padding: EdgeInsets.all(24),
            child: CircularProgressIndicator(),
          ),
        ),
      ),
    );
  }

  Future<bool> _confirmAction({
    required String title,
    required String message,
    required String confirmLabel,
  }) async {
    final result = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(title),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () => Navigator.of(context).pop(true),
            child: Text(confirmLabel),
          ),
        ],
      ),
    );

    return result ?? false;
  }

  String _formatAmount(Offer offer) {
    final currency = offer.listing?.currency ?? 'NGN';
    return '$currency ${offer.amount.toStringAsFixed(2)}';
  }

  String _cleanError(Object error) {
    return error
        .toString()
        .replaceFirst('Exception: ', '')
        .trim();
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('My Offers'),
          bottom: const TabBar(
            tabs: [
              Tab(text: 'My Offers'),
              Tab(text: 'Received'),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            _OfferList(
              future: _myOffersFuture,
              emptyTitle: 'No offers made yet',
              emptyMessage:
                  'Offers you make on listings will appear here.',
              onRefresh: _refresh,
              itemBuilder: (offer) => _BuyerOfferCard(
                offer: offer,
                onWithdraw: offer.isPending
                    ? () => _withdrawOffer(offer)
                    : null,
              ),
            ),
            _OfferList(
              future: _receivedOffersFuture,
              emptyTitle: 'No offers received yet',
              emptyMessage:
                  'Offers from buyers on your listings will appear here.',
              onRefresh: _refresh,
              itemBuilder: (offer) => _SellerOfferCard(
                offer: offer,
                onAccept: offer.isPending
                    ? () => _acceptOffer(offer)
                    : null,
                onReject: offer.isPending
                    ? () => _rejectOffer(offer)
                    : null,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _OfferList extends StatelessWidget {
  const _OfferList({
    required this.future,
    required this.emptyTitle,
    required this.emptyMessage,
    required this.onRefresh,
    required this.itemBuilder,
  });

  final Future<List<Offer>> future;
  final String emptyTitle;
  final String emptyMessage;
  final Future<void> Function() onRefresh;
  final Widget Function(Offer offer) itemBuilder;

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<Offer>>(
      future: future,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(
            child: CircularProgressIndicator(),
          );
        }

        if (snapshot.hasError) {
          return _OfferErrorState(
            message: snapshot.error.toString(),
            onRetry: onRefresh,
          );
        }

        final offers = snapshot.data ?? [];

        if (offers.isEmpty) {
          return RefreshIndicator(
            onRefresh: onRefresh,
            child: ListView(
              physics: const AlwaysScrollableScrollPhysics(),
              children: [
                const SizedBox(height: 180),
                const Icon(
                  Icons.local_offer_outlined,
                  size: 64,
                ),
                const SizedBox(height: 16),
                Center(
                  child: Text(
                    emptyTitle,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
                const SizedBox(height: 8),
                Center(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 32),
                    child: Text(
                      emptyMessage,
                      textAlign: TextAlign.center,
                    ),
                  ),
                ),
              ],
            ),
          );
        }

        return RefreshIndicator(
          onRefresh: onRefresh,
          child: ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: offers.length,
            separatorBuilder: (context, index) =>
                const SizedBox(height: 12),
            itemBuilder: (context, index) {
              return itemBuilder(offers[index]);
            },
          ),
        );
      },
    );
  }
}

class _BuyerOfferCard extends StatelessWidget {
  const _BuyerOfferCard({
    required this.offer,
    required this.onWithdraw,
  });

  final Offer offer;
  final VoidCallback? onWithdraw;

  @override
  Widget build(BuildContext context) {
    final listing = offer.listing;

    return Card(
      clipBehavior: Clip.antiAlias,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              listing?.title ?? 'Listing',
              style: const TextStyle(
                fontSize: 17,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Offer: ${offer.listing?.currency ?? 'NGN'} '
              '${offer.amount.toStringAsFixed(2)}',
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w500,
              ),
            ),
            if (listing != null) ...[
              const SizedBox(height: 4),
              Text(
                'Listed at ${listing.currency} '
                '${listing.price.toStringAsFixed(2)}',
              ),
            ],
            const SizedBox(height: 10),
            _StatusChip(status: offer.status),
            if (offer.message != null &&
                offer.message!.trim().isNotEmpty) ...[
              const SizedBox(height: 10),
              Text(
                offer.message!,
                maxLines: 3,
                overflow: TextOverflow.ellipsis,
              ),
            ],
            if (onWithdraw != null) ...[
              const SizedBox(height: 12),
              Align(
                alignment: Alignment.centerRight,
                child: OutlinedButton(
                  onPressed: onWithdraw,
                  child: const Text('Withdraw'),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class _SellerOfferCard extends StatelessWidget {
  const _SellerOfferCard({
    required this.offer,
    required this.onAccept,
    required this.onReject,
  });

  final Offer offer;
  final VoidCallback? onAccept;
  final VoidCallback? onReject;

  @override
  Widget build(BuildContext context) {
    final listing = offer.listing;

    return Card(
      clipBehavior: Clip.antiAlias,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              listing?.title ?? 'Listing',
              style: const TextStyle(
                fontSize: 17,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Offer: ${listing?.currency ?? 'NGN'} '
              '${offer.amount.toStringAsFixed(2)}',
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w500,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              'From ${offer.buyer?.displayName ?? 'Buyer'}',
            ),
            const SizedBox(height: 10),
            _StatusChip(status: offer.status),
            if (offer.message != null &&
                offer.message!.trim().isNotEmpty) ...[
              const SizedBox(height: 10),
              Text(
                offer.message!,
                maxLines: 3,
                overflow: TextOverflow.ellipsis,
              ),
            ],
            if (onAccept != null && onReject != null) ...[
              const SizedBox(height: 12),
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  OutlinedButton(
                    onPressed: onReject,
                    child: const Text('Reject'),
                  ),
                  const SizedBox(width: 8),
                  FilledButton(
                    onPressed: onAccept,
                    child: const Text('Accept'),
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

class _StatusChip extends StatelessWidget {
  const _StatusChip({
    required this.status,
  });

  final OfferStatus status;

  @override
  Widget build(BuildContext context) {
    final label = switch (status) {
      OfferStatus.pending => 'Pending',
      OfferStatus.accepted => 'Accepted',
      OfferStatus.rejected => 'Rejected',
      OfferStatus.withdrawn => 'Withdrawn',
      OfferStatus.unknown => 'Unknown',
    };

    return Chip(
      label: Text(label),
      visualDensity: VisualDensity.compact,
    );
  }
}

class _OfferErrorState extends StatelessWidget {
  const _OfferErrorState({
    required this.message,
    required this.onRetry,
  });

  final String message;
  final Future<void> Function() onRetry;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(
              Icons.error_outline,
              size: 56,
            ),
            const SizedBox(height: 16),
            const Text(
              'Could not load offers.',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w600,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            Text(
              message,
              textAlign: TextAlign.center,
              maxLines: 3,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: onRetry,
              child: const Text('Try Again'),
            ),
          ],
        ),
      ),
    );
  }
}
