import SwiftUI

struct JobMatchesView: View {
    @Environment(AppState.self) private var appState
    @State private var selectedJob: JobMatch?
    @State private var confirmApply = false

    var body: some View {
        List {
            ForEach(MockData.jobMatches) { job in
                Section {
                    JobMatchCard(job: job) {
                        selectedJob = job
                        confirmApply = true
                    }
                }
            }
        }
        .listStyle(.insetGrouped)
        .confirmationDialog(String(localized: "apply_confirm_title"), isPresented: $confirmApply, titleVisibility: .visible) {
            Button(String(localized: "cta_confirm_apply")) {
                if let selectedJob {
                    appState.applyToJob(selectedJob)
                }
            }
            Button(String(localized: "cta_cancel"), role: .cancel) {}
        } message: {
            if let selectedJob {
                Text(String(localized: "apply_confirm_body \(selectedJob.company)"))
            }
        }
    }
}

struct JobMatchCard: View {
    @Environment(AppState.self) private var appState
    let job: JobMatch
    let onApply: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(alignment: .top) {
                VStack(alignment: .leading, spacing: 4) {
                    Text(job.title).font(.headline)
                    Text(job.company).font(.subheadline).foregroundStyle(.secondary)
                }
                Spacer()
                FitPercentView(percent: job.fitPercent(for: appState.journeyStage))
            }

            Text("\(job.distanceKm) km · \(job.salaryRange)")
                .font(.subheadline)
                .foregroundStyle(.secondary)

            VStack(alignment: .leading, spacing: 6) {
                Text(String(localized: "required_skills"))
                    .font(.subheadline.weight(.semibold))
                let owned = job.skillsOwned(for: appState.journeyStage)
                ForEach(job.requiredSkills, id: \.self) { skill in
                    Label(skill, systemImage: owned.contains(skill) ? "checkmark.circle.fill" : "circle")
                        .foregroundStyle(owned.contains(skill) ? SANKETTheme.accent : .secondary)
                        .font(.footnote)
                }
            }

            VStack(alignment: .leading, spacing: 6) {
                Text(String(localized: "why_matched"))
                    .font(.subheadline.weight(.semibold))
                ForEach(whyMatchedLines, id: \.self) { line in
                    Label(line, systemImage: "checkmark")
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                }
            }

            Text(String(localized: "why_apply_now \(job.whyApplyNow)"))
                .font(.footnote)
                .foregroundStyle(.secondary)

            Button(String(localized: "cta_apply"), action: onApply)
                .buttonStyle(.borderedProminent)
                .tint(SANKETTheme.accent)
                .disabled(appState.applications.contains(where: { $0.jobId == job.id }))
        }
        .padding(.vertical, 4)
    }

    private var whyMatchedLines: [String] {
        if appState.journeyStage.isCertifiedOrLater {
            return job.whyMatched
        }
        return job.whyMatched.filter { !$0.localizedCaseInsensitiveContains("certification") && !$0.localizedCaseInsensitiveContains("BMS") }
    }
}
