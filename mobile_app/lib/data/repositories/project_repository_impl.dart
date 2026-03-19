import '../../domain/repositories/project_repository.dart';
import '../data_sources/project_remote_data_source.dart';
import '../models/project_model.dart';

class ProjectRepositoryImpl implements ProjectRepository {
  final ProjectRemoteDataSource _remoteDataSource;

  ProjectRepositoryImpl(this._remoteDataSource);

  @override
  Future<List<ProjectModel>> getProjects() {
    return _remoteDataSource.getProjects();
  }

  @override
  Future<ProjectModel> getProjectById(String id) {
    return _remoteDataSource.getProjectById(id);
  }

  @override
  Future<ProjectModel> createProject(Map<String, dynamic> data) {
    return _remoteDataSource.createProject(data);
  }

  @override
  Future<ProjectModel> updateProject(String id, Map<String, dynamic> data) {
    return _remoteDataSource.updateProject(id, data);
  }

  @override
  Future<void> deleteProject(String id) {
    return _remoteDataSource.deleteProject(id);
  }
}
