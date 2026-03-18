import '../../domain/repositories/analytics_repository.dart';
import '../data_sources/analytics_remote_data_source.dart';
import '../models/analytics_overview_model.dart';

class AnalyticsRepositoryImpl implements AnalyticsRepository {
  final AnalyticsRemoteDataSource _remoteDataSource;

  AnalyticsRepositoryImpl(this._remoteDataSource);

  @override
  Future<AnalyticsOverviewModel> getOverviewStats() {
    return _remoteDataSource.getOverviewStats();
  }
}
