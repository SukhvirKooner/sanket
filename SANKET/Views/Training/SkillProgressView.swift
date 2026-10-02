import SwiftUI
import Charts

struct SkillProgressView: View {
    @Environment(AppState.self) private var appState
    @State private var animateAfter = false
    @State private var completed = false

    var body: some View {
        List {
            Section {
                Text(String(localized: "skill_progress_intro"))
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }

            ForEach(MockData.skillProgressPairs) { pair in
                Section(pair.skillName) {
                    VStack(alignment: .leading, spacing: 12) {
                        HStack {
                            Text(String(localized: "before_label"))
                                .foregroundStyle(.secondary)
                            Spacer()
                            Text(pair.beforeLabel)
                                .font(.subheadline)
                            SkillStatusBadge(verification: .estimated)
                        }
                        HStack {
                            Text(String(localized: "after_label"))
                                .foregroundStyle(.secondary)
                            Spacer()
                            Text(pair.afterLabel)
                                .font(.subheadline)
                            SkillStatusBadge(verification: .verified)
                        }

                        Chart {
                            BarMark(
                                x: .value("Score", animateAfter ? pair.afterScore : pair.beforeScore),
                                y: .value("State", " ")
                            )
                            .foregroundStyle(animateAfter ? SANKETTheme.verified : SANKETTheme.estimated)
                        }
                        .chartXScale(domain: 0...10)
                        .chartYAxis(.hidden)
                        .frame(height: 36)
                        .animation(.easeInOut(duration: 0.8), value: animateAfter)
                    }
                    .padding(.vertical, 4)
                }
            }

            if completed || appState.journeyStage.isCertifiedOrLater {
                Section {
                    Text(String(localized: "cert_completed_message"))
                        .font(.body)
                }
            }

            if !appState.journeyStage.isCertifiedOrLater {
                Section {
                    PrimaryButton(title: String(localized: "cta_complete_certification")) {
                        withAnimation {
                            animateAfter = true
                        }
                        DispatchQueue.main.asyncAfter(deadline: .now() + 0.85) {
                            appState.completeCertification()
                            completed = true
                        }
                    }
                    .listRowInsets(EdgeInsets(top: 8, leading: 16, bottom: 8, trailing: 16))
                    .listRowBackground(Color.clear)
                }
            } else {
                Section {
                    PrimaryButton(title: String(localized: "cta_view_jobs")) {
                        appState.pendingHomeDestination = .application
                    }
                    .listRowInsets(EdgeInsets(top: 8, leading: 16, bottom: 8, trailing: 16))
                    .listRowBackground(Color.clear)
                }
            }
        }
        .navigationTitle(String(localized: "skill_progress_title"))
        .navigationBarTitleDisplayMode(.inline)
        .onAppear {
            if appState.journeyStage.isCertifiedOrLater {
                animateAfter = true
                completed = true
            } else {
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.35) {
                    animateAfter = true
                }
            }
        }
    }
}
