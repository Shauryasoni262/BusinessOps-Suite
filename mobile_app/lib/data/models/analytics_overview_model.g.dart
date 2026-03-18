// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'analytics_overview_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$AnalyticsOverviewModelImpl _$$AnalyticsOverviewModelImplFromJson(
        Map<String, dynamic> json) =>
    _$AnalyticsOverviewModelImpl(
      totalUsers: (json['totalUsers'] as num).toInt(),
      userGrowth: (json['userGrowth'] as num).toDouble(),
      activeProjects: (json['activeProjects'] as num).toInt(),
      projectGrowth: (json['projectGrowth'] as num).toDouble(),
      revenue: (json['revenue'] as num).toDouble(),
      revenueGrowth: (json['revenueGrowth'] as num).toDouble(),
      avgResponseTime: (json['avgResponseTime'] as num).toDouble(),
      responseTimeChange: (json['responseTimeChange'] as num).toDouble(),
    );

Map<String, dynamic> _$$AnalyticsOverviewModelImplToJson(
        _$AnalyticsOverviewModelImpl instance) =>
    <String, dynamic>{
      'totalUsers': instance.totalUsers,
      'userGrowth': instance.userGrowth,
      'activeProjects': instance.activeProjects,
      'projectGrowth': instance.projectGrowth,
      'revenue': instance.revenue,
      'revenueGrowth': instance.revenueGrowth,
      'avgResponseTime': instance.avgResponseTime,
      'responseTimeChange': instance.responseTimeChange,
    };
