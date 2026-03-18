import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/providers/network_providers.dart';
import '../../domain/repositories/analytics_repository.dart';
import '../../data/data_sources/analytics_remote_data_source.dart';
import '../../data/repositories/analytics_repository_impl.dart';
import '../../data/models/analytics_overview_model.dart';

// Provides the remote data source
final analyticsRemoteDataSourceProvider = Provider<AnalyticsRemoteDataSource>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return AnalyticsRemoteDataSource(apiClient);
});

// Provides the repository implementation
final analyticsRepositoryProvider = Provider<AnalyticsRepository>((ref) {
  final remoteDataSource = ref.watch(analyticsRemoteDataSourceProvider);
  return AnalyticsRepositoryImpl(remoteDataSource);
});

// Provides the actual analytics data (Auto-refresh on watch)
final analyticsOverviewProvider = FutureProvider<AnalyticsOverviewModel>((ref) async {
  final repository = ref.watch(analyticsRepositoryProvider);
  return repository.getOverviewStats();
});
