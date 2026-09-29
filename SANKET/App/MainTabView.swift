import SwiftUI

struct MainTabView: View {
    @Environment(AppState.self) private var appState
    @State private var selectedTab: Tab = .home

    enum Tab: Hashable {
        case home, opportunities, skills, training, jobs
    }

    var body: some View {
        TabView(selection: $selectedTab) {
            NavigationStack {
                HomeView(selectedTab: $selectedTab)
            }
            .tabItem {
                Label(String(localized: "tab_home"), systemImage: "house.fill")
            }
            .tag(Tab.home)

            NavigationStack {
                OpportunitiesView()
            }
            .tabItem {
                Label(String(localized: "tab_opportunities"), systemImage: "magnifyingglass")
            }
            .tag(Tab.opportunities)

            NavigationStack {
                MySkillsHubView()
            }
            .tabItem {
                Label(String(localized: "tab_skills"), systemImage: "chart.bar.fill")
            }
            .tag(Tab.skills)

            NavigationStack {
                TrainingHubView()
            }
            .tabItem {
                Label(String(localized: "tab_training"), systemImage: "book.fill")
            }
            .tag(Tab.training)

            NavigationStack {
                JobsHubView()
            }
            .tabItem {
                Label(String(localized: "tab_jobs"), systemImage: "briefcase.fill")
            }
            .tag(Tab.jobs)
        }
        .onChange(of: appState.pendingHomeDestination) { _, dest in
            guard let dest else { return }
            switch dest {
            case .opportunity, .transition:
                selectedTab = .opportunities
            case .trainingJourney, .trainingRecs, .centres, .skillProgress:
                selectedTab = .training
            case .application:
                selectedTab = .jobs
            case .assessment:
                selectedTab = .skills
            case .outcome:
                selectedTab = .home
            }
            // Leave pending set so the destination tab can consume and push.
            if dest == .opportunity || dest == .outcome {
                appState.pendingHomeDestination = nil
            }
        }
    }
}
