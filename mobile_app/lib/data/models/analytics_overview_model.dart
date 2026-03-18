import 'package:freezed_annotation/freezed_annotation.dart';

part 'analytics_overview_model.freezed.dart';
part 'analytics_overview_model.g.dart';

@freezed
class AnalyticsOverviewModel with _$AnalyticsOverviewModel {
  const AnalyticsOverviewModel._();

  const factory AnalyticsOverviewModel({
    required int totalUsers,
    required double userGrowth,
    required int activeProjects,
    required double projectGrowth,
    required double revenue,
    required double revenueGrowth,
    required double avgResponseTime,
    required double responseTimeChange,
  }) = _AnalyticsOverviewModel;

  factory AnalyticsOverviewModel.fromJson(Map<String, dynamic> json) => _$AnalyticsOverviewModelFromJson(json);
}
