import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'dashboard_screen.dart';
import 'chat_screen.dart';
import 'offer_letter_screen.dart';
import 'more_screen.dart';
import 'projects_screen.dart';
import '../../core/theme/app_theme.dart';

// Provides the current bottom nav index
final navigationIndexProvider = StateProvider<int>((ref) => 0);

class MainScreen extends ConsumerWidget {
  const MainScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final currentIndex = ref.watch(navigationIndexProvider);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    final screens = [
      const DashboardScreen(),
      const ProjectsScreen(),
      const OfferLetterScreen(),
      const ChatScreen(), // This will be "Community Chat" or "Global Chat"
      const MoreScreen(),
    ];

    return Scaffold(
      body: Stack(
        children: [
          Padding(
            padding: const EdgeInsets.only(bottom: 95), // Height of _PremiumNavBar
            child: IndexedStack(
              index: currentIndex,
              children: screens,
            ),
          ),
          
          // Premium Docked Navigation Bar
          Positioned(
            left: 0,
            right: 0,
            bottom: 0,
            child: _PremiumNavBar(
              currentIndex: currentIndex,
              onTap: (index) => ref.read(navigationIndexProvider.notifier).state = index,
              isDark: isDark,
            ),
          ),
        ],
      ),
    );
  }
}

class _PremiumNavBar extends StatelessWidget {
  final int currentIndex;
  final ValueChanged<int> onTap;
  final bool isDark;

  const _PremiumNavBar({
    required this.currentIndex,
    required this.onTap,
    required this.isDark,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 95,
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E293B) : Colors.white,
        border: Border(
          top: BorderSide(color: AppColors.border.withValues(alpha: 0.5)),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 20,
            offset: const Offset(0, -5),
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            _NavBarItem(
              icon: currentIndex == 0 ? Icons.grid_view_rounded : Icons.grid_view_outlined,
              label: 'Dashboard',
              isActive: currentIndex == 0,
              onTap: () => onTap(0),
            ),
            _NavBarItem(
              icon: currentIndex == 1 ? Icons.rocket_launch_rounded : Icons.rocket_launch_outlined,
              label: 'Projects',
              isActive: currentIndex == 1,
              onTap: () => onTap(1),
            ),
            _NavBarFloatingItem(
              icon: currentIndex == 2 ? Icons.description_rounded : Icons.description_outlined,
              label: 'Offers',
              isActive: currentIndex == 2,
              onTap: () => onTap(2),
            ),
            _NavBarItem(
              icon: currentIndex == 3 ? Icons.chat_bubble_rounded : Icons.chat_bubble_outline_rounded,
              label: 'Chat',
              isActive: currentIndex == 3,
              onTap: () => onTap(3),
            ),
            _NavBarItem(
              icon: currentIndex == 4 ? Icons.more_horiz_rounded : Icons.more_horiz,
              label: 'More',
              isActive: currentIndex == 4,
              onTap: () => onTap(4),
            ),
          ],
        ),
      ),
    );
  }
}

class _NavBarFloatingItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool isActive;
  final VoidCallback onTap;

  const _NavBarFloatingItem({
    required this.icon,
    required this.label,
    required this.isActive,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final color = isActive ? Colors.white : AppColors.primary;
    
    return InkWell(
      onTap: onTap,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: isActive ? AppColors.primary : AppColors.primary.withValues(alpha: 0.1),
              shape: BoxShape.circle,
              boxShadow: isActive ? [
                BoxShadow(
                  color: AppColors.primary.withValues(alpha: 0.3),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                )
              ] : [],
            ),
            child: Icon(icon, color: color, size: 28),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: TextStyle(
              fontSize: 10,
              fontWeight: isActive ? FontWeight.bold : FontWeight.w500,
              color: isActive ? AppColors.primary : AppColors.textMuted,
            ),
          ),
        ],
      ),
    );
  }
}

class _NavBarItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool isActive;
  final VoidCallback onTap;

  const _NavBarItem({
    required this.icon,
    required this.label,
    required this.isActive,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final color = isActive ? AppColors.primary : AppColors.textMuted;
    
    return InkWell(
      onTap: onTap,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
            decoration: BoxDecoration(
              color: isActive ? AppColors.primary.withValues(alpha: 0.1) : Colors.transparent,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: color, size: 24),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: TextStyle(
              fontSize: 10,
              fontWeight: isActive ? FontWeight.bold : FontWeight.w500,
              color: color,
            ),
          ),
        ],
      ),
    );
  }
}

