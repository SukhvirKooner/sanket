import SwiftUI

struct TrainingRecommendationView: View {
    @Environment(AppState.self) private var appState
    @State private var showCompare = false
    @State private var goCentres = false

    var body: some View {
        List {
            Section {
                Text(String(localized: "training_reason"))
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }

            Section(String(localized: "section_courses")) {
                ForEach(MockData.courses) { course in
                    VStack(alignment: .leading, spacing: 6) {
                        Text(course.title)
                            .font(.headline)
                        Text(String(localized: "course_meta \(course.weeks) \(course.distanceKm)"))
                            .font(.subheadline)
                            .foregroundStyle(.secondary)
                        Text(String(localized: "closes_gap \(course.closesGapSkills.joined(separator: ", "))"))
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                    .padding(.vertical, 4)
                }
            }

            Section(String(localized: "based_on")) {
                basedOnRow(String(localized: "based_skills"))
                basedOnRow(String(localized: "based_target"))
                basedOnRow(String(localized: "based_gap"))
                basedOnRow(String(localized: "based_seats"))
                basedOnRow(String(localized: "based_location"))
                basedOnRow(String(localized: "based_duration"))
                basedOnRow(String(localized: "based_demand"))
            }

            Section {
                HStack(spacing: 12) {
                    SecondaryButton(title: String(localized: "cta_compare")) {
                        showCompare = true
                    }
                    PrimaryButton(title: String(localized: "cta_start_training")) {
                        goCentres = true
                    }
                }
                .listRowInsets(EdgeInsets(top: 8, leading: 16, bottom: 8, trailing: 16))
                .listRowBackground(Color.clear)
            }
        }
        .navigationTitle(String(localized: "training_recs_title"))
        .navigationBarTitleDisplayMode(.inline)
        .navigationDestination(isPresented: $goCentres) {
            TrainingCentresView()
        }
        .sheet(isPresented: $showCompare) {
            NavigationStack {
                List {
                    ForEach(MockData.courses.prefix(3)) { course in
                        VStack(alignment: .leading, spacing: 6) {
                            Text(course.title).font(.headline)
                            Text(String(localized: "course_meta \(course.weeks) \(course.distanceKm)"))
                                .foregroundStyle(.secondary)
                        }
                    }
                }
                .navigationTitle(String(localized: "cta_compare"))
                .toolbar {
                    ToolbarItem(placement: .cancellationAction) {
                        Button(String(localized: "cta_close")) { showCompare = false }
                    }
                }
            }
            .presentationDetents([.medium])
        }
    }

    private func basedOnRow(_ title: String) -> some View {
        Label(title, systemImage: "checkmark")
            .font(.subheadline)
    }
}
