import SwiftUI

struct ApplicationsView: View {
    @Environment(AppState.self) private var appState
    @State private var goOutcome = false

    private var apps: [JobApplication] {
        if appState.applications.isEmpty && (appState.journeyStage == .applied || appState.journeyStage == .placed) {
            return MockData.sampleApplications
        }
        return appState.applications
    }

    private let steps = [
        String(localized: "status_applied"),
        String(localized: "status_shortlisted"),
        String(localized: "status_interview"),
        String(localized: "status_selected"),
        String(localized: "status_joined")
    ]

    var body: some View {
        Group {
            if apps.isEmpty {
                ContentUnavailableView(
                    String(localized: "applications_empty_title"),
                    systemImage: "briefcase",
                    description: Text(String(localized: "applications_empty_body"))
                )
            } else {
                List {
                    ForEach(apps) { app in
                        Section {
                            VStack(alignment: .leading, spacing: 12) {
                                Text(app.title).font(.headline)
                                Text(app.company).font(.subheadline).foregroundStyle(.secondary)
                                Text("\(app.location) · \(app.salaryRange)")
                                    .font(.caption)
                                    .foregroundStyle(.secondary)
                                StatusStepper(steps: steps, currentIndex: app.status.stepIndex)
                                Text(String(localized: String.LocalizationValue(app.status.displayKey)))
                                    .font(.subheadline.weight(.semibold))
                                    .foregroundStyle(SANKETTheme.accent)

                                if app.isPrimary && app.status == .joined {
                                    Button(String(localized: "cta_view_outcome")) {
                                        goOutcome = true
                                    }
                                    .buttonStyle(.borderedProminent)
                                    .tint(SANKETTheme.accent)
                                }
                            }
                            .padding(.vertical, 4)
                        }
                    }
                }
                .listStyle(.insetGrouped)
            }
        }
        .navigationDestination(isPresented: $goOutcome) {
            WorkforceOutcomeView()
        }
        .onAppear {
            if appState.applications.isEmpty && appState.journeyStage == .applied {
                appState.applications = MockData.sampleApplications
            }
        }
    }
}
