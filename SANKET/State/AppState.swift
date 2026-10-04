import Foundation
import SwiftUI

enum AppLanguage: String, CaseIterable, Identifiable {
    case english = "en"
    case hindi = "hi"

    var id: String { rawValue }

    var displayName: String {
        switch self {
        case .english: return "English"
        case .hindi: return "हिंदी"
        }
    }

    var locale: Locale { Locale(identifier: rawValue) }
}

@Observable
final class AppState {
    var journeyStage: JourneyStage = .onboarding
    var profile: WorkerProfile = .empty
    var skills: [Skill] = MockData.baseSkills
    var language: AppLanguage = .english
    var shareProfileWithEmployers = true
    var useProfileForTrainingRecs = true

    var selectedOpportunityId: String = "ev-technician"
    var selectedPathId: String = "path-a"
    var selectedCentreId: String = "okhla"
    var enrolledCourseId: String?
    var trainingJourney: TrainingJourney = .week1

    var applications: [JobApplication] = []
    var hasSeenOutcomeForm = false
    var assessmentAnswers: [String: AssessmentOption] = [:]
    var lastAssessmentResults: [AssessmentResult] = []

    var opportunityFilter: OpportunityFilter = .all

    // Navigation helpers
    var showProfile = false
    var pendingHomeDestination: HomeDestination?

    init() {
        applyLaunchJourneyStageIfNeeded()
    }

    enum OpportunityFilter: String, CaseIterable, Identifiable {
        case all
        case nearMe
        case shortTraining
        case highDemand

        var id: String { rawValue }
    }

    enum HomeDestination: Hashable {
        case opportunity
        case transition
        case trainingJourney
        case application
        case assessment
        case skillProgress
        case outcome
        case trainingRecs
        case centres
    }

    var selectedOpportunity: Opportunity {
        MockData.opportunities.first { $0.id == selectedOpportunityId } ?? MockData.opportunities[0]
    }

    var selectedCentre: TrainingCentre {
        MockData.centres.first { $0.id == selectedCentreId } ?? MockData.centres[0]
    }

    var primaryApplication: JobApplication? {
        applications.first(where: \.isPrimary) ?? applications.first
    }

    var jobsMatchedCount: Int {
        switch journeyStage {
        case .onboarding, .profiled:
            return 0
        case .assessed, .exploring, .transitionStarted:
            return 4
        case .enrolled, .trainingInProgress:
            return 5
        case .certified, .applied, .placed:
            return 6
        }
    }

    var skillProgressPercent: Int {
        switch journeyStage {
        case .onboarding: return 0
        case .profiled: return 42
        case .assessed, .exploring: return 58
        case .transitionStarted: return 61
        case .enrolled: return 64
        case .trainingInProgress: return 73
        case .certified, .applied, .placed: return 91
        }
    }

    var trainingActiveLabel: String {
        switch journeyStage {
        case .enrolled, .trainingInProgress:
            return "1"
        case .certified, .applied, .placed:
            return "0"
        default:
            return "0"
        }
    }

    var certificationsDisplay: Int {
        journeyStage.isCertifiedOrLater ? profile.certificationsCount + 1 : profile.certificationsCount
    }

    // MARK: - Next best action

    struct NextAction {
        let titleKey: String
        let subtitleKey: String
        let subtitleArgs: [CVarArg]
        let ctaKey: String
        let destination: HomeDestination
    }

    var nextAction: NextAction {
        switch journeyStage {
        case .onboarding:
            return NextAction(
                titleKey: "nba_onboarding_title",
                subtitleKey: "nba_onboarding_sub",
                subtitleArgs: [],
                ctaKey: "nba_continue",
                destination: .assessment
            )
        case .profiled:
            return NextAction(
                titleKey: "nba_profiled_title",
                subtitleKey: "nba_profiled_sub",
                subtitleArgs: [],
                ctaKey: "cta_start_assessment",
                destination: .assessment
            )
        case .assessed, .exploring:
            return NextAction(
                titleKey: "nba_opportunity_title",
                subtitleKey: "nba_opportunity_sub",
                subtitleArgs: [journeyStage.evTechnicianFit, 3, 6],
                ctaKey: "cta_view_path",
                destination: .transition
            )
        case .transitionStarted:
            return NextAction(
                titleKey: "nba_transition_title",
                subtitleKey: "nba_transition_sub",
                subtitleArgs: [],
                ctaKey: "cta_start_training",
                destination: .trainingRecs
            )
        case .enrolled:
            return NextAction(
                titleKey: "nba_enrolled_title",
                subtitleKey: "nba_enrolled_sub",
                subtitleArgs: [trainingJourney.todayModule],
                ctaKey: "cta_continue_training",
                destination: .trainingJourney
            )
        case .trainingInProgress:
            return NextAction(
                titleKey: "nba_training_title",
                subtitleKey: "nba_training_sub",
                subtitleArgs: [trainingJourney.currentWeek, trainingJourney.totalWeeks, trainingJourney.todayModule],
                ctaKey: "cta_continue_training",
                destination: .trainingJourney
            )
        case .certified:
            return NextAction(
                titleKey: "nba_certified_title",
                subtitleKey: "nba_certified_sub",
                subtitleArgs: [journeyStage.evTechnicianFit],
                ctaKey: "cta_view_jobs",
                destination: .application
            )
        case .applied:
            return NextAction(
                titleKey: "nba_applied_title",
                subtitleKey: "nba_applied_sub",
                subtitleArgs: [],
                ctaKey: "cta_view_application",
                destination: .application
            )
        case .placed:
            return NextAction(
                titleKey: "nba_placed_title",
                subtitleKey: "nba_placed_sub",
                subtitleArgs: [],
                ctaKey: "cta_view_outcome",
                destination: .outcome
            )
        }
    }

