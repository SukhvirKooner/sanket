import SwiftUI

struct SkillAssessmentFlowView: View {
    @Environment(AppState.self) private var appState
    @Environment(\.dismiss) private var dismiss

    @State private var index = 0
    @State private var results: [AssessmentResult] = []
    @State private var showingResult = false
    @State private var currentResult: AssessmentResult?
    @State private var finished = false

    private var questions: [AssessmentQuestion] { MockData.assessmentQuestions }

    var body: some View {
        VStack(spacing: 0) {
            if finished {
                completionView
            } else if showingResult, let currentResult {
                resultView(currentResult)
            } else {
                questionView
            }
        }
        .background(Color(.systemGroupedBackground))
        .navigationTitle(String(localized: "assessment_title"))
        .navigationBarTitleDisplayMode(.inline)
    }

    private var questionView: some View {
        VStack(spacing: 0) {
            ProgressView(value: Double(index + 1), total: Double(questions.count))
                .tint(SANKETTheme.accent)
                .padding()

            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    Text(String(localized: String.LocalizationValue(questions[index].promptKey)))
                        .font(.title3.weight(.semibold))
                        .fixedSize(horizontal: false, vertical: true)

                    ForEach(questions[index].options) { option in
                        Button {
                            select(option)
                        } label: {
                            Text(String(localized: String.LocalizationValue(option.titleKey)))
                                .font(.body.weight(.medium))
                                .frame(maxWidth: .infinity)
                                .padding()
                                .background(Color(.secondarySystemGroupedBackground), in: RoundedRectangle(cornerRadius: 12, style: .continuous))
                                .foregroundStyle(.primary)
                        }
                        .buttonStyle(.plain)
                    }
                }
                .padding()
            }
        }
    }

    private func resultView(_ result: AssessmentResult) -> some View {
        VStack(spacing: 0) {
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    SkillStatusBadge(verification: .estimated)
                    Text(result.skillName)
                        .font(.title2.weight(.semibold))
                    Text(L10n.format("assess_result_range %@", result.range))
                        .font(.body)
                    Text(L10n.format("assess_result_confidence %@", String(localized: String.LocalizationValue(result.confidenceKey))))
                        .foregroundStyle(.secondary)
                    Text(String(localized: "assess_result_based"))
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                    Text(String(localized: "estimated_explainer"))
                        .font(.footnote)
                        .foregroundStyle(SANKETTheme.estimated)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding()
            }
            PrimaryButton(title: String(localized: "cta_continue")) {
                showingResult = false
                currentResult = nil
                if index + 1 < questions.count {
                    index += 1
                } else {
                    finished = true
                    appState.completeAssessment(results: results)
                }
            }
            .padding()
        }
    }

    private var completionView: some View {
        VStack(spacing: 0) {
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    Image(systemName: "checkmark.circle.fill")
                        .font(.largeTitle)
                        .foregroundStyle(SANKETTheme.accent)
                    Text(String(localized: "assess_done_title"))
                        .font(.title2.weight(.semibold))
                    Text(String(localized: "assess_done_body"))
                        .foregroundStyle(.secondary)
                    ForEach(results) { result in
                        HStack {
                            VStack(alignment: .leading) {
                                Text(result.skillName)
                                Text(result.range)
                                    .font(.caption)
                                    .foregroundStyle(.secondary)
                            }
                            Spacer()
                            SkillStatusBadge(verification: .estimated)
                        }
                        .padding(.vertical, 4)
                    }
                }
                .padding()
            }
            PrimaryButton(title: String(localized: "cta_explore_opportunities")) {
                dismiss()
                appState.pendingHomeDestination = .opportunity
            }
            .padding()
        }
    }

    private func select(_ option: AssessmentOption) {
        let q = questions[index]
        let result = AssessmentResult(
            id: q.id,
            skillName: q.skillName,
            range: option.range,
            confidenceKey: option.confidenceKey,
            basedOnKey: "assess_result_based",
            scoreOutOfTen: option.scoreOutOfTen
        )
        results.removeAll { $0.skillName == q.skillName }
        results.append(result)
        currentResult = result
        showingResult = true
    }
}
