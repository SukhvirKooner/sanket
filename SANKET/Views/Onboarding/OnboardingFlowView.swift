import SwiftUI

struct OnboardingFlowView: View {
    @Environment(AppState.self) private var appState
    @State private var step = 0
    @State private var name = "Rahul Sharma"
    @State private var location = MockData.locations[0]
    @State private var ageBand = MockData.ageBands[1]
    @State private var education = MockData.educationOptions[3]
    @State private var occupation = MockData.occupations[0]
    @State private var experience = 7
    @State private var selectedLanguages: Set<String> = ["Hindi", "English"]

    private let totalSteps = 7

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                ProgressView(value: Double(step + 1), total: Double(totalSteps))
                    .tint(SANKETTheme.accent)
                    .padding(.horizontal)
                    .padding(.top, 8)

                ScrollView {
                    VStack(alignment: .leading, spacing: 20) {
                        if step == 0 {
                            Text(String(localized: "onboarding_header"))
                                .font(.title2.weight(.semibold))
                                .fixedSize(horizontal: false, vertical: true)
                        }

                        Text(stepTitle)
                            .font(.title3.weight(.semibold))

                        stepContent
                    }
                    .padding()
                }

                PrimaryButton(title: step == totalSteps - 1 ? String(localized: "cta_create_profile") : String(localized: "cta_continue")) {
                    advance()
                }
                .padding()
            }
            .background(Color(.systemGroupedBackground))
            .navigationTitle(String(localized: "app_name"))
            .navigationBarTitleDisplayMode(.inline)
        }
    }

    private var stepTitle: String {
        switch step {
        case 0: return String(localized: "onboard_q_name")
        case 1: return String(localized: "onboard_q_location")
        case 2: return String(localized: "onboard_q_age")
        case 3: return String(localized: "onboard_q_education")
        case 4: return String(localized: "onboard_q_occupation")
        case 5: return String(localized: "onboard_q_experience")
        default: return String(localized: "onboard_q_languages")
        }
    }

    @ViewBuilder
    private var stepContent: some View {
        switch step {
        case 0:
            TextField(String(localized: "onboard_name_placeholder"), text: $name)
                .textFieldStyle(.roundedBorder)
                .textInputAutocapitalization(.words)
        case 1:
            chipPicker(options: MockData.locations, selection: $location)
        case 2:
            chipPicker(options: MockData.ageBands, selection: $ageBand)
        case 3:
            chipPicker(options: MockData.educationOptions, selection: $education)
        case 4:
            chipPicker(options: MockData.occupations, selection: $occupation)
        case 5:
            Picker(String(localized: "onboard_q_experience"), selection: $experience) {
                ForEach(MockData.experienceBands, id: \.self) { years in
                    Text(L10n.format("years_count %lld", years)).tag(years)
                }
            }
            .pickerStyle(.wheel)
            .frame(height: 140)
        default:
            VStack(alignment: .leading, spacing: 10) {
                ForEach(MockData.languageOptions, id: \.self) { lang in
                    Button {
                        if selectedLanguages.contains(lang) {
                            if selectedLanguages.count > 1 {
                                selectedLanguages.remove(lang)
                            }
                        } else {
                            selectedLanguages.insert(lang)
                        }
                    } label: {
                        HStack {
                            Text(lang)
                                .foregroundStyle(.primary)
                            Spacer()
                            Image(systemName: selectedLanguages.contains(lang) ? "checkmark.circle.fill" : "circle")
                                .foregroundStyle(selectedLanguages.contains(lang) ? SANKETTheme.accent : .secondary)
                        }
                        .padding()
                        .background(Color(.secondarySystemGroupedBackground), in: RoundedRectangle(cornerRadius: 10, style: .continuous))
                    }
                    .buttonStyle(.plain)
                }
            }
        }
    }

    private func chipPicker(options: [String], selection: Binding<String>) -> some View {
        FlowChips(options: options, selection: selection)
    }

    private func advance() {
        if step < totalSteps - 1 {
            withAnimation { step += 1 }
        } else {
            let draft = WorkerProfile(
                name: name.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty ? "Rahul Sharma" : name.trimmingCharacters(in: .whitespacesAndNewlines),
                location: location,
                ageBand: ageBand,
                education: education,
                currentOccupation: occupation,
                yearsExperience: experience,
                languages: Array(selectedLanguages).sorted(),
                certificationsCount: 2,
                trainingsCompleted: 3,
                profileCompleteness: 78
            )
            appState.completeOnboarding(with: draft)
        }
    }
}

struct FlowChips: View {
    let options: [String]
    @Binding var selection: String

    var body: some View {
        LazyVGrid(columns: [GridItem(.adaptive(minimum: 140), spacing: 10)], spacing: 10) {
            ForEach(options, id: \.self) { option in
                Button {
                    selection = option
                } label: {
                    Text(option)
                        .font(.subheadline)
                        .multilineTextAlignment(.center)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 12)
                        .padding(.horizontal, 8)
                        .background(
                            selection == option ? SANKETTheme.accent.opacity(0.15) : Color(.secondarySystemGroupedBackground),
                            in: RoundedRectangle(cornerRadius: 10, style: .continuous)
                        )
                        .overlay(
                            RoundedRectangle(cornerRadius: 10, style: .continuous)
                                .stroke(selection == option ? SANKETTheme.accent : .clear, lineWidth: 1.5)
                        )
                        .foregroundStyle(.primary)
                }
                .buttonStyle(.plain)
            }
        }
    }
}
