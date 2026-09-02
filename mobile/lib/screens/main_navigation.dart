import 'package:flutter/material.dart';

import '../core/theme/app_theme.dart';
import '../widgets/home/home_footer.dart';
import 'home/home_screen.dart';
import 'listings/browse_screen.dart';
import 'listings/saved_screen.dart';
import 'profile/account_screen.dart';
import 'sell/sell_screen.dart';
import 'support/about_screen.dart';
import 'support/contact_support_screen.dart';
import 'support/footer_information_screens.dart';
import 'support/help_center_screen.dart';

class MainNavigation extends StatefulWidget {
  const MainNavigation({super.key});

  @override
  State<MainNavigation> createState() => _MainNavigationState();
}

class _MainNavigationState extends State<MainNavigation> {
  int _currentIndex = 0;

  void _selectTab(int index) {
    setState(() {
      _currentIndex = index;
    });
  }

  void _handleFooterAction(FooterAction action) {
    switch (action) {
      case FooterAction.home:
        _selectTab(0);
        return;

      case FooterAction.browse:
      case FooterAction.categories:
      case FooterAction.latestListings:
        _selectTab(1);
        return;

      case FooterAction.sell:
        _selectTab(2);
        return;

      case FooterAction.about:
        _pushPage(const AboutScreen());
        return;

      case FooterAction.contact:
        _pushPage(const ContactSupportScreen());
        return;

      case FooterAction.help:
        _pushPage(const HelpCenterScreen());
        return;

      case FooterAction.careers:
        _pushPage(const CareersScreen());
        return;

      case FooterAction.blog:
        _pushPage(const BlogScreen());
        return;

      case FooterAction.privacy:
        _pushPage(const PrivacyScreen());
        return;

      case FooterAction.terms:
        _pushPage(const TermsScreen());
        return;

      case FooterAction.report:
        _pushPage(const ReportScreen());
        return;
    }
  }

  void _pushPage(Widget page) {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => page,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final screens = [
      HomeScreen(
        onNavigate: _selectTab,
        onFooterAction: _handleFooterAction,
      ),
      const BrowseScreen(),
      const SellScreen(),
      const SavedScreen(),
      AccountScreen(onNavigate: _selectTab),
    ];

    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: screens,
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: _selectTab,
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.transparent,
        indicatorColor: AppTheme.primaryRed.withValues(alpha: 0.10),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.home_outlined),
            selectedIcon: Icon(
              Icons.home_rounded,
              color: AppTheme.primaryRed,
            ),
            label: 'Home',
          ),
          NavigationDestination(
            icon: Icon(Icons.search_outlined),
            selectedIcon: Icon(
              Icons.search_rounded,
              color: AppTheme.primaryRed,
            ),
            label: 'Browse',
          ),
          NavigationDestination(
            icon: Icon(Icons.add_circle_outline_rounded),
            selectedIcon: Icon(
              Icons.add_circle_rounded,
              color: AppTheme.primaryRed,
            ),
            label: 'Sell',
          ),
          NavigationDestination(
            icon: Icon(Icons.favorite_outline_rounded),
            selectedIcon: Icon(
              Icons.favorite_rounded,
              color: AppTheme.primaryRed,
            ),
            label: 'Saved',
          ),
          NavigationDestination(
            icon: Icon(Icons.person_outline_rounded),
            selectedIcon: Icon(
              Icons.person_rounded,
              color: AppTheme.primaryRed,
            ),
            label: 'Account',
          ),
        ],
      ),
    );
  }
}
