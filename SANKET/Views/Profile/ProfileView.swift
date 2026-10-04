import SwiftUI

struct ProfileView: View {
    @Environment(AppState.self) private var appState
    @Environment(\.dismiss) private var dismiss
    @State private var goAssessment = false

    var body: some View {
        @Bindable var appState = appState
        List {
            Section {
                VStack(alignment: .leading, spacing: 8) {
                    Text(appState.profile.name)
                        .font(.title3.weight(.semibold))
                    Text("\(appState.profile.currentOccupation) · \(appState.profile.yearsExperience) \(String(localized: "years_short")) · \(appState.profile.location)")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                }
                .padding(.vertical, 4)
            }

            Section(String(localized: "section_skills")) {
                ForEach(appState.skills.prefix(5)) { skill in
                    HStack {
                        VStack(alignment: .leading, spacing: 2) {
                            Text(skill.name)
                            Text(skill.scoreLabel)
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        }
                        Spacer()
                        SkillStatusBadge(verification: skill.verification)
                    }
                }
            }

            Section {
                HStack {
                    Label(String(localized: "profile_certs \(appState.certificationsDisplay)"), systemImage: "rosette")
                    Spacer()
                    Text(String(localized: "profile_training \(appState.profile.trainingsCompleted)"))
                        .foregroundStyle(.secondary)
                }
                VStack(alignment: .leading, spacing: 8) {
                    HStack {
                        Text(String(localized: "profile_complete"))
                        Spacer()
                        Text("\(appState.profile.profileCompleteness)%")
                            .foregroundStyle(.secondary)
                    }
                    ProgressView(value: Double(appState.profile.profileCompleteness), total: 100)
                        .tint(SANKETTheme.accent)
                }
            }

            Section {
                PrimaryButton(title: String(localized: "cta_improve_profile")) {
                    goAssessment = true
                }
                .listRowInsets(EdgeInsets(top: 8, leading: 16, bottom: 8, trailing: 16))
                .listRowBackground(Color.clear)
            }

            Section {
                NavigationLink(value: "journey") {
                    Text(String(localized: "journey_title"))
                }
                .accessibilityLabel(String(localized: "journey_title"))
            }

            Section(String(localized: "section_privacy")) {
                Toggle(String(localized: "privacy_share_employers"), isOn: $appState.shareProfileWithEmployers)
                Toggle(String(localized: "privacy_training_recs"), isOn: $appState.useProfileForTrainingRecs)
                Text(String(localized: "privacy_note"))
                    .font(.footnote)
                    .foregroundStyle(.secondary)
            }

            Section(String(localized: "section_language")) {
                Picker(String(localized: "section_language"), selection: $appState.language) {
                    ForEach(AppLanguage.allCases) { lang in
                        Text(lang.displayName).tag(lang)
                    }
                }
                .pickerStyle(.segmented)
            }

            Section {
                Text(String(localized: "sample_data_label"))
                    .font(.caption)
                    .foregroundStyle(.secondary)
                    .frame(maxWidth: .infinity, alignment: .center)
                    .listRowBackground(Color.clear)
            }
        }
        .navigationTitle(String(localized: "profile_title"))
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .cancellationAction) {
                Button(String(localized: "cta_close")) { dismiss() }
            }
        }
        .navigationDestination(isPresented: $goAssessment) {
            SkillAssessmentFlowView()
        }
        .navigationDestination(for: String.self) { value in
            if value == "journey" {
                WorkforceJourneyView()
            }
        }
    }
}