    // MARK: - Mutations

    func completeOnboarding(with draft: WorkerProfile) {
        profile = draft
        if profile.certificationsCount == 0 {
            profile.certificationsCount = 2
            profile.trainingsCompleted = 3
            profile.profileCompleteness = 78
        }
        skills = MockData.baseSkills
        journeyStage = .profiled
    }

    func completeAssessment(results: [AssessmentResult]) {
        lastAssessmentResults = results
        for result in results {
            if let idx = skills.firstIndex(where: { $0.name == result.skillName || $0.id == result.id }) {
                skills[idx].scoreOutOfTen = result.scoreOutOfTen
                skills[idx].verification = .estimated
                skills[idx].estimatedRange = result.range
                skills[idx].confidence = String(localized: String.LocalizationValue(result.confidenceKey))
            } else if result.skillName == "Battery basics" {
                // keep as soft signal only
            } else if result.skillName == "Diagnostic tools" {
                // keep as soft signal only
            }
        }
        // Apply PLC / Automation from assessment defaults if answered
        if let plc = results.first(where: { $0.skillName == "PLC" }),
           let idx = skills.firstIndex(where: { $0.id == "plc" }) {
            skills[idx].scoreOutOfTen = plc.scoreOutOfTen
            skills[idx].estimatedRange = plc.range
            skills[idx].verification = .estimated
        }
        if let auto = results.first(where: { $0.skillName == "Automation" }),
           let idx = skills.firstIndex(where: { $0.id == "automation" }) {
            skills[idx].scoreOutOfTen = auto.scoreOutOfTen
            skills[idx].estimatedRange = auto.range
            skills[idx].verification = .estimated
        }
        if let motor = results.first(where: { $0.skillName == "Motor Control" }),
           let idx = skills.firstIndex(where: { $0.id == "motor" }) {
            skills[idx].scoreOutOfTen = motor.scoreOutOfTen
            skills[idx].verification = .estimated
            skills[idx].estimatedRange = motor.range
        }
        profile.profileCompleteness = min(92, profile.profileCompleteness + 8)
        journeyStage = .assessed
    }

    func markExploring() {
        if journeyStage == .assessed {
            journeyStage = .exploring
        }
    }

    func startTransition() {
        journeyStage = .transitionStarted
    }

    func enrolInTraining(centreId: String, courseId: String) {
        selectedCentreId = centreId
        enrolledCourseId = courseId
        trainingJourney = .week1
        journeyStage = .enrolled
    }

    func advanceTrainingProgress() {
        if journeyStage == .enrolled {
            trainingJourney = .week3
            journeyStage = .trainingInProgress
        } else if journeyStage == .trainingInProgress {
            completeCertification()
        }
    }

    func completeCertification() {
        skills = MockData.postCertSkills
        profile.certificationsCount = max(profile.certificationsCount, 2)
        profile.trainingsCompleted += 1
        profile.profileCompleteness = 96
        profile.currentOccupation = "Industrial Electrician"
        trainingJourney.percentCompleted = 100
        trainingJourney.currentWeek = 6
        trainingJourney.certificationPending = false
        trainingJourney.modules = trainingJourney.modules.map {
            TrainingModule(id: $0.id, title: $0.title, status: .completed)
        }
        journeyStage = .certified
    }

