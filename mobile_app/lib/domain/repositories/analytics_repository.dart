import '../../data/models/analytics_overview_model.dart';

abstract class AnalyticsRepository {
  Future<AnalyticsOverviewModel> getOverviewStats();
}
