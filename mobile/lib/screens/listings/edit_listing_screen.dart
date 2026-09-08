import 'dart:io';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

import '../../models/listing.dart';
import '../../services/category_service.dart';
import '../../services/listing_service.dart';
import '../../core/constants/nigerian_states.dart';
import '../../utils/price_input_formatter.dart';

class EditListingScreen extends StatefulWidget {
  final Listing listing;

  const EditListingScreen({super.key, required this.listing});

  @override
  State<EditListingScreen> createState() => _EditListingScreenState();
}

class _EditListingScreenState extends State<EditListingScreen> {
  final _formKey = GlobalKey<FormState>();

  late final TextEditingController _titleController;
  late final TextEditingController _descriptionController;
  late final TextEditingController _priceController;
  late final TextEditingController _faultDescriptionController;
  late final TextEditingController _locationController;
  late final TextEditingController _stateController;
  late final TextEditingController _cityController;

  final ImagePicker _picker = ImagePicker();

  List<ListingCategory> _categories = [];
  List<XFile> _replacementImages = [];

  late String _categoryId;
  late String _condition;
  late String _faultSeverity;
  late bool _negotiable;

  bool _loadingCategories = true;
  bool _saving = false;
  String? _categoryError;

  @override
  void initState() {
    super.initState();

    final listing = widget.listing;

    _titleController = TextEditingController(text: listing.title);
    _descriptionController = TextEditingController(text: listing.description);
    _priceController = TextEditingController(
      text: PriceInputFormatter.format(listing.price.toString()),
    );
    _faultDescriptionController = TextEditingController(
      text: listing.faultDescription ?? '',
    );
    _locationController = TextEditingController(text: listing.location ?? '');
    _stateController = TextEditingController(text: listing.state ?? '');
    _cityController = TextEditingController(text: listing.city ?? '');

    _categoryId = listing.category?.id ?? '';
    _condition = listing.condition ?? 'FAULTY';
    _faultSeverity = listing.faultSeverity ?? 'NONE';
    _negotiable = listing.isNegotiable;

    _loadCategories();
  }

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    _priceController.dispose();
    _faultDescriptionController.dispose();
    _locationController.dispose();
    _stateController.dispose();
    _cityController.dispose();
    super.dispose();
  }

  Future<void> _loadCategories() async {
    try {
      final categories = await CategoryService.getCategories();

      if (!mounted) return;

      setState(() {
        _categories = categories;
        _loadingCategories = false;
      });
    } catch (e) {
      if (!mounted) return;

      setState(() {
        _loadingCategories = false;
        _categoryError = e.toString();
      });
    }
  }

  Future<void> _pickReplacementImages() async {
    final images = await _picker.pickMultiImage(imageQuality: 85);

    if (!mounted || images.isEmpty) return;

    setState(() {
      _replacementImages = images.take(10).toList();
    });
  }

  Future<void> _saveChanges() async {
    FocusScope.of(context).unfocus();

    if (!_formKey.currentState!.validate()) {
      return;
    }

    final price = double.tryParse(
      _priceController.text.trim().replaceAll(',', ''),
    );

    if (price == null || price <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Enter a valid price greater than zero.')),
      );
      return;
    }

    setState(() {
      _saving = true;
    });

    try {
      final updatedListing = await ListingService.updateListing(
        listingId: widget.listing.id,
        title: _titleController.text.trim(),
        description: _descriptionController.text.trim(),
        categoryId: _categoryId,
        price: price,
        currency: widget.listing.currency.isNotEmpty
            ? widget.listing.currency
            : 'NGN',
        condition: _condition,
        faultSeverity: _faultSeverity,
        faultDescription: _faultDescriptionController.text.trim(),
        location: _locationController.text.trim(),
        state: _stateController.text.trim(),
        city: _cityController.text.trim(),
        negotiable: _negotiable,
        images: _replacementImages,
      );

      if (!mounted) return;

      Navigator.of(context).pop(updatedListing);
    } catch (e) {
      if (!mounted) return;

      setState(() {
        _saving = false;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(e.toString().replaceFirst('Exception: ', ''))),
      );
    }
  }

  Widget _sectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Text(
        title,
        style: Theme.of(
          context,
        ).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700),
      ),
    );
  }

  InputDecoration _decoration(String label, {String? hint}) {
    return InputDecoration(
      labelText: label,
      hintText: hint,
      border: const OutlineInputBorder(),
    );
  }

  @override
  Widget build(BuildContext context) {
    final existingImages = widget.listing.images;

    return Scaffold(
      appBar: AppBar(title: const Text('Edit Listing')),
      body: SafeArea(
        child: Form(
          key: _formKey,
          child: ListView(
            padding: const EdgeInsets.all(16),
            children: [
              _sectionTitle('Basic Information'),

              TextFormField(
                controller: _titleController,
                decoration: _decoration('Title'),
                textInputAction: TextInputAction.next,
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Enter a listing title.';
                  }
                  return null;
                },
              ),

              const SizedBox(height: 16),

              if (_loadingCategories)
                const LinearProgressIndicator()
              else if (_categoryError != null)
                Text(
                  'Unable to load categories. ${_categoryError!}',
                  style: TextStyle(color: Theme.of(context).colorScheme.error),
                )
              else
                DropdownButtonFormField<String>(
                  initialValue:
                      _categories.any((category) => category.id == _categoryId)
                      ? _categoryId
                      : null,
                  decoration: _decoration('Category'),
                  items: _categories
                      .map(
                        (category) => DropdownMenuItem<String>(
                          value: category.id,
                          child: Text(category.name),
                        ),
                      )
                      .toList(),
                  onChanged: _saving
                      ? null
                      : (value) {
                          if (value == null) return;
                          setState(() {
                            _categoryId = value;
                          });
                        },
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Select a category.';
                    }
                    return null;
                  },
                ),

              const SizedBox(height: 16),

              TextFormField(
                controller: _descriptionController,
                decoration: _decoration('Description'),
                minLines: 4,
                maxLines: 7,
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Enter a description.';
                  }
                  return null;
                },
              ),

              const SizedBox(height: 24),

              _sectionTitle('Price'),

              TextFormField(
                controller: _priceController,
                decoration: _decoration('Price', hint: '120000'),
                keyboardType: const TextInputType.numberWithOptions(
                  decimal: true,
                ),
                validator: (value) {
                  final price = double.tryParse(
                    (value ?? '').trim().replaceAll(',', ''),
                  );

                  if (price == null || price <= 0) {
                    return 'Enter a valid price.';
                  }

                  return null;
                },
              ),

              const SizedBox(height: 16),

              SwitchListTile(
                contentPadding: EdgeInsets.zero,
                title: const Text('Price is negotiable'),
                value: _negotiable,
                onChanged: _saving
                    ? null
                    : (value) {
                        setState(() {
                          _negotiable = value;
                        });
                      },
              ),

              const SizedBox(height: 16),

              _sectionTitle('Condition'),

              DropdownButtonFormField<String>(
                initialValue: _condition,
                decoration: _decoration('Condition'),
                items: const [
                  DropdownMenuItem(value: 'FAULTY', child: Text('Faulty')),
                  DropdownMenuItem(value: 'USED', child: Text('Used')),
                  DropdownMenuItem(value: 'DAMAGED', child: Text('Damaged')),
                  DropdownMenuItem(
                    value: 'FOR_PARTS',
                    child: Text('For Parts'),
                  ),
                ],
                onChanged: _saving
                    ? null
                    : (value) {
                        if (value == null) return;
                        setState(() {
                          _condition = value;
                        });
                      },
              ),

              const SizedBox(height: 16),

              DropdownButtonFormField<String>(
                initialValue: _faultSeverity,
                decoration: _decoration('Fault Severity'),
                items: const [
                  DropdownMenuItem(value: 'NONE', child: Text('None')),
                  DropdownMenuItem(value: 'MINOR', child: Text('Minor')),
                  DropdownMenuItem(value: 'MODERATE', child: Text('Moderate')),
                  DropdownMenuItem(value: 'MAJOR', child: Text('Major')),
                  DropdownMenuItem(value: 'CRITICAL', child: Text('Critical')),
                ],
                onChanged: _saving
                    ? null
                    : (value) {
                        if (value == null) return;
                        setState(() {
                          _faultSeverity = value;
                        });
                      },
              ),

              const SizedBox(height: 16),

              TextFormField(
                controller: _faultDescriptionController,
                decoration: _decoration(
                  'Fault Description',
                  hint: 'Describe the fault or damage',
                ),
                minLines: 3,
                maxLines: 6,
              ),

              const SizedBox(height: 24),

              _sectionTitle('Location'),

              TextFormField(
                controller: _locationController,
                decoration: _decoration('Location'),
              ),

              const SizedBox(height: 16),

              DropdownButtonFormField<String>(
                initialValue: _stateController.text.isEmpty
                    ? null
                    : _stateController.text,
                decoration: _decoration('State'),
                items: NigerianStates.all
                    .map(
                      (state) => DropdownMenuItem<String>(
                        value: state,
                        child: Text(state),
                      ),
                    )
                    .toList(),
                onChanged: _saving
                    ? null
                    : (value) {
                        if (value == null) return;

                        setState(() {
                          _stateController.text = value;
                        });
                      },
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Select the state.';
                  }

                  return null;
                },
              ),

              const SizedBox(height: 16),

              TextFormField(
                controller: _cityController,
                decoration: _decoration('City'),
              ),

              const SizedBox(height: 24),

              _sectionTitle('Photos'),

              if (existingImages.isNotEmpty) ...[
                SizedBox(
                  height: 100,
                  child: ListView.separated(
                    scrollDirection: Axis.horizontal,
                    itemCount: existingImages.length,
                    separatorBuilder: (context, index) =>
                        const SizedBox(width: 8),
                    itemBuilder: (context, index) {
                      return ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: Image.network(
                          existingImages[index].url,
                          width: 100,
                          height: 100,
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) {
                            return Container(
                              width: 100,
                              height: 100,
                              color: Theme.of(
                                context,
                              ).colorScheme.surfaceContainerHighest,
                              child: const Icon(Icons.broken_image_outlined),
                            );
                          },
                        ),
                      );
                    },
                  ),
                ),
                const SizedBox(height: 12),
              ],

              Text(
                _replacementImages.isEmpty
                    ? 'Current photos will be kept unless you select replacement photos.'
                    : 'Selected photos will replace the current listing photos.',
                style: Theme.of(context).textTheme.bodySmall,
              ),

              const SizedBox(height: 10),

              OutlinedButton.icon(
                onPressed: _saving ? null : _pickReplacementImages,
                icon: const Icon(Icons.photo_library_outlined),
                label: Text(
                  _replacementImages.isEmpty
                      ? 'Replace Photos'
                      : '${_replacementImages.length} Replacement Photos',
                ),
              ),

              if (_replacementImages.isNotEmpty) ...[
                const SizedBox(height: 12),
                SizedBox(
                  height: 100,
                  child: ListView.separated(
                    scrollDirection: Axis.horizontal,
                    itemCount: _replacementImages.length,
                    separatorBuilder: (context, index) =>
                        const SizedBox(width: 8),
                    itemBuilder: (context, index) {
                      return Stack(
                        children: [
                          ClipRRect(
                            borderRadius: BorderRadius.circular(8),
                            child: Image.file(
                              File(_replacementImages[index].path),
                              width: 100,
                              height: 100,
                              fit: BoxFit.cover,
                            ),
                          ),
                          Positioned(
                            top: 4,
                            right: 4,
                            child: InkWell(
                              onTap: _saving
                                  ? null
                                  : () {
                                      setState(() {
                                        _replacementImages.removeAt(index);
                                      });
                                    },
                              child: Container(
                                decoration: BoxDecoration(
                                  color: Colors.black54,
                                  borderRadius: BorderRadius.circular(20),
                                ),
                                padding: const EdgeInsets.all(4),
                                child: const Icon(
                                  Icons.close,
                                  color: Colors.white,
                                  size: 18,
                                ),
                              ),
                            ),
                          ),
                        ],
                      );
                    },
                  ),
                ),
              ],

              const SizedBox(height: 32),

              SizedBox(
                height: 52,
                child: FilledButton(
                  onPressed: _saving ? null : _saveChanges,
                  child: _saving
                      ? const SizedBox(
                          width: 22,
                          height: 22,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : const Text(
                          'Save Changes',
                          style: TextStyle(fontWeight: FontWeight.w700),
                        ),
                ),
              ),

              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }
}
