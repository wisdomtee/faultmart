import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../core/constants/api_constants.dart';
import '../../core/theme/app_theme.dart';

enum FooterAction {
  browse,
  categories,
  sell,
  latestListings,
  about,
  contact,
  careers,
  blog,
  help,
  privacy,
  terms,
  report,
  home,
}

class HomeFooter extends StatelessWidget {
  const HomeFooter({
    super.key,
    required this.onAction,
  });

  final ValueChanged<FooterAction> onAction;

  Future<void> _visitFaultMart(BuildContext context) async {
    final uri = Uri.parse(ApiConstants.webAppUrl);

    final launched = await launchUrl(
      uri,
      mode: LaunchMode.platformDefault,
    );

    if (!launched && context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Unable to open FaultMart website.'),
        ),
      );
    }
  }

  Future<void> _launchExternal(
    BuildContext context,
    Uri uri,
  ) async {
    final launched = await launchUrl(
      uri,
      mode: LaunchMode.platformDefault,
    );

    if (!launched && context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Unable to open this link.'),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      color: const Color(0xFF0A0A0A),
      padding: const EdgeInsets.fromLTRB(20, 42, 20, 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Brand
          Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Image.asset(
                'assets/images/faultmart-logo.png',
                width: 46,
                height: 46,
                fit: BoxFit.contain,
              ),
              const SizedBox(width: 11),
              const Text.rich(
                TextSpan(
                  children: [
                    TextSpan(
                      text: 'Fault',
                      style: TextStyle(
                        color: AppTheme.primaryRed,
                        fontSize: 25,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    TextSpan(
                      text: 'Mart',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 25,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),

          const SizedBox(height: 18),

          const Text(
            "Africa's trusted marketplace for new & repairable "
            'vehicles, phones, electronics & appliances. '
            'Buy smarter, sell faster and trade with complete transparency.',
            style: TextStyle(
              color: Color(0xFFA3A3A3),
              fontSize: 14,
              height: 1.65,
            ),
          ),

          const SizedBox(height: 26),

          _FooterContactRow(
            icon: Icons.email_outlined,
            text: 'hello@faultmart.ng',
            onTap: () => _launchExternal(
              context,
              Uri(
                scheme: 'mailto',
                path: 'hello@faultmart.ng',
              ),
            ),
          ),

          const SizedBox(height: 14),

          _FooterContactRow(
            icon: Icons.phone_outlined,
            text: '+234 9045903069',
            onTap: () => _launchExternal(
              context,
              Uri(
                scheme: 'tel',
                path: '+2349045903069',
              ),
            ),
          ),

          const SizedBox(height: 14),

          const _FooterContactRow(
            icon: Icons.location_on_outlined,
            text: 'Lagos, Nigeria',
          ),

          const SizedBox(height: 30),

          SizedBox(
            width: double.infinity,
            child: OutlinedButton.icon(
              onPressed: () => _visitFaultMart(context),
              icon: const Icon(
                Icons.language_rounded,
                size: 19,
              ),
              label: const Text('Visit FaultMart'),
              style: OutlinedButton.styleFrom(
                foregroundColor: Colors.white,
                side: const BorderSide(
                  color: Color(0xFF404040),
                ),
                padding: const EdgeInsets.symmetric(
                  vertical: 14,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
          ),

          const SizedBox(height: 38),

          const Divider(
            color: Color(0xFF262626),
            height: 1,
          ),

          const SizedBox(height: 30),

          _FooterSection(
            title: 'Marketplace',
            items: const [
              _FooterItem(
                'Browse Listings',
                FooterAction.browse,
              ),
              _FooterItem(
                'Categories',
                FooterAction.categories,
              ),
              _FooterItem(
                'Sell an Item',
                FooterAction.sell,
              ),
              _FooterItem(
                'Latest Listings',
                FooterAction.latestListings,
              ),
            ],
            onAction: onAction,
          ),

          const SizedBox(height: 32),

          _FooterSection(
            title: 'Company',
            items: const [
              _FooterItem(
                'About Us',
                FooterAction.about,
              ),
              _FooterItem(
                'Contact',
                FooterAction.contact,
              ),
              _FooterItem(
                'Careers',
                FooterAction.careers,
              ),
              _FooterItem(
                'Blog',
                FooterAction.blog,
              ),
            ],
            onAction: onAction,
          ),

          const SizedBox(height: 32),

          _FooterSection(
            title: 'Support',
            items: const [
              _FooterItem(
                'Help Center',
                FooterAction.help,
              ),
              _FooterItem(
                'Privacy Policy',
                FooterAction.privacy,
              ),
              _FooterItem(
                'Terms of Service',
                FooterAction.terms,
              ),
              _FooterItem(
                'Report Abuse',
                FooterAction.report,
              ),
            ],
            onAction: onAction,
          ),

          const SizedBox(height: 34),

          const Divider(
            color: Color(0xFF262626),
            height: 1,
          ),

          const SizedBox(height: 22),

          Center(
            child: Text(
              '© ${DateTime.now().year} FaultMart. All rights reserved.',
              textAlign: TextAlign.center,
              style: const TextStyle(
                color: Color(0xFF737373),
                fontSize: 12,
                height: 1.5,
              ),
            ),
          ),

          const SizedBox(height: 18),

          const Center(
            child: Text(
              'Built by TechNerve',
              style: TextStyle(
                color: Color(0xFFA3A3A3),
                fontSize: 13,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _FooterContactRow extends StatelessWidget {
  const _FooterContactRow({
    required this.icon,
    required this.text,
    this.onTap,
  });

  final IconData icon;
  final String text;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final content = Row(
      children: [
        Icon(
          icon,
          size: 19,
          color: AppTheme.primaryOrange,
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Text(
            text,
            style: const TextStyle(
              color: Color(0xFFA3A3A3),
              fontSize: 14,
            ),
          ),
        ),
      ],
    );

    if (onTap == null) {
      return content;
    }

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 2),
        child: content,
      ),
    );
  }
}

class _FooterItem {
  const _FooterItem(
    this.label,
    this.action,
  );

  final String label;
  final FooterAction action;
}

class _FooterSection extends StatelessWidget {
  const _FooterSection({
    required this.title,
    required this.items,
    required this.onAction,
  });

  final String title;
  final List<_FooterItem> items;
  final ValueChanged<FooterAction> onAction;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title.toUpperCase(),
          style: const TextStyle(
            color: AppTheme.primaryOrange,
            fontSize: 12,
            fontWeight: FontWeight.w800,
            letterSpacing: 1.1,
          ),
        ),
        const SizedBox(height: 16),
        ...items.map(
          (item) => Padding(
            padding: const EdgeInsets.only(bottom: 13),
            child: InkWell(
              onTap: () => onAction(item.action),
              borderRadius: BorderRadius.circular(6),
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 2),
                child: Text(
                  item.label,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 14,
                  ),
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}
