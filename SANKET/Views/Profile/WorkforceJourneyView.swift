import SwiftUI

struct WorkforceJourneyView: View {
    @Environment(AppState.self) private var appState

    var body: some View {
        List {
            Section {
                Text(String(localized: "journey_intro"))
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }

            Section {
                JourneyTimelineView(items: timelineItems)
                    .padding(.vertical, 8)
            }

            if appState.journeyStage == .placed || appState.journeyStage.isCertifiedOrLater {
                Section(String(localized: "journey_future_skills")) {
                    ForEach(MockData.journeyFutureSkills, id: \.self) { skill in
                        Label(skill, systemImage: "circle")
                            .foregroundStyle(.secondary)
                    }
                }
            }
        }
        .navigationTitle(String(localized: "journey_title"))
        .navigationBarTitleDisplayMode(.inline)
    }

    private var timelineItems: [TimelineItem] {
        let stage = appState.journeyStage
        func state(for minimum: JourneyStage) -> TimelineItemState {
            let order = JourneyStage.allCases
            guard let current = order.firstIndex(of: stage),
                  let needed = order.firstIndex(of: minimum) else { return .upcoming }
            if current > needed { return .completed }
            if current == needed { return .current }
            return .upcoming
        }

        return [
            TimelineItem(id: "j1", title: "Industrial Electrician", subtitle: String(localized: "journey_started"), state: stage == .onboarding ? .upcoming : .completed),
            TimelineItem(id: "j2", title: String(localized: "journey_bridge"), subtitle: "EV Technician · 6 weeks", state: bridgeState),
            TimelineItem(id: "j3", title: "EV Technician", subtitle: String(localized: "journey_target_role"), state: state(for: .certified)),
            TimelineItem(id: "j4", title: String(localized: "journey_certification"), subtitle: nil, state: state(for: .certified) == .completed || stage == .certified ? (stage == .certified ? .current : .completed) : (stage == .trainingInProgress ? .current : .upcoming)),
            TimelineItem(id: "j5", title: String(localized: "journey_job"), subtitle: "Pragati Electric Mobility", state: jobState),
            TimelineItem(id: "j6", title: String(localized: "journey_future"), subtitle: MockData.journeyFutureSkills.joined(separator: " · "), state: stage == .placed ? .current : .upcoming)
        ]
    }

    private var bridgeState: TimelineItemState {
        switch appState.journeyStage {
        case .onboarding, .profiled, .assessed, .exploring:
            return .upcoming
        case .transitionStarted, .enrolled, .trainingInProgress:
            return .current
        default:
            return .completed
        }
    }

    private var jobState: TimelineItemState {
        switch appState.journeyStage {
        case .applied: return .current
        case .placed: return .completed
        default: return .upcoming
        }
    }
}
