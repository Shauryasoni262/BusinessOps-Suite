import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/providers/network_providers.dart';
import '../../domain/repositories/project_repository.dart';
import '../../data/data_sources/project_remote_data_source.dart';
import '../../data/repositories/project_repository_impl.dart';
import '../../data/models/project_model.dart';

// Provides the remote data source
final projectRemoteDataSourceProvider = Provider<ProjectRemoteDataSource>((
  ref,
) {
  final apiClient = ref.watch(apiClientProvider);
  return ProjectRemoteDataSource(apiClient);
});

// Provides the repository implementation
final projectRepositoryProvider = Provider<ProjectRepository>((ref) {
  final remoteDataSource = ref.watch(projectRemoteDataSourceProvider);
  return ProjectRepositoryImpl(remoteDataSource);
});

// Provides the list of projects with CRUD capabilities
final projectsNotifierProvider =
    AsyncNotifierProvider<ProjectsNotifier, List<ProjectModel>>(() {
      return ProjectsNotifier();
    });

class ProjectsNotifier extends AsyncNotifier<List<ProjectModel>> {
  @override
  Future<List<ProjectModel>> build() async {
    final repository = ref.watch(projectRepositoryProvider);
    return repository.getProjects();
  }

  Future<void> refresh() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(
      () => ref.read(projectRepositoryProvider).getProjects(),
    );
  }

  Future<void> addProject(Map<String, dynamic> data) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      await ref.read(projectRepositoryProvider).createProject(data);
      return ref.read(projectRepositoryProvider).getProjects();
    });
  }

  Future<void> updateProject(String id, Map<String, dynamic> data) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      await ref.read(projectRepositoryProvider).updateProject(id, data);
      return ref.read(projectRepositoryProvider).getProjects();
    });
  }

  Future<void> deleteProject(String id) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      await ref.read(projectRepositoryProvider).deleteProject(id);
      return ref.read(projectRepositoryProvider).getProjects();
    });
  }
}

// Keep a simple provider for the list (backward compatibility or simple reads)
final projectsProvider = Provider<AsyncValue<List<ProjectModel>>>((ref) {
  return ref.watch(projectsNotifierProvider);
});

// Provides a single project by ID
final projectDetailProvider = FutureProvider.family<ProjectModel, String>((
  ref,
  id,
) async {
  final repository = ref.watch(projectRepositoryProvider);
  return repository.getProjectById(id);
});
