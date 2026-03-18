abstract class OfferRepository {
  Future<String> generateOffer({
    required String candidateName,
    required String role,
    required String salary,
    required String joiningDate,
  });
  
  Future<List<Map<String, dynamic>>> getOfferHistory();
}
