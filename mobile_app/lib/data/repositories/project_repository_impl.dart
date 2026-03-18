import '../data_sources/project_remote_data_source.dart';
import '../models/project_model.dart';

abstract class ProjectRepository {
  Future<List<ProjectModel>> getProjects();
  Future<ProjectModel> getProjectById(String id);
}

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
}
