import SwiftUI

struct JobsHubView: View {
    @Environment(AppState.self) private var appState
    @State private var segment = 0

    var body: some View {
        VStack(spacing: 0) {
            Picker("", selection: $segment) {
                Text(String(localized: "jobs_matches")).tag(0)
                Text(String(localized: "jobs_applications")).tag(1)
            }
            .pickerStyle(.segmented)
            .padding()
            .accessibilityLabel("Jobs segments")

            if segment == 0 {
                JobMatchesView()
            } else {
                ApplicationsView()
            }
        }
        .background(Color(.systemGroupedBackground))
        .navigationTitle(String(localized: "tab_jobs"))
        .onAppear {
            if appState.pendingHomeDestination == .application {
                appState.pendingHomeDestination = nil
                segment = 1
            }
            if appState.journeyStage == .applied || appState.journeyStage == .placed {
                // keep current
            }
        }
        .onChange(of: appState.pendingHomeDestination) { _, dest in
            if dest == .application {
                appState.pendingHomeDestination = nil
                segment = 1
            }
        }
    }
}
