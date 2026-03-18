import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/repositories/offer_repository.dart';
import '../../data/repositories/offer_repository.dart';
import '../../core/providers/network_providers.dart';

part 'offer_providers.g.dart';

@riverpod
OfferRepository offerRepository(Ref ref) {
  final apiClient = ref.watch(apiClientProvider);
  return OfferRepositoryImpl(apiClient);
}

@riverpod
class OfferNotifier extends _$OfferNotifier {
  @override
  AsyncValue<String?> build() => const AsyncValue.data(null);

  Future<void> generateOffer({
    required String candidateName,
    required String role,
    required String salary,
    required String joiningDate,
  }) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() => ref.read(offerRepositoryProvider).generateOffer(
      candidateName: candidateName,
      role: role,
      salary: salary,
      joiningDate: joiningDate,
    ));
  }
}
