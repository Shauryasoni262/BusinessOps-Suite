import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_theme.dart';
import '../providers/offer_providers.dart';

class OfferLetterScreen extends ConsumerStatefulWidget {
  const OfferLetterScreen({super.key});

  @override
  ConsumerState<OfferLetterScreen> createState() => _OfferLetterScreenState();
}

class _OfferLetterScreenState extends ConsumerState<OfferLetterScreen> {
  final _formKey = GlobalKey<FormState>();
  
  // Form Controllers
  final _candidateNameController = TextEditingController();
  final _roleController = TextEditingController();
  final _salaryController = TextEditingController();
  final _joiningDateController = TextEditingController();

  @override
  void dispose() {
    _candidateNameController.dispose();
    _roleController.dispose();
    _salaryController.dispose();
    _joiningDateController.dispose();
    super.dispose();
  }

  Future<void> _generateOffer() async {
    if (_formKey.currentState!.validate()) {
      await ref.read(offerNotifierProvider.notifier).generateOffer(
        candidateName: _candidateNameController.text,
        role: _roleController.text,
        salary: _salaryController.text,
        joiningDate: _joiningDateController.text,
      );

      final state = ref.read(offerNotifierProvider);
      if (state.hasError) {
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error: ${state.error}'),
            backgroundColor: Colors.redAccent,
          ),
        );
      } else if (state.hasValue && state.value != null) {
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Offer generated successfully!'),
            backgroundColor: Colors.green,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final offerState = ref.watch(offerNotifierProvider);

    return Scaffold(
      backgroundColor: isDark ? const Color(0xFF0F172A) : AppColors.background,
      appBar: AppBar(
        title: Text('Offer Generator', style: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
        actions: [
          IconButton(
            icon: const Icon(Icons.history_rounded),
            onPressed: () {},
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'New Offer Intent',
                style: GoogleFonts.outfit(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: isDark ? Colors.white : AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Generate professional offer letters in seconds using our automated engine.',
                style: TextStyle(color: AppColors.textMuted, fontSize: 14),
              ),
              const SizedBox(height: 32),

              _buildFieldGroup(
                title: 'Candidate Information',
                children: [
                  _CustomTextField(
                    controller: _candidateNameController,
                    label: 'Full Name',
                    icon: Icons.person_outline_rounded,
                    hint: 'e.g. Rahul Sharma',
                  ),
                  const SizedBox(height: 16),
                  _CustomTextField(
                    controller: _roleController,
                    label: 'Job Title / Role',
                    icon: Icons.work_outline_rounded,
                    hint: 'e.g. Senior Software Engineer',
                  ),
                ],
              ),

              const SizedBox(height: 24),

              _buildFieldGroup(
                title: 'Compensation & Timeline',
                children: [
                  _CustomTextField(
                    controller: _salaryController,
                    label: 'Annual CTC (INR)',
                    icon: Icons.currency_rupee_rounded,
                    hint: 'e.g. 18,00,000',
                    keyboardType: TextInputType.number,
                  ),
                  const SizedBox(height: 16),
                  _CustomTextField(
                    controller: _joiningDateController,
                    label: 'Joining Date',
                    icon: Icons.calendar_today_rounded,
                    hint: 'DD/MM/YYYY',
                    onTap: () async {
                      final date = await showDatePicker(
                        context: context,
                        initialDate: DateTime.now(),
                        firstDate: DateTime.now(),
                        lastDate: DateTime.now().add(const Duration(days: 365)),
                      );
                      if (date != null) {
                        _joiningDateController.text = "${date.day}/${date.month}/${date.year}";
                      }
                    },
                    readOnly: true,
                  ),
                ],
              ),

              const SizedBox(height: 40),

              SizedBox(
                width: double.infinity,
                height: 56,
                child: ElevatedButton(
                  onPressed: offerState.isLoading ? null : _generateOffer,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    elevation: 0,
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      offerState.isLoading 
                        ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                        : const Icon(Icons.auto_fix_high_rounded),
                      const SizedBox(width: 12),
                      Text(
                        offerState.isLoading ? 'Generating...' : 'Generate & Send Offer',
                        style: GoogleFonts.inter(fontWeight: FontWeight.bold, fontSize: 16),
                      ),
                    ],
                  ),
                ),
              ),
              
              const SizedBox(height: 100), // Spacing for navbar
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFieldGroup({required String title, required List<Widget> children}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: GoogleFonts.inter(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            color: AppColors.primary,
          ),
        ),
        const SizedBox(height: 16),
        ...children,
      ],
    );
  }
}

class _CustomTextField extends StatelessWidget {
  final TextEditingController controller;
  final String label;
  final IconData icon;
  final String hint;
  final TextInputType? keyboardType;
  final VoidCallback? onTap;
  final bool readOnly;

  const _CustomTextField({
    required this.controller,
    required this.label,
    required this.icon,
    required this.hint,
    this.keyboardType,
    this.onTap,
    this.readOnly = false,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E293B) : Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border.withValues(alpha: 0.5)),
      ),
      child: TextFormField(
        controller: controller,
        readOnly: readOnly,
        onTap: onTap,
        keyboardType: keyboardType,
        style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w500),
        decoration: InputDecoration(
          labelText: label,
          hintText: hint,
          prefixIcon: Icon(icon, color: AppColors.primary, size: 20),
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          floatingLabelStyle: const TextStyle(color: AppColors.primary),
        ),
        validator: (value) => value == null || value.isEmpty ? 'Required' : null,
      ),
    );
  }
}
