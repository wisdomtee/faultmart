import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

import '../../core/theme/app_theme.dart';
import '../../models/listing.dart';
import '../../services/ai_service.dart';
import '../../services/listing_service.dart';
import '../../services/category_service.dart';

class SellScreen extends StatefulWidget {
  const SellScreen({super.key});

  @override
  State<SellScreen> createState() => _SellScreenState();
}

class _SellScreenState extends State<SellScreen> {
  final _formKey = GlobalKey<FormState>();

  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _priceController = TextEditingController();
  final _faultDescriptionController = TextEditingController();
  final _locationController = TextEditingController();
  final _stateController = TextEditingController();
  final _cityController = TextEditingController();

  final ImagePicker _picker = ImagePicker();

  final List<XFile> _images = [];

  bool _negotiable = true;
  bool _isSubmitting = false;
  bool _isGeneratingAi = false;
  String? _aiError;
  ListingAssistantResult? _aiResult;

  String? _categoryId;
  String _condition = 'FAULTY';
  String _faultSeverity = 'NONE';

  /*
   * Temporary category mapping.
   *
   * These IDs correspond to the categories currently
   * available in the FaultMart backend.
   *
   * We will replace this with a real category API
   * once the mobile category flow is implemented.
   */
  List<ListingCategory> _categories = [];
bool _isLoadingCategories = true;
String? _categoryError;

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

  Future<void> _pickImages() async {
    if (_images.length >= 10) {
      _showMessage('You can upload a maximum of 10 images.');
      return;
    }

    try {
      final pickedImages = await _picker.pickMultiImage(imageQuality: 85);

      if (pickedImages.isEmpty) {
        return;
      }

      final remaining = 10 - _images.length;

      final selected = pickedImages.take(remaining).toList();

      setState(() {
        _images.addAll(selected);
      });

      if (pickedImages.length > remaining) {
        _showMessage('Only 10 images can be uploaded per listing.');
      }
    } catch (error) {
      debugPrint('IMAGE PICKER ERROR: $error');
      _showMessage('Unable to select images: $error');
    }
  }

  void _removeImage(int index) {
    setState(() {
      _images.removeAt(index);
    });
  }

Future<void> _loadCategories() async {
  try {
    final categories = await CategoryService.getCategories();

    if (!mounted) return;

    setState(() {
      _categories = categories;
      _isLoadingCategories = false;
      _categoryError = null;
    });
  } catch (error) {
    if (!mounted) return;

    setState(() {
      _isLoadingCategories = false;
      _categoryError = error.toString();
    });
  }
}

@override
void initState() {
  super.initState();
  _loadCategories();
}

  String? _selectedCategoryName() {
    for (final category in _categories) {
      if (category.id == _categoryId) {
        return category.name;
      }
    }

    return null;
  }

  Future<void> _generateAiSuggestions() async {
    FocusScope.of(context).unfocus();

    if (_titleController.text.trim().isEmpty &&
        _descriptionController.text.trim().isEmpty &&
        _faultDescriptionController.text.trim().isEmpty) {
      setState(() {
        _aiError =
            'Please provide a title, description, or fault description before using AI.';
        _aiResult = null;
      });
      return;
    }

    setState(() {
      _isGeneratingAi = true;
      _aiError = null;
      _aiResult = null;
    });

    try {
      final result = await AiService.generateListingAssistant(
        title: _titleController.text.trim(),
        description: _descriptionController.text.trim(),
        category: _selectedCategoryName(),
        condition: _condition,
        faultSeverity: _faultSeverity,
        faultDescription: _faultDescriptionController.text.trim(),
      );

      if (!mounted) return;

      setState(() {
        _aiResult = result;
      });
    } catch (error) {
      if (!mounted) return;

      setState(() {
        _aiError = error.toString().replaceFirst('Exception: ', '');
      });
    } finally {
      if (mounted) {
        setState(() {
          _isGeneratingAi = false;
        });
      }
    }
  }

