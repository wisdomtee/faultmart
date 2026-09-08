import 'package:flutter/material.dart';

import '../../core/theme/app_theme.dart';
import '../../models/listing.dart';
import '../../services/listing_service.dart';
import '../../widgets/listings/listing_card.dart';

class BrowseScreen extends StatefulWidget {
  const BrowseScreen({super.key, this.initialSearch});

  final String? initialSearch;

  @override
  State<BrowseScreen> createState() => _BrowseScreenState();
}

class _BrowseScreenState extends State<BrowseScreen> {
  final TextEditingController _searchController = TextEditingController();

  List<Listing> _listings = [];

  bool _isLoading = true;
  bool _isLoadingMore = false;
  String? _errorMessage;

  int _page = 1;
  bool _hasNextPage = false;

  String? _selectedCondition;
  String? _selectedFaultSeverity;
  String _selectedSort = 'newest';

  @override
  void initState() {
    super.initState();

    final initialSearch = widget.initialSearch?.trim();

    if (initialSearch != null && initialSearch.isNotEmpty) {
      _searchController.text = initialSearch;
    }

    _loadListings();
  }

  @override
  void didUpdateWidget(covariant BrowseScreen oldWidget) {
    super.didUpdateWidget(oldWidget);

    final newSearch = widget.initialSearch?.trim() ?? '';
    final oldSearch = oldWidget.initialSearch?.trim() ?? '';

    if (newSearch != oldSearch && newSearch != _searchController.text) {
      _searchController.text = newSearch;

      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (!mounted) return;
        _loadListings();
      });
    }
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _loadListings() async {
    if (mounted) {
      setState(() {
        _isLoading = true;
        _errorMessage = null;
        _page = 1;
        _hasNextPage = false;
      });
    }

    try {
      final result = await ListingService.getListings(
        page: 1,
        limit: 20,
        search: _searchController.text.trim().isEmpty
            ? null
            : _searchController.text.trim(),
        condition: _selectedCondition,
        faultSeverity: _selectedFaultSeverity,
        sort: _selectedSort,
      );

      if (!mounted) return;

      setState(() {
        _listings = result.items;
        _page = result.pagination.page;
        _hasNextPage = result.pagination.hasNext;
        _isLoading = false;
        _errorMessage = null;
      });
    } catch (error) {
      if (!mounted) return;

      setState(() {
        _isLoading = false;
        _errorMessage = _friendlyError(error);
      });
    }
  }

  Future<void> _loadMore() async {
    if (_isLoadingMore || !_hasNextPage) return;

    setState(() {
      _isLoadingMore = true;
    });

    try {
      final nextPage = _page + 1;

      final result = await ListingService.getListings(
        page: nextPage,
        limit: 20,
        search: _searchController.text.trim().isEmpty
            ? null
            : _searchController.text.trim(),
        condition: _selectedCondition,
        faultSeverity: _selectedFaultSeverity,
        sort: _selectedSort,
      );

      if (!mounted) return;

      setState(() {
        _listings.addAll(result.items);
        _page = result.pagination.page;
        _hasNextPage = result.pagination.hasNext;
        _isLoadingMore = false;
      });
    } catch (_) {
      if (!mounted) return;

      setState(() {
        _isLoadingMore = false;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Unable to load more listings.')),
      );
    }
  }

  Future<void> _refreshListings() async {
    await _loadListings();
  }

  void _submitSearch() {
    FocusScope.of(context).unfocus();
    _loadListings();
  }

  void _clearSearch() {
    _searchController.clear();
    _loadListings();
  }

  void _openFilters() {
    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      builder: (context) {
        String? condition = _selectedCondition;
        String? severity = _selectedFaultSeverity;
        String sort = _selectedSort;

        return StatefulBuilder(
          builder: (context, setSheetState) {
            return SafeArea(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 18, 20, 24),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Expanded(
                          child: Text(
                            'Filter Listings',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.w800,
                              color: AppTheme.darkText,
                            ),
                          ),
                        ),
                        IconButton(
                          onPressed: () => Navigator.pop(context),
                          icon: const Icon(Icons.close),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    const Text(
                      'Condition',
                      style: TextStyle(
                        fontWeight: FontWeight.w700,
                        color: AppTheme.darkText,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      children: [
                        _FilterChoice(
                          label: 'All',
                          selected: condition == null,
                          onTap: () {
                            setSheetState(() {
                              condition = null;
                            });
                          },
                        ),
                        _FilterChoice(
                          label: 'Faulty',
                          selected: condition == 'FAULTY',
                          onTap: () {
                            setSheetState(() {
                              condition = 'FAULTY';
                            });
                          },
                        ),
                        _FilterChoice(
                          label: 'Damaged',
                          selected: condition == 'DAMAGED',
                          onTap: () {
                            setSheetState(() {
                              condition = 'DAMAGED';
                            });
                          },
                        ),
                        _FilterChoice(
                          label: 'Used',
                          selected: condition == 'USED',
                          onTap: () {
                            setSheetState(() {
                              condition = 'USED';
                            });
                          },
                        ),
                      ],
                    ),
                    const SizedBox(height: 18),
                    const Text(
                      'Fault Severity',
                      style: TextStyle(
                        fontWeight: FontWeight.w700,
                        color: AppTheme.darkText,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      children: [
                        _FilterChoice(
                          label: 'All',
                          selected: severity == null,
                          onTap: () {
                            setSheetState(() {
                              severity = null;
                            });
                          },
                        ),
                        _FilterChoice(
                          label: 'Minor',
                          selected: severity == 'MINOR',
                          onTap: () {
                            setSheetState(() {
                              severity = 'MINOR';
                            });
                          },
                        ),
                        _FilterChoice(
                          label: 'Moderate',
                          selected: severity == 'MODERATE',
                          onTap: () {
                            setSheetState(() {
                              severity = 'MODERATE';
                            });
                          },
                        ),
                        _FilterChoice(
                          label: 'Major',
                          selected: severity == 'SEVERE',
                          onTap: () {
                            setSheetState(() {
                              severity = 'SEVERE';
                            });
                          },
                        ),
                      ],
                    ),
                    const SizedBox(height: 18),
                    const Text(
                      'Sort By',
                      style: TextStyle(
                        fontWeight: FontWeight.w700,
                        color: AppTheme.darkText,
                      ),
                    ),
                    const SizedBox(height: 8),
                    DropdownButtonFormField<String>(
                      initialValue: sort,
                      decoration: InputDecoration(
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      items: const [
                        DropdownMenuItem(
                          value: 'newest',
                          child: Text('Newest'),
                        ),
                        DropdownMenuItem(
                          value: 'oldest',
                          child: Text('Oldest'),
                        ),
                        DropdownMenuItem(
                          value: 'price_asc',
                          child: Text('Price: Low to High'),
                        ),
                        DropdownMenuItem(
                          value: 'price_desc',
                          child: Text('Price: High to Low'),
                        ),
                        DropdownMenuItem(
                          value: 'popular',
                          child: Text('Most Popular'),
                        ),
                      ],
                      onChanged: (value) {
                        if (value == null) return;

                        setSheetState(() {
                          sort = value;
                        });
                      },
                    ),
                    const SizedBox(height: 22),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: () {
                          setState(() {
                            _selectedCondition = condition;
                            _selectedFaultSeverity = severity;
                            _selectedSort = sort;
                          });

                          Navigator.pop(context);
                          _loadListings();
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.primaryRed,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 15),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: const Text(
                          'Apply Filters',
                          style: TextStyle(fontWeight: FontWeight.w700),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  String _friendlyError(Object error) {
    final message = error.toString().replaceFirst('Exception: ', '').trim();

    if (message.isEmpty) {
      return 'Unable to load listings. Please try again.';
    }

    return message;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.lightBackground,
      appBar: AppBar(
        title: const Text(
          'Browse Listings',
          style: TextStyle(
            fontWeight: FontWeight.w800,
            color: AppTheme.darkText,
          ),
        ),
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.transparent,
        elevation: 0,
      ),
      body: Column(
        children: [
          _buildSearchArea(),
          Expanded(
            child: RefreshIndicator(
              onRefresh: _refreshListings,
              color: AppTheme.primaryRed,
              child: _buildBody(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSearchArea() {
    final hasFilters =
        _selectedCondition != null ||
        _selectedFaultSeverity != null ||
        _selectedSort != 'newest';

    return Container(
      color: Colors.white,
      padding: const EdgeInsets.fromLTRB(16, 4, 16, 14),
      child: Row(
        children: [
          Expanded(
            child: TextField(
              controller: _searchController,
              textInputAction: TextInputAction.search,
              onSubmitted: (_) => _submitSearch(),
              decoration: InputDecoration(
                hintText: 'Search listings...',
                prefixIcon: const Icon(Icons.search_rounded),
                suffixIcon: _searchController.text.isNotEmpty
                    ? IconButton(
                        onPressed: _clearSearch,
                        icon: const Icon(Icons.clear_rounded),
                      )
                    : null,
                filled: true,
                fillColor: AppTheme.lightBackground,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide: BorderSide.none,
                ),
                contentPadding: const EdgeInsets.symmetric(vertical: 14),
              ),
              onChanged: (_) {
                setState(() {});
              },
            ),
          ),
          const SizedBox(width: 10),
          Material(
            color: hasFilters ? AppTheme.primaryRed : AppTheme.lightBackground,
            borderRadius: BorderRadius.circular(14),
            child: InkWell(
              onTap: _openFilters,
              borderRadius: BorderRadius.circular(14),
              child: SizedBox(
                width: 50,
                height: 50,
                child: Icon(
                  Icons.tune_rounded,
                  color: hasFilters ? Colors.white : AppTheme.darkText,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBody() {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_errorMessage != null) {
      return ListView(
        physics: const AlwaysScrollableScrollPhysics(),
        children: [
          SizedBox(height: MediaQuery.of(context).size.height * 0.28),
          Center(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Column(
                children: [
                  const Icon(
                    Icons.cloud_off_outlined,
                    size: 56,
                    color: AppTheme.mutedText,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    _errorMessage!,
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      fontSize: 15,
                      color: AppTheme.mutedText,
                    ),
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: _loadListings,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.primaryRed,
                      foregroundColor: Colors.white,
                    ),
                    child: const Text('Try Again'),
                  ),
                ],
              ),
            ),
          ),
        ],
      );
    }

    if (_listings.isEmpty) {
      return ListView(
        physics: const AlwaysScrollableScrollPhysics(),
        children: [
          SizedBox(height: MediaQuery.of(context).size.height * 0.28),
          const Center(
            child: Padding(
              padding: EdgeInsets.symmetric(horizontal: 24),
              child: Column(
                children: [
                  Icon(
                    Icons.search_off_rounded,
                    size: 56,
                    color: AppTheme.mutedText,
                  ),
                  SizedBox(height: 16),
                  Text(
                    'No listings found',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w800,
                      color: AppTheme.darkText,
                    ),
                  ),
                  SizedBox(height: 8),
                  Text(
                    'Try a different search or adjust your filters.',
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 14, color: AppTheme.mutedText),
                  ),
                ],
              ),
            ),
          ),
        ],
      );
    }

    return NotificationListener<ScrollNotification>(
      onNotification: (notification) {
        if (notification is ScrollUpdateNotification &&
            notification.metrics.pixels >=
                notification.metrics.maxScrollExtent - 300) {
          _loadMore();
        }

        return false;
      },
      child: GridView.builder(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 24),
        physics: const AlwaysScrollableScrollPhysics(),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          crossAxisSpacing: 12,
          mainAxisSpacing: 12,
          childAspectRatio: 0.58,
        ),
        itemCount: _listings.length + (_isLoadingMore ? 2 : 0),
        itemBuilder: (context, index) {
          if (index >= _listings.length) {
            return const Center(
              child: Padding(
                padding: EdgeInsets.all(20),
                child: CircularProgressIndicator(strokeWidth: 2),
              ),
            );
          }

          return ListingCard(listing: _listings[index]);
        },
      ),
    );
  }
}

class _FilterChoice extends StatelessWidget {
  const _FilterChoice({
    required this.label,
    required this.selected,
    required this.onTap,
  });

  final String label;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return ChoiceChip(
      label: Text(label),
      selected: selected,
      onSelected: (_) => onTap(),
      selectedColor: AppTheme.primaryRed.withValues(alpha: 0.12),
      labelStyle: TextStyle(
        color: selected ? AppTheme.primaryRed : AppTheme.darkText,
        fontWeight: FontWeight.w600,
      ),
      side: BorderSide(
        color: selected
            ? AppTheme.primaryRed.withValues(alpha: 0.35)
            : Colors.black.withValues(alpha: 0.08),
      ),
    );
  }
}
