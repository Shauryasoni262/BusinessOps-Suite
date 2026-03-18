import '../../core/network/api_client.dart';
import '../models/project_model.dart';

class ProjectRemoteDataSource {
  final ApiClient _apiClient;

  ProjectRemoteDataSource(this._apiClient);

  Future<List<ProjectModel>> getProjects() async {
    final response = await _apiClient.dio.get('/projects');
    
    if (response.data['success'] == true) {
      final List<dynamic> projectList = response.data['data'];
      return projectList.map((json) => ProjectModel.fromJson(json)).toList();
    } else {
      throw Exception(response.data['message'] ?? 'Failed to fetch projects');
    }
  }

  Future<ProjectModel> getProjectById(String id) async {
    final response = await _apiClient.dio.get('/projects/$id');
    
    if (response.data['success'] == true) {
      return ProjectModel.fromJson(response.data['data']);
    } else {
      throw Exception(response.data['message'] ?? 'Failed to fetch project');
    }
  }
}
