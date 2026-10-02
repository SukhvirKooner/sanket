import SwiftUI

struct WorkforceOutcomeView: View {
    @Environment(AppState.self) private var appState
    @State private var employmentStatus = "Employed"
    @State private var role = "EV Technician"
    @State private var joiningDate = Date()
    @State private var wageBand = "₹16–19 LPA"
    @State private var stillWorking = true
    @State private var submitted = false

    var body: some View {
        List {
            Section {
                VStack(alignment: .leading, spacing: 10) {
                    Image(systemName: "checkmark.seal.fill")
                        .font(.largeTitle)
                        .foregroundStyle(SANKETTheme.accent)
                    Text(String(localized: "outcome_congrats"))
                        .font(.title2.weight(.semibold))
                    Text(String(localized: "outcome_stats"))
                        .foregroundStyle(.secondary)
                }
                .padding(.vertical, 4)
            }

            if !submitted {
                Section(String(localized: "outcome_optional_form")) {
                    Picker(String(localized: "outcome_employment"), selection: $employmentStatus) {
                        Text("Employed").tag("Employed")
                        Text("Not employed").tag("Not employed")
                    }
                    TextField(String(localized: "outcome_role"), text: $role)
                    DatePicker(String(localized: "outcome_joining"), selection: $joiningDate, displayedComponents: .date)
                    Picker(String(localized: "outcome_wage"), selection: $wageBand) {
                        Text("₹12–15 LPA").tag("₹12–15 LPA")
                        Text("₹16–19 LPA").tag("₹16–19 LPA")
                        Text("₹18–22 LPA").tag("₹18–22 LPA")
                    }
                    Toggle(String(localized: "outcome_still_working"), isOn: $stillWorking)
                    Text(String(localized: "outcome_consent_note"))
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                }

                Section {
                    PrimaryButton(title: String(localized: "cta_submit_outcome")) {
                        submitted = true
                        appState.hasSeenOutcomeForm = true
                        appState.markPlaced()
                    }
                    .listRowInsets(EdgeInsets(top: 8, leading: 16, bottom: 4, trailing: 16))
                    .listRowBackground(Color.clear)

                    Button(String(localized: "cta_skip")) {
                        submitted = true
                        appState.hasSeenOutcomeForm = true
                        appState.markPlaced()
                    }
                    .frame(maxWidth: .infinity)
                    .foregroundStyle(.secondary)
                    .listRowBackground(Color.clear)
                }
            } else {
                Section {
                    Text(String(localized: "outcome_thanks"))
                        .foregroundStyle(.secondary)
                }
            }
        }
        .navigationTitle(String(localized: "outcome_title"))
        .navigationBarTitleDisplayMode(.inline)
        .onAppear {
            if appState.journeyStage != .placed {
                appState.markPlaced()
            }
        }
    }
}
