import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../providers/analytics_providers.dart';
import '../providers/auth_providers.dart';
import '../providers/project_providers.dart';
import '../widgets/stat_card.dart';
import '../widgets/project_card.dart';
import '../../core/theme/app_theme.dart';

class DashboardScreen extends ConsumerWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final analyticsAsync = ref.watch(analyticsOverviewProvider);
    final user = ref.watch(authStateProvider).value;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      body: RefreshIndicator(
        onRefresh: () async {
          ref.invalidate(analyticsOverviewProvider);
          ref.invalidate(projectsProvider);
        },
        child: CustomScrollView(
          physics: const BouncingScrollPhysics(),
          slivers: [
            // Professional Clean Header
            SliverAppBar(
              floating: true,
              pinned: true,
              expandedHeight: 100,
              collapsedHeight: 80,
              backgroundColor: isDark ? const Color(0xFF0F172A) : AppColors.background,
              elevation: 0,
              flexibleSpace: FlexibleSpaceBar(
                background: SafeArea(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 8.0),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              'BusinessOps.',
                              style: GoogleFonts.outfit(
                                fontSize: 24,
                                fontWeight: FontWeight.w800,
                                color: isDark ? Colors.white : AppColors.textPrimary,
                                letterSpacing: -0.5,
                              ),
                            ),
                            Text(
                              'The Intelligence Suite',
                              style: GoogleFonts.inter(
                                fontSize: 12,
                                fontWeight: FontWeight.w500,
                                color: AppColors.textMuted,
                              ),
                            ),
                          ],
                        ),
                        _HeaderActions(userImageUrl: user?.avatarUrl),
                      ],
                    ),
                  ),
                ),
              ),
            ),

            // Search Hub
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(24, 12, 24, 32),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  decoration: BoxDecoration(
                    color: isDark ? const Color(0xFF1E293B) : Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppColors.border.withValues(alpha: 0.5)),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.02),
                        blurRadius: 10,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.search_rounded, color: AppColors.textMuted, size: 20),
                      const SizedBox(width: 12),
                      Text(
                        'Search projects, analytics, or invoices...',
                        style: GoogleFonts.inter(
                          fontSize: 14,
                          color: AppColors.textMuted,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),

            // Section: Overview
            _SectionHeader(title: 'Overview', actionText: 'Real-time'),

            // Stats Bento Grid
            analyticsAsync.when(
              data: (stats) => SliverPadding(
                padding: const EdgeInsets.symmetric(horizontal: 24.0),
                sliver: SliverGrid(
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    mainAxisSpacing: 16,
                    crossAxisSpacing: 16,
                    childAspectRatio: 1.1,
                  ),
                  delegate: SliverChildListDelegate([
                    StatCard(
                      title: 'Revenue',
                      value: '\$${(stats.revenue / 1000).toStringAsFixed(1)}k',
                      growth: stats.revenueGrowth,
                      icon: Icons.payments_rounded,
                      color: const Color(0xFF3B82F6),
                    ),
                    StatCard(
                      title: 'Projects',
                      value: stats.activeProjects.toString(),
                      growth: stats.projectGrowth,
                      icon: Icons.rocket_launch_rounded,
                      color: const Color(0xFFA855F7),
                    ),
                    StatCard(
                      title: 'Team Size',
                      value: stats.totalUsers.toString(),
                      growth: stats.userGrowth,
                      icon: Icons.group_rounded,
                      color: const Color(0xFF10B981),
                    ),
                    StatCard(
                      title: 'Response',
                      value: '${stats.avgResponseTime}h',
                      growth: stats.responseTimeChange,
                      icon: Icons.speed_rounded,
                      color: const Color(0xFFF59E0B),
                    ),
                  ]),
                ),
              ),
              loading: () => const SliverToBoxAdapter(
                child: Center(child: CircularProgressIndicator()),
              ),
              error: (err, stack) => const SliverToBoxAdapter(child: SizedBox()),
            ),

            const SliverToBoxAdapter(child: SizedBox(height: 32)),

            // Section: Quick Actions
            _SectionHeader(title: 'Quick Actions', actionText: 'Custom'),

            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24.0),
                child: Row(
                  children: [
                    _QuickActionIcon(icon: Icons.add_rounded, label: 'Task', color: AppColors.primary),
                    const SizedBox(width: 16),
                    _QuickActionIcon(icon: Icons.description_outlined, label: 'Invoice', color: const Color(0xFF10B981)),
                    const SizedBox(width: 16),
                    _QuickActionIcon(icon: Icons.group_add_outlined, label: 'Invite', color: const Color(0xFFA855F7)),
                  ],
                ),
              ),
            ),

            const SliverToBoxAdapter(child: SizedBox(height: 32)),

            // Section: Recent Projects
            _SectionHeader(title: 'Recent Projects', actionText: 'View All'),

            // Projects List
            ref.watch(projectsProvider).when(
              data: (projects) => SliverPadding(
                padding: const EdgeInsets.symmetric(horizontal: 24.0),
                sliver: SliverList(
                  delegate: SliverChildBuilderDelegate(
                    (context, index) => ProjectCard(
                      project: projects[index],
                      onTap: () {},
                    ),
                    childCount: projects.length > 5 ? 5 : projects.length,
                  ),
                ),
              ),
              loading: () => const SliverToBoxAdapter(
                child: Center(child: CircularProgressIndicator()),
              ),
              error: (err, stack) => const SliverToBoxAdapter(child: SizedBox()),
            ),

            // Bottom Spacing for Floating Nav
            const SliverToBoxAdapter(child: SizedBox(height: 120)),
          ],
        ),
      ),
    );
  }
}

