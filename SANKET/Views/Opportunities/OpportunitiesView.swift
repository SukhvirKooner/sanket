import SwiftUI

struct OpportunitiesView: View {
    @Environment(AppState.self) private var appState
    @State private var pushTransition = false

    var body: some View {
        @Bindable var appState = appState
        List {
            Section {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 8) {
                        filterChip(String(localized: "filter_all"), .all)
                        filterChip(String(localized: "filter_near_me"), .nearMe)
                        filterChip(String(localized: "filter_short_training"), .shortTraining)
                        filterChip(String(localized: "filter_high_demand"), .highDemand)
                    }
                    .padding(.vertical, 4)
                }
                .listRowInsets(EdgeInsets(top: 4, leading: 16, bottom: 4, trailing: 16))
            }

            ForEach(appState.filteredOpportunities) { opp in
                Section {
                    OpportunityCard(opportunity: opp) {
                        appState.selectedOpportunityId = opp.id
                        appState.markExploring()
                        pushTransition = true
                    }
                }
            }
        }
        .navigationTitle(String(localized: "tab_opportunities"))
        .navigationDestination(isPresented: $pushTransition) {
            CareerTransitionView()
        }
        .onAppear { consumePending() }
        .onChange(of: appState.pendingHomeDestination) { _, _ in consumePending() }
    }

    private func consumePending() {
        if appState.pendingHomeDestination == .transition || appState.pendingHomeDestination == .opportunity {
            let dest = appState.pendingHomeDestination
            appState.pendingHomeDestination = nil
            if dest == .transition {
                pushTransition = true
            }
        }
    }

    private func filterChip(_ title: String, _ filter: AppState.OpportunityFilter) -> some View {
        Button {
            appState.opportunityFilter = filter
        } label: {
            Text(title)
                .font(.subheadline.weight(.medium))
                .padding(.horizontal, 12)
                .padding(.vertical, 8)
                .background(
                    appState.opportunityFilter == filter ? SANKETTheme.accent.opacity(0.15) : Color(.secondarySystemGroupedBackground),
                    in: Capsule()
                )
                .overlay(
                    Capsule().stroke(appState.opportunityFilter == filter ? SANKETTheme.accent : .clear, lineWidth: 1)
                )
                .foregroundStyle(.primary)
        }
        .buttonStyle(.plain)
    }
}

struct OpportunityCard: View {
    @Environment(AppState.self) private var appState
    let opportunity: Opportunity
    let onViewPath: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(alignment: .top) {
                VStack(alignment: .leading, spacing: 4) {
                    Text(opportunity.title)
                        .font(.headline)
                    Text(String(localized: "demand_outlook \(opportunity.demandOutlook)"))
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
                Spacer()
                FitPercentView(percent: opportunity.fitPercent(for: appState.journeyStage))
            }

            Text(String(localized: "opportunity_meta \(opportunity.distanceKm) \(opportunity.transitionWeeks)"))
                .font(.subheadline)
                .foregroundStyle(.secondary)

            if !opportunity.skillsMissing.isEmpty {
                Text(String(localized: "skills_missing \(opportunity.skillsMissing.joined(separator: ", "))"))
                    .font(.footnote)
                    .foregroundStyle(.secondary)
            }

            VStack(alignment: .leading, spacing: 6) {
                Text(String(localized: "why_opportunity"))
                    .font(.subheadline.weight(.semibold))
                ForEach(opportunity.whyLines, id: \.self) { line in
                    Text("· \(line)")
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                }
            }

            Button(String(localized: "cta_view_path"), action: onViewPath)
                .buttonStyle(.borderedProminent)
                .tint(SANKETTheme.accent)
        }
        .padding(.vertical, 4)
    }
}
