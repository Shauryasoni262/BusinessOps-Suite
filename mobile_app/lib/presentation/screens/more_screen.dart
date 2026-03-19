import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/app_theme.dart';
import '../providers/theme_providers.dart';
import 'chat_screen.dart';
import 'resume_analyzer_screen.dart';

class MoreScreen extends ConsumerWidget {
  const MoreScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark ? const Color(0xFF0F172A) : AppColors.background,
      appBar: AppBar(
        title: Text('More', style: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          children: [
            _MoreTile(
              icon: Icons.analytics_outlined,
              title: 'Resume Analyzer',
              subtitle: 'AI-powered resume insights',
              color: const Color(0xFF10B981),
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const ResumeAnalyzerScreen()),
                );
              },
            ),
            const SizedBox(height: 16),
            _MoreTile(
              icon: Icons.auto_awesome_rounded,
              title: 'AI Intelligence',
              subtitle: 'Advanced AI assistant & analysis',
              color: const Color(0xFFA855F7),
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const ChatScreen()),
                );
              },
            ),
            const SizedBox(height: 16),
            _MoreTile(
              icon: Icons.person_outline_rounded,
              title: 'Profile Settings',
              subtitle: 'Manage your personal info',
              color: const Color(0xFF3B82F6),
              onTap: () {},
            ),
            const SizedBox(height: 16),
            _MoreTile(
              icon: Icons.security_rounded,
              title: 'Privacy & Security',
              subtitle: 'Password & account protection',
              color: const Color(0xFF10B981),
              onTap: () {},
            ),
            const SizedBox(height: 16),
            _MoreTile(
              icon: Icons.notifications_none_rounded,
              title: 'Notifications',
              subtitle: 'Manage alerts & updates',
              color: const Color(0xFFF59E0B),
              onTap: () {},
            ),
            const SizedBox(height: 16),
            _MoreTile(
              icon: Icons.palette_outlined,
              title: 'Appearance',
              subtitle: 'Switch between light and dark themes',
              color: const Color(0xFF3B82F6),
              onTap: () => _showThemePicker(context, ref),
            ),
            const SizedBox(height: 32),
            Divider(color: AppColors.border.withValues(alpha: 0.5)),
            const SizedBox(height: 32),
            _MoreTile(
              icon: Icons.help_outline_rounded,
              title: 'Help & Support',
              subtitle: 'Get assistance or report issues',
              color: AppColors.textMuted,
              onTap: () {},
            ),
          ],
        ),
      ),
    );
  }

  void _showThemePicker(BuildContext context, WidgetRef ref) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: Theme.of(context).scaffoldBackgroundColor,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(32)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Appearance',
              style: GoogleFonts.outfit(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 24),
            _ThemeOption(
              mode: ThemeMode.system,
              icon: Icons.brightness_auto_rounded,
              label: 'System Default',
              onTap: () {
                ref.read(themeNotifierProvider.notifier).setThemeMode(ThemeMode.system);
                Navigator.pop(context);
              },
            ),
            _ThemeOption(
              mode: ThemeMode.light,
              icon: Icons.light_mode_rounded,
              label: 'Light Mode',
              onTap: () {
                ref.read(themeNotifierProvider.notifier).setThemeMode(ThemeMode.light);
                Navigator.pop(context);
              },
            ),
            _ThemeOption(
              mode: ThemeMode.dark,
              icon: Icons.dark_mode_rounded,
              label: 'Dark Mode',
              onTap: () {
                ref.read(themeNotifierProvider.notifier).setThemeMode(ThemeMode.dark);
                Navigator.pop(context);
              },
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }
}

class _ThemeOption extends ConsumerWidget {
  final ThemeMode mode;
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const _ThemeOption({
    required this.mode,
    required this.icon,
    required this.label,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final currentMode = ref.watch(themeNotifierProvider);
    final isSelected = currentMode == mode;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(
            color: isSelected 
              ? AppColors.primary.withValues(alpha: 0.1) 
              : (isDark ? const Color(0xFF1E293B) : Colors.white),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: isSelected ? AppColors.primary : AppColors.border.withValues(alpha: 0.5),
              width: isSelected ? 2 : 1,
            ),
          ),
          child: Row(
            children: [
              Icon(icon, color: isSelected ? AppColors.primary : AppColors.textMuted),
              const SizedBox(width: 16),
              Text(
                label,
                style: GoogleFonts.inter(
                  fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                  color: isSelected ? AppColors.primary : (isDark ? Colors.white : AppColors.textPrimary),
                ),
              ),
              const Spacer(),
              if (isSelected)
                const Icon(Icons.check_circle_rounded, color: AppColors.primary),
            ],
          ),
        ),
      ),
    );
  }
}

class _MoreTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final Color color;
  final VoidCallback onTap;

  const _MoreTile({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isDark ? const Color(0xFF1E293B) : Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: AppColors.border.withValues(alpha: 0.5)),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: color, size: 24),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: GoogleFonts.inter(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: isDark ? Colors.white : AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    subtitle,
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      color: AppColors.textMuted,
                    ),
                  ),
                ],
              ),
            ),
            const Icon(Icons.chevron_right_rounded, color: AppColors.textMuted, size: 20),
          ],
        ),
      ),
    );
  }
}
