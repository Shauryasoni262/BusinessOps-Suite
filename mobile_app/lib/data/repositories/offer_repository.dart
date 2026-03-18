import '../../core/network/api_client.dart';
import '../../domain/repositories/offer_repository.dart';

class OfferRepositoryImpl implements OfferRepository {
  final ApiClient _apiClient;

  OfferRepositoryImpl(this._apiClient);

  @override
  Future<String> generateOffer({
    required String candidateName,
    required String role,
    required String salary,
    required String joiningDate,
  }) async {
    final response = await _apiClient.dio.post('/offers/generate', data: {
      'candidateName': candidateName,
      'role': role,
      'salary': salary,
      'joiningDate': joiningDate,
    });
    
    // Assume it returns a URL to the generated PDF
    return response.data['pdfUrl'];
  }

  @override
  Future<List<Map<String, dynamic>>> getOfferHistory() async {
    final response = await _apiClient.dio.get('/offers/history');
    return List<Map<String, dynamic>>.from(response.data);
  }
}
