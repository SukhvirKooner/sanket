import SwiftUI

struct HomeView: View {
    @Environment(AppState.self) private var appState
    @Binding var selectedTab: MainTabView.Tab
    @State private var showPresenterControls = false
    @State private var showOutcome = false

    var body: some View {
        @Bindable var appState = appState
        List {
            Section {
                Text(greeting)
                    .font(.title2.weight(.semibold))
                    .listRowBackground(Color.clear)
                    .listRowInsets(EdgeInsets(top: 8, leading: 4, bottom: 0, trailing: 4))
            }

            Section {
                NextActionCard(
                    action: appState.nextAction,
                    onCTA: { handle(destination: appState.nextAction.destination) }
                )
            }

            Section {
                LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                    StatCell(title: String(localized: "stat_training_active"), value: appState.trainingActiveLabel)
                    StatCell(title: String(localized: "stat_jobs_matched"), value: "\(appState.jobsMatchedCount)")
                    StatCell(title: String(localized: "stat_skill_progress"), value: "\(appState.skillProgressPercent)%")
                    StatCell(title: String(localized: "stat_certifications"), value: "\(appState.certificationsDisplay)")
                }
                .listRowInsets(EdgeInsets(top: 8, leading: 0, bottom: 8, trailing: 0))
                .listRowBackground(Color.clear)
            }

            Section(String(localized: "section_near_you")) {
                ForEach(appState.nearYouOpportunities) { opp in
                    Button {
                        appState.selectedOpportunityId = opp.id
                        appState.markExploring()
                        selectedTab = .opportunities
                    } label: {
                        HStack {
                            VStack(alignment: .leading, spacing: 4) {
                                Text(opp.title)
                                    .font(.body.weight(.medium))
                                    .foregroundStyle(.primary)
                                Text(String(localized: "near_you_meta \(opp.fitPercent(for: appState.journeyStage)) \(opp.distanceKm)"))
                                    .font(.caption)
                                    .foregroundStyle(.secondary)
                            }
                            Spacer()
                            Image(systemName: "chevron.right")
                                .font(.caption.weight(.semibold))
                                .foregroundStyle(.tertiary)
                        }
                    }
                }
            }
        }
        .listStyle(.insetGrouped)
        .navigationTitle(String(localized: "app_name"))
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .principal) {
                Text(String(localized: "app_name"))
                    .font(.headline)
                    .onLongPressGesture(minimumDuration: 0.6) {
                        showPresenterControls = true
                    }
            }
            ToolbarItem(placement: .topBarTrailing) {
                Button {
                    appState.showProfile = true
                } label: {
                    Image(systemName: "person.crop.circle")
                        .font(.title3)
                        .accessibilityLabel(String(localized: "profile_title"))
                }
            }
        }
        .sheet(isPresented: $appState.showProfile) {
            NavigationStack {
                ProfileView()
            }
        }
        .sheet(isPresented: $showPresenterControls) {
            PresenterControlsView()
        }
        .navigationDestination(isPresented: $showOutcome) {
            WorkforceOutcomeView()
        }
    }

    private var greeting: String {
        let hour = Calendar.current.component(.hour, from: Date())
        let name = appState.profile.name.components(separatedBy: " ").first ?? appState.profile.name
        let key: String
        if hour < 12 {
            key = "greeting_morning"
        } else if hour < 17 {
            key = "greeting_afternoon"
        } else {
            key = "greeting_evening"
        }
        return L10n.format(key, name)
    }

    private func handle(destination: AppState.HomeDestination) {
        switch destination {
        case .opportunity:
            selectedTab = .opportunities
            appState.markExploring()
        case .transition:
            selectedTab = .opportunities
            appState.selectedOpportunityId = "ev-technician"
            appState.markExploring()
            appState.pendingHomeDestination = .transition
        case .trainingJourney, .trainingRecs, .centres, .skillProgress:
            selectedTab = .training
            appState.pendingHomeDestination = destination
        case .application:
            selectedTab = .jobs
            // Certified home CTA opens Matches; applied opens Applications
            if appState.journeyStage == .certified {
                appState.pendingHomeDestination = nil
            } else {
                appState.pendingHomeDestination = .application
            }
        case .assessment:
            selectedTab = .skills
            appState.pendingHomeDestination = .assessment
        case .outcome:
            showOutcome = true
        }
    }
}

private struct NextActionCard: View {
    let action: AppState.NextAction
    let onCTA: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(String(localized: String.LocalizationValue(action.titleKey)))
                .font(.headline)
            Text(formattedSubtitle)
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .fixedSize(horizontal: false, vertical: true)
            Button(String(localized: String.LocalizationValue(action.ctaKey)), action: onCTA)
                .buttonStyle(.borderedProminent)
                .tint(SANKETTheme.accent)
        }
        .padding(.vertical, 6)
    }

    private var formattedSubtitle: String {
        if action.subtitleArgs.isEmpty {
            return String(localized: String.LocalizationValue(action.subtitleKey))
        }
        let format = String(localized: String.LocalizationValue(action.subtitleKey))
        return String(format: format, locale: .current, arguments: action.subtitleArgs)
    }
}

private struct StatCell: View {
    let title: String
    let value: String

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(value)
                .font(.title3.weight(.semibold))
                .foregroundStyle(SANKETTheme.accent)
            Text(title)
                .font(.caption)
                .foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding()
        .background(Color(.secondarySystemGroupedBackground), in: RoundedRectangle(cornerRadius: 12, style: .continuous))
    }
}
