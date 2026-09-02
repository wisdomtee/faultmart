import 'package:flutter/material.dart';

import '../../core/theme/app_theme.dart';

class CareersScreen extends StatelessWidget {
  const CareersScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const _InformationScreen(
      title: 'Careers at FaultMart',
      eyebrow: 'Careers',
      icon: Icons.work_outline_rounded,
      heading: 'Build the future of repairable goods with us.',
      intro:
          'We are building a marketplace that makes it easier for people '
          'across Africa to buy, sell, repair, and reuse faulty vehicles '
          'and appliances.',
      sections: [
        _InformationSection(
          title: 'Open positions',
          body:
              'We do not have any open positions right now. Please check '
              'back later for new opportunities at FaultMart.',
        ),
        _InformationSection(
          title: 'Interested in working with us?',
          body:
              'For future opportunities, partnerships or team enquiries, '
              'contact the FaultMart team through our support channels.',
        ),
      ],
    );
  }
}

class BlogScreen extends StatelessWidget {
  const BlogScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const _InformationScreen(
      title: 'FaultMart Blog',
      eyebrow: 'Blog',
      icon: Icons.article_outlined,
      heading: 'Repair, reuse and marketplace insights.',
      intro:
          'Helpful guides, marketplace insights, repair tips and updates '
          'from FaultMart.',
      sections: [
        _InformationSection(
          title: 'Coming soon',
          body:
              'We are preparing practical guides and insights covering '
              'buying, selling, repairs, faulty products and safer '
              'marketplace trading.',
        ),
      ],
    );
  }
}

class PrivacyScreen extends StatelessWidget {
  const PrivacyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const _InformationScreen(
      title: 'Privacy Policy',
      eyebrow: 'Legal',
      icon: Icons.privacy_tip_outlined,
      heading: 'How FaultMart handles your information.',
      intro:
          'This policy explains how FaultMart handles information when '
          'you use our marketplace and related services.',
      sections: [
        _InformationSection(
          title: '1. Information We Collect',
          body:
              'When you use FaultMart, we may collect information you '
              'provide when creating an account, creating a listing, '
              'communicating with other users, making offers or contacting '
              'our support team. This may include your name, email address, '
              'phone number, location information and information associated '
              'with your listings or transactions.',
        ),
        _InformationSection(
          title: '2. How We Use Your Information',
          body:
              'We use information to operate and improve FaultMart, provide '
              'marketplace services, help buyers and sellers communicate, '
              'process marketplace activities, maintain account security, '
              'respond to support requests and detect or investigate '
              'suspicious activity.',
        ),
        _InformationSection(
          title: '3. Marketplace Information',
          body:
              'Information included in a marketplace listing may be visible '
              'to other FaultMart users. Sellers should avoid publishing '
              'sensitive personal information in listing descriptions, '
              'photographs or other public areas of the marketplace.',
        ),
        _InformationSection(
          title: '4. Communications',
          body:
              'FaultMart may provide communication features that allow '
              'buyers and sellers to interact. Information shared through '
              'these features should be limited to what is reasonably '
              'necessary to complete or discuss a transaction.',
        ),
        _InformationSection(
          title: '5. Data Security',
          body:
              'We take reasonable technical and organizational measures '
              'to protect information associated with FaultMart accounts '
              'and marketplace activity. However, no internet-based service '
              'can guarantee absolute security.',
        ),
        _InformationSection(
          title: '6. Third-Party Services',
          body:
              'FaultMart may rely on trusted third-party infrastructure '
              'and service providers to operate parts of the platform. '
              'These providers may process information only as necessary '
              'to provide their services to FaultMart.',
        ),
        _InformationSection(
          title: '7. Your Choices',
          body:
              'You may review and update certain account information through '
              'your FaultMart account. If you have questions about your '
              'personal information or want to request assistance with your '
              'information, you can contact the FaultMart team.',
        ),
        _InformationSection(
          title: '8. Changes to This Policy',
          body:
              'We may update this Privacy Policy as FaultMart develops. '
              'When material changes are made, we may provide an appropriate '
              'notice through the platform or other available communication '
              'channels.',
        ),
        _InformationSection(
          title: '9. Contact Us',
          body:
              'If you have questions about this Privacy Policy or how '
              'information is handled on FaultMart, please contact our '
              'support team.',
        ),
      ],
    );
  }
}

