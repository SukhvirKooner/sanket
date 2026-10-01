import SwiftUI

struct MySkillsHubView: View {
    @Environment(AppState.self) private var appState
    @State private var pushAssessment = false

    var body: some View {
        List {
            Section {
                NavigationLink {
                    SkillMapView()
                } label: {
                    Label(String(localized: "skill_map_title"), systemImage: "chart.bar.fill")
                }
                NavigationLink {
                    SkillAssessmentFlowView()
                } label: {
                    Label(String(localized: "assessment_title"), systemImage: "checklist")
                }
            }

            Section(String(localized: "section_your_skills")) {
                ForEach(appState.skills) { skill in
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
                Text(String(localized: "estimated_explainer"))
                    .font(.footnote)
                    .foregroundStyle(.secondary)
            }
        }
        .navigationTitle(String(localized: "tab_skills"))
        .navigationDestination(isPresented: $pushAssessment) {
            SkillAssessmentFlowView()
        }
        .onAppear {
            if appState.pendingHomeDestination == .assessment {
                appState.pendingHomeDestination = nil
                pushAssessment = true
            }
        }
        .onChange(of: appState.pendingHomeDestination) { _, dest in
            if dest == .assessment {
                appState.pendingHomeDestination = nil
                pushAssessment = true
            }
        }
    }
}
