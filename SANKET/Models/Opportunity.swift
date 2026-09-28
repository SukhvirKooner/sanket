import Foundation

struct Opportunity: Identifiable, Hashable, Codable {
    let id: String
    var title: String
    var demandOutlook: String
    var baseFitPercent: Int
    var distanceKm: Int
    var transitionWeeks: Int
    var skillsMissing: [String]
    var whyLines: [String]
    var isNearMe: Bool
    var isShortTraining: Bool
    var isHighDemand: Bool

    func fitPercent(for stage: JourneyStage) -> Int {
        if id == "ev-technician" {
            return stage.evTechnicianFit
        }
        if stage.isCertifiedOrLater {
            return min(baseFitPercent + 12, 96)
        }
        return baseFitPercent
    }
}

struct TransitionPath: Identifiable, Hashable {
    let id: String
    var label: String
    var weeks: Int
    var demandLabel: String
    var salaryRange: String
    var centreDistanceKm: Int
    var courseCostINR: Int
    var highlight: String
}

struct CareerBridge: Hashable {
    var todayRole: String
    var targetRole: String
    var alreadyHave: [String]
    var toDevelop: [String]
    var trainingWeeks: Int
    var nearestCentreKm: Int
    var courseCostINR: Int
    var employerDemand: String
    var expectedSalary: String
    var paths: [TransitionPath]
}
