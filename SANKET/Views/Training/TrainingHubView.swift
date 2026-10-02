import SwiftUI

struct TrainingHubView: View {
    @Environment(AppState.self) private var appState
    @State private var pushRecs = false
    @State private var pushJourney = false
    @State private var pushCentres = false
    @State private var pushProgress = false

    var body: some View {
        List {
            if appState.journeyStage.isTrainingActive {
                Section(String(localized: "section_my_training")) {
                    NavigationLink {
                        TrainingJourneyView()
                    } label: {
                        VStack(alignment: .leading, spacing: 4) {
                            Text(L10n.format("training_week_header", appState.trainingJourney.currentWeek, appState.trainingJourney.totalWeeks))
                                .font(.headline)
                            Text(L10n.format("training_percent", appState.trainingJourney.percentCompleted))
                                .font(.subheadline)
                                .foregroundStyle(.secondary)
                        }
                    }
                    if appState.journeyStage == .trainingInProgress || appState.journeyStage.isCertifiedOrLater {
                        NavigationLink {
                            SkillProgressView()
                        } label: {
                            Label(String(localized: "skill_progress_title"), systemImage: "chart.line.uptrend.xyaxis")
                        }
                    }
                }
            }

            Section(String(localized: "section_recommendations")) {
                NavigationLink {
                    TrainingRecommendationView()
                } label: {
                    Label(String(localized: "training_recs_title"), systemImage: "list.bullet.rectangle")
                }
                NavigationLink {
                    TrainingCentresView()
                } label: {
                    Label(String(localized: "centres_title"), systemImage: "mappin.and.ellipse")
                }
            }

            Section {
                Text(String(localized: "training_reason"))
                    .font(.footnote)
                    .foregroundStyle(.secondary)
            }
        }
        .navigationTitle(String(localized: "tab_training"))
        .navigationDestination(isPresented: $pushRecs) { TrainingRecommendationView() }
        .navigationDestination(isPresented: $pushJourney) { TrainingJourneyView() }
        .navigationDestination(isPresented: $pushCentres) { TrainingCentresView() }
        .navigationDestination(isPresented: $pushProgress) { SkillProgressView() }
        .onAppear { consumePending() }
        .onChange(of: appState.pendingHomeDestination) { _, _ in consumePending() }
    }

    private func consumePending() {
        guard let dest = appState.pendingHomeDestination else { return }
        switch dest {
        case .trainingRecs:
            appState.pendingHomeDestination = nil
            pushRecs = true
        case .trainingJourney:
            appState.pendingHomeDestination = nil
            pushJourney = true
        case .centres:
            appState.pendingHomeDestination = nil
            pushCentres = true
        case .skillProgress:
            appState.pendingHomeDestination = nil
            pushProgress = true
        default:
            break
        }
    }
}
