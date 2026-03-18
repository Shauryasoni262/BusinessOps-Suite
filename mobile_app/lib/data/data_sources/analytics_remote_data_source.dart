import '../../core/network/api_client.dart';
import '../models/analytics_overview_model.dart';

class AnalyticsRemoteDataSource {
  final ApiClient _apiClient;

  AnalyticsRemoteDataSource(this._apiClient);

  Future<AnalyticsOverviewModel> getOverviewStats() async {
    final response = await _apiClient.dio.get('/analytics/overview');
    
    if (response.data['success'] == true) {
      return AnalyticsOverviewModel.fromJson(response.data['data']);
    } else {
      throw Exception(response.data['message'] ?? 'Failed to fetch analytics');
    }
  }
}
