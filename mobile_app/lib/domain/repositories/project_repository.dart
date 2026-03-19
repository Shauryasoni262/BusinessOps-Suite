import '../../data/models/project_model.dart';

abstract class ProjectRepository {
  Future<List<ProjectModel>> getProjects();
  Future<ProjectModel> getProjectById(String id);
  Future<ProjectModel> createProject(Map<String, dynamic> data);
  Future<ProjectModel> updateProject(String id, Map<String, dynamic> data);
  Future<void> deleteProject(String id);
}