  void _applyAiSuggestions() {
    final result = _aiResult;

    if (result == null) return;

    if (result.suggestedTitle.trim().isNotEmpty) {
      _titleController.text = result.suggestedTitle.trim();
    }

    if (result.improvedDescription.trim().isNotEmpty) {
      _descriptionController.text = result.improvedDescription.trim();
    }

    if (result.suggestedFaultSeverity != null) {
      _faultSeverity = result.suggestedFaultSeverity!;
    }

    setState(() {
      _aiError = null;
    });

    ScaffoldMessenger.of(
      context,
    ).showSnackBar(const SnackBar(content: Text('AI suggestions applied.')));
  }

  Future<void> _submitListing() async {
    FocusScope.of(context).unfocus();

    if (!_formKey.currentState!.validate()) {
      return;
    }

    if (_categoryId == null) {
      _showMessage('Please select a category.');
      return;
    }

    final price = double.tryParse(
      _priceController.text.replaceAll(',', '').trim(),
    );

    if (price == null || price <= 0) {
      _showMessage('Please enter a valid price.');
      return;
    }

    setState(() {
      _isSubmitting = true;
    });

    try {
      final Listing listing = await ListingService.createListing(
        title: _titleController.text.trim(),
        description: _descriptionController.text.trim(),
        categoryId: _categoryId!,
        price: price,
        currency: 'NGN',
        condition: _condition,
        faultSeverity: _faultSeverity,
        faultDescription: _faultDescriptionController.text.trim(),
        location: _locationController.text.trim(),
        state: _stateController.text.trim(),
        city: _cityController.text.trim(),
        negotiable: _negotiable,
        images: _images,
      );

      if (!mounted) return;

      await _showSuccessDialog(listing);
    } catch (error) {
      if (!mounted) return;

      _showMessage(error.toString().replaceFirst('Exception: ', ''));
    } finally {
      if (mounted) {
        setState(() {
          _isSubmitting = false;
        });
      }
    }
  }

  Future<void> _showSuccessDialog(Listing listing) async {
    await showDialog<void>(
      context: context,
      barrierDismissible: false,
      builder: (context) {
        return AlertDialog(
          title: const Text('Listing Published'),
          content: Text(
            '"${listing.title}" has been successfully '
            'published on FaultMart.',
          ),
          actions: [
            FilledButton(
              style: FilledButton.styleFrom(
                backgroundColor: AppTheme.primaryRed,
              ),
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: const Text('Done'),
            ),
          ],
        );
      },
    );

    if (!mounted) return;

    _resetForm();
  }

  void _resetForm() {
    _formKey.currentState?.reset();

    _titleController.clear();
    _descriptionController.clear();
    _priceController.clear();
    _faultDescriptionController.clear();
    _locationController.clear();
    _stateController.clear();
    _cityController.clear();

    setState(() {
      _images.clear();
      _categoryId = null;
      _condition = 'FAULTY';
      _faultSeverity = 'NONE';
      _negotiable = true;
      _aiError = null;
      _aiResult = null;
    });
  }

  void _showMessage(String message) {
    if (!mounted) return;

    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(SnackBar(content: Text(message)));
  }

