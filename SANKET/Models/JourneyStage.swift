import Foundation

enum JourneyStage: String, CaseIterable, Identifiable, Codable {
    case onboarding
    case profiled
    case assessed
    case exploring
    case transitionStarted
    case enrolled
    case trainingInProgress
    case certified
    case applied
    case placed

    var id: String { rawValue }

    var displayName: String {
        switch self {
        case .onboarding: return "Onboarding"
        case .profiled: return "Profiled"
        case .assessed: return "Assessed"
        case .exploring: return "Exploring"
        case .transitionStarted: return "Transition started"
        case .enrolled: return "Enrolled"
        case .trainingInProgress: return "Training in progress"
        case .certified: return "Certified"
        case .applied: return "Applied"
        case .placed: return "Placed"
        }
    }

    /// EV Technician fit % changes after certification.
    var evTechnicianFit: Int {
        switch self {
        case .onboarding, .profiled, .assessed, .exploring, .transitionStarted, .enrolled, .trainingInProgress:
            return 72
        case .certified, .applied, .placed:
            return 91
        }
    }

    var hasCompletedAssessment: Bool {
        switch self {
        case .onboarding, .profiled: return false
        default: return true
        }
    }

    var isTrainingActive: Bool {
        switch self {
        case .enrolled, .trainingInProgress, .certified, .applied, .placed:
            return true
        default:
            return false
        }
    }

    var isCertifiedOrLater: Bool {
        switch self {
        case .certified, .applied, .placed: return true
        default: return false
        }
    }
}
