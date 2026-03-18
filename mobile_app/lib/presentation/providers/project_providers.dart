import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/providers/network_providers.dart';
import '../../data/data_sources/project_remote_data_source.dart';
import '../../data/repositories/project_repository_impl.dart';
import '../../data/models/project_model.dart';

// Provides the remote data source
final projectRemoteDataSourceProvider = Provider<ProjectRemoteDataSource>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return ProjectRemoteDataSource(apiClient);
});

// Provides the repository implementation
final projectRepositoryProvider = Provider<ProjectRepository>((ref) {
  final remoteDataSource = ref.watch(projectRemoteDataSourceProvider);
  return ProjectRepositoryImpl(remoteDataSource);
});

// Provides the list of projects
final projectsProvider = FutureProvider<List<ProjectModel>>((ref) async {
  final repository = ref.watch(projectRepositoryProvider);
  return repository.getProjects();
});

// Provides a single project by ID
final projectDetailProvider = FutureProvider.family<ProjectModel, String>((ref, id) async {
  final repository = ref.watch(projectRepositoryProvider);
  return repository.getProjectById(id);
});