  InputDecoration _inputDecoration({required String label, String? hint}) {
    return InputDecoration(
      labelText: label,
      hintText: hint,
      filled: true,
      fillColor: Colors.grey.shade50,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: BorderSide(color: Colors.grey.shade300),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: BorderSide(color: Colors.grey.shade300),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: const BorderSide(color: AppTheme.primaryRed, width: 1.5),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text(
          'Sell on FaultMart',
          style: TextStyle(fontWeight: FontWeight.w700),
        ),
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.transparent,
      ),
      body: SafeArea(
        child: Form(
          key: _formKey,
          child: ListView(
            padding: const EdgeInsets.fromLTRB(20, 8, 20, 32),
            children: [
              const Text(
                'Create your listing',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.w800),
              ),
              const SizedBox(height: 6),
              Text(
                'Tell buyers what you are selling and '
                'add clear photos of the item.',
                style: TextStyle(color: Colors.grey.shade600, height: 1.4),
              ),

              const SizedBox(height: 24),

              _buildImagePicker(),
              const SizedBox(height: 20),

              _buildAiAssistant(),

              const SizedBox(height: 24),

              TextFormField(
                controller: _titleController,
                textInputAction: TextInputAction.next,
                decoration: _inputDecoration(
                  label: 'Title',
                  hint: 'e.g. Toyota Camry 2012 With Engine Fault',
                ),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Enter a listing title.';
                  }

                  if (value.trim().length < 5) {
                    return 'Title is too short.';
                  }

                  return null;
                },
              ),

              const SizedBox(height: 16),

              DropdownButtonFormField<String>(
  initialValue: _categoryId,
  decoration: _inputDecoration(
    label: 'Category',
  ).copyWith(
    helperText: _isLoadingCategories
        ? 'Loading categories...'
        : _categoryError,
    helperStyle: _categoryError != null
        ? const TextStyle(color: Colors.red)
        : null,
  ),
  hint: Text(
    _isLoadingCategories
        ? 'Loading categories...'
        : 'Select a category',
  ),
  items: _categories
      .map(
        (category) => DropdownMenuItem<String>(
          value: category.id,
          child: Text(category.name),
        ),
      )
      .toList(),
  onChanged: _isLoadingCategories
      ? null
      : (value) {
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
                maxLines: 5,
                decoration: _inputDecoration(
                  label: 'Description',
                  hint:
                      'Describe the item, its condition and what buyers should know.',
                ),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Enter a description.';
                  }

                  if (value.trim().length < 20) {
                    return 'Please provide a little more detail.';
                  }

                  return null;
                },
              ),

              const SizedBox(height: 16),

              TextFormField(
                controller: _priceController,
                keyboardType: const TextInputType.numberWithOptions(
                  decimal: true,
                ),
                decoration: _inputDecoration(
                  label: 'Price',
                  hint: 'e.g. 3200000',
                ).copyWith(prefixText: '₦ '),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Enter a price.';
                  }

                  final price = double.tryParse(
                    value.replaceAll(',', '').trim(),
                  );

                  if (price == null || price <= 0) {
                    return 'Enter a valid price.';
                  }

                  return null;
                },
              ),

              const SizedBox(height: 16),

              DropdownButtonFormField<String>(
                initialValue: _condition,
                decoration: _inputDecoration(label: 'Condition'),
                items: const [
                  DropdownMenuItem(value: 'FAULTY', child: Text('Faulty')),
                  DropdownMenuItem(value: 'USED', child: Text('Used')),
                  DropdownMenuItem(
                    value: 'REFURBISHED',
                    child: Text('Refurbished'),
                  ),
                  DropdownMenuItem(value: 'BRAND_NEW', child: Text('New')),
                ],
                onChanged: (value) {
                  if (value == null) return;

                  setState(() {
                    _condition = value;
                  });
                },
              ),

              const SizedBox(height: 16),

              DropdownButtonFormField<String>(
                initialValue: _faultSeverity,
                decoration: _inputDecoration(label: 'Fault Severity'),
                items: const [
                  DropdownMenuItem(value: 'NONE', child: Text('None')),
                  DropdownMenuItem(value: 'MINOR', child: Text('Minor')),
                  DropdownMenuItem(value: 'MODERATE', child: Text('Moderate')),
                  DropdownMenuItem(value: 'MAJOR', child: Text('Major')),
                  DropdownMenuItem(value: 'CRITICAL', child: Text('Critical')),
                ],
                onChanged: (value) {
                  if (value == null) return;

                  setState(() {
                    _faultSeverity = value;
                  });
                },
              ),

              const SizedBox(height: 16),

              TextFormField(
                controller: _faultDescriptionController,
                maxLines: 3,
                decoration: _inputDecoration(
                  label: 'Fault Description',
                  hint: 'e.g. Engine fault requiring repair',
                ),
                validator: (value) {
                  if (_condition == 'FAULTY' &&
                      (value == null || value.trim().isEmpty)) {
                    return 'Describe the fault.';
                  }

                  return null;
                },
              ),

              const SizedBox(height: 16),

              TextFormField(
                controller: _locationController,
                decoration: _inputDecoration(
                  label: 'Location',
                  hint: 'e.g. Ikeja',
                ),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Enter the listing location.';
                  }

                  return null;
                },
              ),

              const SizedBox(height: 16),

              TextFormField(
                controller: _stateController,
                decoration: _inputDecoration(
                  label: 'State',
                  hint: 'e.g. Lagos',
                ),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Enter the state.';
                  }

                  return null;
                },
              ),

              const SizedBox(height: 16),

              TextFormField(
                controller: _cityController,
                decoration: _inputDecoration(label: 'City', hint: 'e.g. Ikeja'),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Enter the city.';
                  }

                  return null;
                },
              ),

              const SizedBox(height: 8),

              SwitchListTile(
                contentPadding: EdgeInsets.zero,
                title: const Text(
                  'Price is negotiable',
                  style: TextStyle(fontWeight: FontWeight.w600),
                ),
                value: _negotiable,
                activeTrackColor: AppTheme.primaryRed,
                onChanged: (value) {
                  setState(() {
                    _negotiable = value;
                  });
                },
              ),

              const SizedBox(height: 24),

              SizedBox(
                height: 54,
                child: FilledButton(
                  style: FilledButton.styleFrom(
                    backgroundColor: AppTheme.primaryRed,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                  ),
                  onPressed: _isSubmitting ? null : _submitListing,
                  child: _isSubmitting
                      ? const SizedBox(
                          width: 22,
                          height: 22,
                          child: CircularProgressIndicator(
                            strokeWidth: 2.5,
                            valueColor: AlwaysStoppedAnimation<Color>(
                              Colors.white,
                            ),
                          ),
                        )
                      : const Text(
                          'Post Listing',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildAiAssistant() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.black,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(Icons.auto_awesome, color: Colors.black),
              ),
              const SizedBox(width: 12),
              const Expanded(
                child: Text(
                  'AI Listing Assistant',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          const Text(
            'Improve your title and description and get useful suggestions for buyers.',
            style: TextStyle(color: Colors.white70, height: 1.4),
          ),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: _isGeneratingAi ? null : _generateAiSuggestions,
              icon: _isGeneratingAi
                  ? const SizedBox(
                      width: 18,
                      height: 18,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        color: Colors.black,
                      ),
                    )
                  : const Icon(Icons.auto_awesome),
              label: Text(
                _isGeneratingAi ? 'Generating...' : 'Improve with AI',
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.white,
                foregroundColor: Colors.black,
                disabledBackgroundColor: Colors.white70,
                disabledForegroundColor: Colors.black54,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
          ),
          if (_aiError != null) ...[
            const SizedBox(height: 12),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.white12,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Text(
                _aiError!,
                style: const TextStyle(color: Colors.white, height: 1.4),
              ),
            ),
          ],
          if (_aiResult != null) ...[
            const SizedBox(height: 16),
            _buildAiResultCard(),
          ],
          const SizedBox(height: 12),
          const Text(
            'Review AI suggestions before posting. AI does not verify the item or diagnose faults.',
            style: TextStyle(color: Colors.white54, fontSize: 12, height: 1.4),
          ),
        ],
      ),
    );
  }

  Widget _buildAiResultCard() {
    final result = _aiResult!;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (result.suggestedTitle.trim().isNotEmpty)
            _buildAiResultSection(
              title: 'Suggested Title',
              content: result.suggestedTitle,
            ),
          if (result.improvedDescription.trim().isNotEmpty)
            _buildAiResultSection(
              title: 'Improved Description',
              content: result.improvedDescription,
            ),
          if (result.suggestedFaultSeverity != null)
            _buildAiResultSection(
              title: 'Suggested Fault Severity',
              content: result.suggestedFaultSeverity!,
            ),
          if (result.suggestions.isNotEmpty) ...[
            const Text(
              'Buyer Information Suggestions',
              style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14),
            ),
            const SizedBox(height: 8),
            ...result.suggestions.map(
              (suggestion) => Padding(
                padding: const EdgeInsets.only(bottom: 6),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('- '),
                    Expanded(
                      child: Text(
                        suggestion,
                        style: const TextStyle(height: 1.4),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
          const SizedBox(height: 12),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: _applyAiSuggestions,
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.black,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 13),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
              child: const Text('Apply Suggestions'),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAiResultSection({
    required String title,
    required String content,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14),
          ),
          const SizedBox(height: 5),
          Text(content, style: const TextStyle(height: 1.4)),
        ],
      ),
    );
  }

  Widget _buildImagePicker() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Photos',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
        ),
        const SizedBox(height: 6),
        Text(
          'Add up to 10 clear photos. The first photo '
          'will be your primary listing image.',
          style: TextStyle(color: Colors.grey.shade600, fontSize: 13),
        ),
        const SizedBox(height: 12),

        if (_images.isEmpty)
          InkWell(
            onTap: _pickImages,
            borderRadius: BorderRadius.circular(16),
            child: Container(
              width: double.infinity,
              height: 150,
              decoration: BoxDecoration(
                color: Colors.grey.shade50,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.grey.shade300),
              ),
              child: const Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.add_a_photo_outlined,
                    size: 38,
                    color: AppTheme.primaryRed,
                  ),
                  SizedBox(height: 10),
                  Text(
                    'Add photos',
                    style: TextStyle(fontWeight: FontWeight.w700),
                  ),
                  SizedBox(height: 4),
                  Text(
                    'Tap to select images',
                    style: TextStyle(color: Colors.grey),
                  ),
                ],
              ),
            ),
          )
        else
          Column(
            children: [
              SizedBox(
                height: 110,
                child: ListView.separated(
                  scrollDirection: Axis.horizontal,
                  itemCount: _images.length + 1,
                  separatorBuilder: (_, _) => const SizedBox(width: 10),
                  itemBuilder: (context, index) {
                    if (index == _images.length) {
                      return _buildAddImageButton();
                    }

                    return _buildImagePreview(index);
                  },
                ),
              ),
              const SizedBox(height: 8),
              Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  '${_images.length}/10 photos selected',
                  style: TextStyle(color: Colors.grey.shade600, fontSize: 12),
                ),
              ),
            ],
          ),
      ],
    );
  }

  Widget _buildAddImageButton() {
    return InkWell(
      onTap: _pickImages,
      borderRadius: BorderRadius.circular(14),
      child: Container(
        width: 110,
        height: 110,
        decoration: BoxDecoration(
          color: Colors.grey.shade50,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: Colors.grey.shade300),
        ),
        child: const Icon(
          Icons.add_a_photo_outlined,
          color: AppTheme.primaryRed,
          size: 30,
        ),
      ),
    );
  }

  Widget _buildImagePreview(int index) {
    return Stack(
      children: [
        ClipRRect(
          borderRadius: BorderRadius.circular(14),
          child: FutureBuilder<Uint8List>(
            future: _images[index].readAsBytes(),
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return Container(
                  width: 110,
                  height: 110,
                  decoration: BoxDecoration(
                    color: Colors.grey.shade100,
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: const Center(
                    child: SizedBox(
                      width: 24,
                      height: 24,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    ),
                  ),
                );
              }

              if (snapshot.hasError || !snapshot.hasData) {
                return Container(
                  width: 110,
                  height: 110,
                  decoration: BoxDecoration(
                    color: Colors.grey.shade100,
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: const Icon(
                    Icons.broken_image_outlined,
                    color: Colors.grey,
                    size: 32,
                  ),
                );
              }

              return Image.memory(
                snapshot.data!,
                width: 110,
                height: 110,
                fit: BoxFit.cover,
              );
            },
          ),
        ),
        Positioned(
          top: 6,
          right: 6,
          child: GestureDetector(
            onTap: () => _removeImage(index),
            child: Container(
              width: 26,
              height: 26,
              decoration: const BoxDecoration(
                color: Colors.black54,
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.close, color: Colors.white, size: 17),
            ),
          ),
        ),
        if (index == 0)
          Positioned(
            left: 6,
            bottom: 6,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 4),
              decoration: BoxDecoration(
                color: Colors.black54,
                borderRadius: BorderRadius.circular(6),
              ),
              child: const Text(
                'Primary',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 10,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
          ),
      ],
    );
  }
}