class TermsScreen extends StatelessWidget {
  const TermsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const _InformationScreen(
      title: 'Terms of Service',
      eyebrow: 'Legal',
      icon: Icons.gavel_outlined,
      heading: 'The rules for using FaultMart.',
      intro:
          'These terms explain the responsibilities of users when using '
          'FaultMart and its marketplace services.',
      sections: [
        _InformationSection(
          title: '1. About FaultMart',
          body:
              'FaultMart is a marketplace that connects buyers and sellers '
              'of vehicles, electronics, appliances, parts, tools and other '
              'products, including products that may be faulty, damaged or '
              'in need of repair.',
        ),
        _InformationSection(
          title: '2. Using FaultMart',
          body:
              'You agree to use FaultMart lawfully and responsibly. You must '
              'provide accurate information when creating an account or '
              'listing and must not use the platform for fraudulent, abusive, '
              'deceptive or unlawful activity.',
        ),
        _InformationSection(
          title: '3. Accounts',
          body:
              'Some FaultMart features require an account. You are responsible '
              'for keeping your account credentials secure and for activity '
              'carried out through your account.',
        ),
        _InformationSection(
          title: '4. Listings',
          body:
              'Sellers are responsible for the accuracy of their listings. '
              'Product descriptions, photographs, prices, locations, condition '
              'information and disclosed faults should accurately represent '
              'the item being offered.',
        ),
        _InformationSection(
          title: '5. Faulty and Repairable Products',
          body:
              'FaultMart is specifically designed to support the trade of '
              'products that may require repair. Buyers should carefully '
              'review listing information, ask questions where necessary '
              'and assess whether a product is suitable for their intended '
              'use before completing a transaction.',
        ),
        _InformationSection(
          title: '6. Offers and Negotiations',
          body:
              'Offers made through FaultMart represent negotiations between '
              'buyers and sellers. Users should communicate clearly and act '
              'in good faith.',
        ),
        _InformationSection(
          title: '7. Transactions',
          body:
              'FaultMart provides marketplace infrastructure but users '
              'remain responsible for ensuring that transactions comply '
              'with applicable laws and regulations.',
        ),
        _InformationSection(
          title: '8. Prohibited Activities',
          body:
              'You may not use FaultMart to list or facilitate unlawful '
              'goods or services, impersonate another person, intentionally '
              'provide misleading information, interfere with platform '
              'security or abuse communication features.',
        ),
        _InformationSection(
          title: '9. Reports and Enforcement',
          body:
              'FaultMart may review reports involving listings, accounts or '
              'marketplace activity. Where appropriate, we may remove content, '
              'restrict accounts or take other measures to protect the '
              'marketplace and its users.',
        ),
        _InformationSection(
          title: '10. Marketplace Availability',
          body:
              'We work to keep FaultMart available and reliable, but we do '
              'not guarantee uninterrupted access. Features may occasionally '
              'be modified, suspended or unavailable.',
        ),
        _InformationSection(
          title: '11. Changes to These Terms',
          body:
              'These Terms of Service may be updated as FaultMart evolves. '
              'Continued use of the platform after an updated version becomes '
              'effective means you agree to the revised terms.',
        ),
        _InformationSection(
          title: '12. Contact',
          body:
              'If you have questions about these Terms of Service, please '
              'contact the FaultMart team through the available support '
              'channels.',
        ),
      ],
    );
  }
}

class ReportScreen extends StatelessWidget {
  const ReportScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const _InformationScreen(
      title: 'Report a Problem',
      eyebrow: 'Marketplace Safety',
      icon: Icons.flag_outlined,
      heading: 'Help us keep FaultMart safe and trustworthy.',
      intro:
          'Report listings, accounts or behaviour that violate our '
          'marketplace standards.',
      sections: [
        _InformationSection(
          title: 'What can you report?',
          body:
              'You can report suspicious or fraudulent listings, misleading '
              'product information, abusive behaviour, scams or attempted '
              'fraud, prohibited or illegal items, and other marketplace '
              'concerns.',
        ),
        _InformationSection(
          title: 'Need to report something?',
          body:
              'Contact the FaultMart support team and provide as much useful '
              'information as possible about the listing, account or activity '
              'you are reporting.',
        ),
      ],
    );
  }
}

class _InformationScreen extends StatelessWidget {
  const _InformationScreen({
    required this.title,
    required this.eyebrow,
    required this.icon,
    required this.heading,
    required this.intro,
    required this.sections,
  });

  final String title;
  final String eyebrow;
  final IconData icon;
  final String heading;
  final String intro;
  final List<_InformationSection> sections;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF7F7F7),
      appBar: AppBar(
        title: Text(title),
        backgroundColor: Colors.white,
        foregroundColor: AppTheme.darkText,
        elevation: 0,
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(20, 20, 20, 36),
        children: [
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: const Color(0xFF0A0A0A),
              borderRadius: BorderRadius.circular(24),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      width: 46,
                      height: 46,
                      decoration: BoxDecoration(
                        color: AppTheme.primaryOrange.withValues(
                          alpha: 0.15,
                        ),
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: Icon(
                        icon,
                        color: AppTheme.primaryOrange,
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Text(
                        eyebrow.toUpperCase(),
                        style: const TextStyle(
                          color: AppTheme.primaryOrange,
                          fontSize: 12,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 1.1,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 22),
                Text(
                  heading,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 27,
                    fontWeight: FontWeight.w800,
                    height: 1.2,
                  ),
                ),
                const SizedBox(height: 14),
                Text(
                  intro,
                  style: const TextStyle(
                    color: Color(0xFFB5B5B5),
                    fontSize: 15,
                    height: 1.6,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 18),
          ...sections.map(
            (section) => Padding(
              padding: const EdgeInsets.only(bottom: 14),
              child: Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color: const Color(0xFFE5E5E5),
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      section.title,
                      style: const TextStyle(
                        color: AppTheme.darkText,
                        fontSize: 17,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    const SizedBox(height: 10),
                    Text(
                      section.body,
                      style: const TextStyle(
                        color: Color(0xFF666666),
                        fontSize: 14,
                        height: 1.65,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _InformationSection {
  const _InformationSection({
    required this.title,
    required this.body,
  });

  final String title;
  final String body;
}
