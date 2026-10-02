import SwiftUI

struct CareerTransitionView: View {
    @Environment(AppState.self) private var appState
    @State private var selectedPathId = "path-a"
    @State private var goTraining = false

    private var bridge: CareerBridge { MockData.careerBridge }

    var body: some View {
        List {
            Section {
                BridgeGraphic(
                    today: bridge.todayRole,
                    target: appState.selectedOpportunity.title
                )
                .listRowInsets(EdgeInsets(top: 16, leading: 12, bottom: 16, trailing: 12))
                .listRowBackground(Color.clear)
            }

            Section(String(localized: "already_have")) {
                ForEach(bridge.alreadyHave, id: \.self) { skill in
                    Label(skill, systemImage: "checkmark.circle.fill")
                        .foregroundStyle(SANKETTheme.accent)
                }
            }

            Section(String(localized: "to_develop")) {
                ForEach(bridge.toDevelop, id: \.self) { skill in
                    Label(skill, systemImage: "circle")
                        .foregroundStyle(.secondary)
                }
            }

            Section(String(localized: "path_details")) {
                detailRow(String(localized: "detail_training"), "\(selectedPath.weeks) \(String(localized: "weeks_unit"))")
                detailRow(String(localized: "detail_centre"), "\(selectedPath.centreDistanceKm) km")
                detailRow(String(localized: "detail_cost"), "₹\(selectedPath.courseCostINR.formatted())")
                detailRow(String(localized: "detail_demand"), selectedPath.demandLabel)
                detailRow(String(localized: "detail_salary"), selectedPath.salaryRange)
            }

            Section(String(localized: "compare_paths")) {
                ForEach(bridge.paths) { path in
                    Button {
                        selectedPathId = path.id
                        appState.selectedPathId = path.id
                    } label: {
                        HStack(alignment: .top) {
                            VStack(alignment: .leading, spacing: 4) {
                                Text("\(path.label) · \(path.weeks) \(String(localized: "weeks_unit"))")
                                    .font(.body.weight(.semibold))
                                    .foregroundStyle(.primary)
                                Text(path.highlight)
                                    .font(.caption)
                                    .foregroundStyle(.secondary)
                                Text("\(path.demandLabel) · \(path.salaryRange)")
                                    .font(.caption)
                                    .foregroundStyle(.secondary)
                            }
                            Spacer()
                            Image(systemName: selectedPathId == path.id ? "checkmark.circle.fill" : "circle")
                                .foregroundStyle(selectedPathId == path.id ? SANKETTheme.accent : .secondary)
                        }
                    }
                    .buttonStyle(.plain)
                    .accessibilityLabel(path.label)
                }
            }

            Section {
                PrimaryButton(title: String(localized: "cta_start_transition")) {
                    appState.startTransition()
                    goTraining = true
                }
                .listRowInsets(EdgeInsets(top: 8, leading: 16, bottom: 8, trailing: 16))
                .listRowBackground(Color.clear)
            }
        }
        .navigationTitle(String(localized: "transition_title"))
        .navigationBarTitleDisplayMode(.inline)
        .navigationDestination(isPresented: $goTraining) {
            TrainingRecommendationView()
        }
        .onAppear {
            selectedPathId = appState.selectedPathId
        }
    }

    private var selectedPath: TransitionPath {
        bridge.paths.first { $0.id == selectedPathId } ?? bridge.paths[0]
    }

    private func detailRow(_ title: String, _ value: String) -> some View {
        HStack {
            Text(title)
            Spacer()
            Text(value)
                .foregroundStyle(.secondary)
        }
    }
}

struct BridgeGraphic: View {
    let today: String
    let target: String

    var body: some View {
        VStack(spacing: 16) {
            HStack(alignment: .center, spacing: 10) {
                rolePill(title: String(localized: "today_label"), role: today)
                VStack(spacing: 4) {
                    Image(systemName: "arrow.right")
                        .font(.title3.weight(.semibold))
                        .foregroundStyle(SANKETTheme.accent)
                    Rectangle()
                        .fill(SANKETTheme.accent)
                        .frame(height: 3)
                        .frame(maxWidth: 56)
                }
                rolePill(title: String(localized: "target_label"), role: target)
            }

            Text(String(localized: "bridge_caption"))
                .font(.footnote)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)
                .frame(maxWidth: .infinity)
        }
        .padding()
        .background(Color(.secondarySystemGroupedBackground), in: RoundedRectangle(cornerRadius: 14, style: .continuous))
    }

    private func rolePill(title: String, role: String) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(title)
                .font(.caption)
                .foregroundStyle(.secondary)
            Text(role)
                .font(.subheadline.weight(.semibold))
                .fixedSize(horizontal: false, vertical: true)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(12)
        .background(Color(.systemBackground), in: RoundedRectangle(cornerRadius: 12, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: 12, style: .continuous)
                .stroke(SANKETTheme.accent.opacity(0.35), lineWidth: 1)
        )
    }
}
