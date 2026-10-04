import SwiftUI

struct PresenterControlsView: View {
    @Environment(AppState.self) private var appState
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            List {
                Section(String(localized: "presenter_jump_stage")) {
                    ForEach(JourneyStage.allCases) { stage in
                        Button {
                            appState.jumpToStage(stage)
                            dismiss()
                        } label: {
                            HStack {
                                Text(stage.displayName)
                                    .foregroundStyle(.primary)
                                Spacer()
                                if appState.journeyStage == stage {
                                    Image(systemName: "checkmark")
                                        .foregroundStyle(SANKETTheme.accent)
                                }
                            }
                        }
                    }
                }

                Section {
                    Button(String(localized: "presenter_advance_application")) {
                        appState.advancePrimaryApplication()
                        dismiss()
                    }
                    Button(String(localized: "presenter_advance_training")) {
                        appState.advanceTrainingProgress()
                        dismiss()
                    }
                    Button(String(localized: "presenter_reset"), role: .destructive) {
                        appState.resetJourney()
                        dismiss()
                    }
                }
            }
            .navigationTitle(String(localized: "presenter_controls_title"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button(String(localized: "cta_close")) { dismiss() }
                }
            }
        }
        .presentationDetents([.medium, .large])
    }
}
