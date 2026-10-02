import SwiftUI

struct TrainingJourneyView: View {
    @Environment(AppState.self) private var appState
    @State private var goProgress = false

    var body: some View {
        let journey = appState.trainingJourney
        List {
            Section {
                VStack(alignment: .leading, spacing: 8) {
                    Text(L10n.format("training_week_header", journey.currentWeek, journey.totalWeeks))
                        .font(.title3.weight(.semibold))
                    Text(L10n.format("training_percent", journey.percentCompleted))
                        .foregroundStyle(.secondary)
                    ProgressView(value: Double(journey.percentCompleted), total: 100)
                        .tint(SANKETTheme.accent)
                }
                .padding(.vertical, 4)
            }

            Section(String(localized: "section_modules")) {
                JourneyTimelineView(items: journey.modules.map { module in
                    TimelineItem(
                        id: module.id,
                        title: module.title,
                        subtitle: nil,
                        state: {
                            switch module.status {
                            case .completed: return .completed
                            case .current: return .current
                            case .upcoming: return .upcoming
                            }
                        }()
                    )
                })
                .padding(.vertical, 8)
            }

            Section(String(localized: "section_tracks")) {
                trackRow(String(localized: "track_attendance"), "\(journey.attendanceDone)/\(journey.attendanceTotal)")
                trackRow(String(localized: "track_assignments"), "\(journey.assignmentsDone)/\(journey.assignmentsTotal)")
                trackRow(String(localized: "track_assessments"), "\(journey.assessmentsDone)/\(journey.assessmentsTotal)")
                trackRow(
                    String(localized: "track_certification"),
                    journey.certificationPending ? String(localized: "cert_pending") : String(localized: "cert_complete")
                )
            }

            if !appState.journeyStage.isCertifiedOrLater {
                Section {
                    PrimaryButton(title: String(localized: "cta_continue_training")) {
                        if appState.journeyStage == .enrolled {
                            appState.advanceTrainingProgress()
                        } else {
                            goProgress = true
                        }
                    }
                    .listRowInsets(EdgeInsets(top: 8, leading: 16, bottom: 8, trailing: 16))
                    .listRowBackground(Color.clear)
                }
            } else {
                Section {
                    PrimaryButton(title: String(localized: "cta_view_skill_progress")) {
                        goProgress = true
                    }
                    .listRowInsets(EdgeInsets(top: 8, leading: 16, bottom: 8, trailing: 16))
                    .listRowBackground(Color.clear)
                }
            }
        }
        .navigationTitle(String(localized: "training_journey_title"))
        .navigationBarTitleDisplayMode(.inline)
        .navigationDestination(isPresented: $goProgress) {
            SkillProgressView()
        }
    }

    private func trackRow(_ title: String, _ value: String) -> some View {
        HStack {
            Text(title)
            Spacer()
            Text(value).foregroundStyle(.secondary)
        }
    }
}
