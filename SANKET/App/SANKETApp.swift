import SwiftUI

@main
struct SANKETApp: App {
    @State private var appState = AppState()

    var body: some Scene {
        WindowGroup {
            RootView()
                .environment(appState)
                .environment(\.locale, appState.language.locale)
                .environment(\.appLanguage, appState.language)
                .tint(SANKETTheme.accent)
                .onAppear {
                    appState.applyLaunchJourneyStageIfNeeded()
                }
                .onOpenURL { url in
                    appState.handleJourneyURL(url)
                }
        }
    }
}

struct RootView: View {
    @Environment(AppState.self) private var appState

    var body: some View {
        Group {
            if appState.journeyStage == .onboarding {
                OnboardingFlowView()
            } else {
                MainTabView()
            }
        }
        .id(appState.language.rawValue)
    }
}
