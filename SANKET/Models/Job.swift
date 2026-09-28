import Foundation

enum ApplicationStatus: String, CaseIterable, Codable, Hashable {
    case applied
    case shortlisted
    case interview
    case selected
    case joined

    var displayKey: String {
        switch self {
        case .applied: return "status_applied"
        case .shortlisted: return "status_shortlisted"
        case .interview: return "status_interview"
        case .selected: return "status_selected"
        case .joined: return "status_joined"
        }
    }

    var stepIndex: Int {
        switch self {
        case .applied: return 0
        case .shortlisted: return 1
        case .interview: return 2
        case .selected: return 3
        case .joined: return 4
        }
    }

    func advanced() -> ApplicationStatus {
        let all = Self.allCases
        guard let idx = all.firstIndex(of: self), idx + 1 < all.count else { return self }
        return all[idx + 1]
    }
}

struct JobMatch: Identifiable, Hashable, Codable {
    let id: String
    var title: String
    var company: String
    var distanceKm: Int
    var salaryRange: String
    var baseFitPercent: Int
    var requiredSkills: [String]
    var matchedSkillNames: [String]
    var whyMatched: [String]
    var whyApplyNow: String
    var openings: Int
    var closesInDays: Int

    func fitPercent(for stage: JourneyStage) -> Int {
        if id == "pragati-ev" {
            return stage.evTechnicianFit
        }
        if stage.isCertifiedOrLater {
            return min(baseFitPercent + 14, 95)
        }
        return baseFitPercent
    }

    func skillsOwned(for stage: JourneyStage) -> Set<String> {
        if stage.isCertifiedOrLater {
            return Set(requiredSkills)
        }
        return Set(matchedSkillNames)
    }
}

struct JobApplication: Identifiable, Hashable, Codable {
    let id: String
    var jobId: String
    var title: String
    var company: String
    var location: String
    var salaryRange: String
    var status: ApplicationStatus
    var isPrimary: Bool
}