class _HeaderActions extends ConsumerWidget {
  final String? userImageUrl;
  const _HeaderActions({this.userImageUrl});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Row(
      children: [
        IconButton(
          onPressed: () => ref.read(authStateProvider.notifier).signOut(),
          icon: Icon(Icons.logout_rounded, color: AppColors.error, size: 20),
          tooltip: 'Logout',
        ),
        const SizedBox(width: 4),
        _CircleAction(icon: Icons.notifications_none_rounded, isDark: isDark),
        const SizedBox(width: 12),
        CircleAvatar(
          radius: 20,
          backgroundColor: AppColors.primary,
          backgroundImage: userImageUrl != null ? NetworkImage(userImageUrl!) : null,
          child: userImageUrl == null 
              ? const Icon(Icons.person_rounded, color: Colors.white, size: 20) 
              : null,
        ),
      ],
    );
  }
}

class _CircleAction extends StatelessWidget {
  final IconData icon;
  final bool isDark;
  const _CircleAction({required this.icon, required this.isDark});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E293B) : Colors.white,
        shape: BoxShape.circle,
        border: Border.all(color: AppColors.border.withValues(alpha: 0.5)),
      ),
      child: Icon(icon, color: AppColors.textPrimary, size: 20),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  final String title;
  final String actionText;
  const _SectionHeader({required this.title, required this.actionText});

  @override
  Widget build(BuildContext context) {
    return SliverToBoxAdapter(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 12.0),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              title,
              style: GoogleFonts.outfit(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: AppColors.textPrimary,
              ),
            ),
            Text(
              actionText,
              style: GoogleFonts.inter(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: AppColors.primary,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _QuickActionIcon extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;

  const _QuickActionIcon({
    required this.icon,
    required this.label,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    return Expanded(
      child: Column(
        children: [
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(vertical: 20),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: color.withValues(alpha: 0.2)),
            ),
            child: Icon(icon, color: color, size: 28),
          ),
          const SizedBox(height: 8),
          Text(
            label,
            style: GoogleFonts.inter(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: isDark ? Colors.white70 : AppColors.textPrimary,
            ),
          ),
        ],
      ),
    );
  }
}
