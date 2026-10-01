import SwiftUI
import Charts

struct SkillMapView: View {
    @Environment(AppState.self) private var appState

    var body: some View {
        List {
            Section {
                RadarChartView(skills: Array(appState.skills.prefix(7)))
                    .listRowInsets(EdgeInsets(top: 12, leading: 8, bottom: 12, trailing: 8))
            }

            Section(String(localized: "section_scores")) {
                ForEach(appState.skills) { skill in
                    VStack(alignment: .leading, spacing: 8) {
                        HStack {
                            Text(skill.name)
                            Spacer()
                            Text(skill.scoreLabel)
                                .foregroundStyle(.secondary)
                            SkillStatusBadge(verification: skill.verification)
                        }
                        Chart {
                            BarMark(
                                x: .value("Score", skill.scoreOutOfTen),
                                y: .value("Skill", skill.name)
                            )
                            .foregroundStyle(skill.verification == .verified ? SANKETTheme.accent : SANKETTheme.estimated)
                        }
                        .chartXScale(domain: 0...10)
                        .chartYAxis(.hidden)
                        .frame(height: 28)
                        .chartLegend(.hidden)
                    }
                    .padding(.vertical, 4)
                }
            }

            Section(String(localized: "section_build_next")) {
                ForEach(MockData.buildNextSkills, id: \.self) { name in
                    Label(name, systemImage: "circle")
                }
            }

            Section {
                PrimaryButton(title: String(localized: "cta_explore_opportunities")) {
                    appState.markExploring()
                    appState.pendingHomeDestination = .opportunity
                }
                .listRowInsets(EdgeInsets(top: 8, leading: 16, bottom: 8, trailing: 16))
                .listRowBackground(Color.clear)
            }
        }
        .navigationTitle(String(localized: "skill_map_title"))
        .navigationBarTitleDisplayMode(.inline)
    }
}