    func applyToJob(_ job: JobMatch) {
        if !applications.contains(where: { $0.jobId == job.id }) {
            let app = JobApplication(
                id: "app-\(job.id)",
                jobId: job.id,
                title: job.title,
                company: job.company,
                location: "\(profile.location.components(separatedBy: " / ").first ?? profile.location) · \(job.distanceKm) km",
                salaryRange: job.salaryRange,
                status: .applied,
                isPrimary: job.id == "pragati-ev" || applications.isEmpty
            )
            if app.isPrimary {
                for i in applications.indices {
                    applications[i].isPrimary = false
                }
            }
            applications.insert(app, at: 0)
        }
        if journeyStage == .certified {
            journeyStage = .applied
            // Primary app becomes shortlisted for home card
            if let idx = applications.firstIndex(where: { $0.jobId == "pragati-ev" }) {
                applications[idx].status = .shortlisted
                applications[idx].isPrimary = true
            }
        }
    }

    func advancePrimaryApplication() {
        guard let idx = applications.firstIndex(where: \.isPrimary) else {
            applications = MockData.sampleApplications
            journeyStage = .applied
            return
        }
        let next = applications[idx].status.advanced()
        applications[idx].status = next
        if next == .joined {
            journeyStage = .placed
            profile.currentOccupation = "EV Technician"
        } else {
            journeyStage = .applied
        }
    }

    func markPlaced() {
        journeyStage = .placed
        profile.currentOccupation = "EV Technician"
        if applications.isEmpty {
            applications = MockData.sampleApplications
        }
        if let idx = applications.firstIndex(where: \.isPrimary) {
            applications[idx].status = .joined
        }
    }

    func jumpToStage(_ stage: JourneyStage) {
        journeyStage = stage
        switch stage {
        case .onboarding:
            profile = .empty
            skills = MockData.baseSkills
            applications = []
            enrolledCourseId = nil
            trainingJourney = .week1
            hasSeenOutcomeForm = false
        case .profiled:
            profile = .rahul
            skills = MockData.baseSkills
            applications = []
            enrolledCourseId = nil
        case .assessed, .exploring:
            profile = .rahul
            skills = MockData.baseSkills
            applications = []
        case .transitionStarted:
            profile = .rahul
            skills = MockData.baseSkills
        case .enrolled:
            profile = .rahul
            skills = MockData.baseSkills
            enrolledCourseId = "c-battery"
            trainingJourney = .week1
        case .trainingInProgress:
            profile = .rahul
            skills = MockData.baseSkills
            enrolledCourseId = "c-battery"
            trainingJourney = .week3
        case .certified:
            profile = .rahul
            skills = MockData.postCertSkills
            enrolledCourseId = "c-battery"
            trainingJourney = .week3
            trainingJourney.percentCompleted = 100
            trainingJourney.certificationPending = false
            applications = []
        case .applied:
            profile = .rahul
            skills = MockData.postCertSkills
            applications = MockData.sampleApplications
        case .placed:
            profile = .rahul
            profile.currentOccupation = "EV Technician"
            skills = MockData.postCertSkills
            applications = MockData.sampleApplications.map { app in
                var copy = app
                if copy.isPrimary { copy.status = .joined }
                return copy
            }
        }
    }

    func resetJourney() {
        jumpToStage(.onboarding)
        language = .english
        shareProfileWithEmployers = true
        useProfileForTrainingRecs = true
    }

    /// Silent stage jump for automation / recording.
    /// Launch: `-JourneyStage certified` or URL: `sanket://stage/certified`
    func applyLaunchJourneyStageIfNeeded() {
        let args = ProcessInfo.processInfo.arguments
        if let idx = args.firstIndex(of: "-JourneyStage"), args.indices.contains(idx + 1),
           let stage = JourneyStage(rawValue: args[idx + 1]) {
            jumpToStage(stage)
        }
    }

    func handleJourneyURL(_ url: URL) {
        guard url.scheme == "sanket" else { return }
        if url.host == "stage" {
            let name = url.pathComponents.filter { $0 != "/" }.first ?? url.lastPathComponent
            if let stage = JourneyStage(rawValue: name) {
                jumpToStage(stage)
            }
        } else if url.host == "advanceApplication" {
            advancePrimaryApplication()
        }
    }

    var filteredOpportunities: [Opportunity] {
        MockData.opportunities.filter { opp in
            switch opportunityFilter {
            case .all: return true
            case .nearMe: return opp.isNearMe
            case .shortTraining: return opp.isShortTraining
            case .highDemand: return opp.isHighDemand
            }
        }
    }

    var nearYouOpportunities: [Opportunity] {
        Array(MockData.opportunities.filter(\.isNearMe).prefix(3))
    }
}
