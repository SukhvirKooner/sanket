import Foundation
import CoreLocation

struct TrainingCourse: Identifiable, Hashable, Codable {
    let id: String
    var title: String
    var weeks: Int
    var distanceKm: Int
    var targetRole: String
    var closesGapSkills: [String]
}

struct TrainingCentre: Identifiable, Hashable {
    let id: String
    var name: String
    var programTitle: String
    var distanceKm: Int
    var weeks: Int
    var seatsAvailable: Int
    var nextBatch: String
    var equipmentAvailable: Bool
    var placementLinkage: Bool
    var latitude: Double
    var longitude: Double
    var address: String

    var coordinate: CLLocationCoordinate2D {
        CLLocationCoordinate2D(latitude: latitude, longitude: longitude)
    }
}

enum ModuleStatus: String, Codable, Hashable {
    case completed
    case current
    case upcoming
}

struct TrainingModule: Identifiable, Hashable, Codable {
    let id: String
    var title: String
    var status: ModuleStatus
}

struct TrainingJourney: Hashable, Codable {
    var currentWeek: Int
    var totalWeeks: Int
    var percentCompleted: Int
    var modules: [TrainingModule]
    var attendanceDone: Int
    var attendanceTotal: Int
    var assignmentsDone: Int
    var assignmentsTotal: Int
    var assessmentsDone: Int
    var assessmentsTotal: Int
    var certificationPending: Bool
    var todayModule: String

    static let week3 = TrainingJourney(
        currentWeek: 3,
        totalWeeks: 6,
        percentCompleted: 52,
        modules: [
            TrainingModule(id: "m1", title: "Electrical Safety", status: .completed),
            TrainingModule(id: "m2", title: "EV Fundamentals", status: .completed),
            TrainingModule(id: "m3", title: "Battery Systems", status: .completed),
            TrainingModule(id: "m4", title: "BMS", status: .current),
            TrainingModule(id: "m5", title: "Diagnostics", status: .upcoming)
        ],
        attendanceDone: 14,
        attendanceTotal: 15,
        assignmentsDone: 4,
        assignmentsTotal: 6,
        assessmentsDone: 2,
        assessmentsTotal: 3,
        certificationPending: true,
        todayModule: "BMS module"
    )

    static let week1 = TrainingJourney(
        currentWeek: 1,
        totalWeeks: 6,
        percentCompleted: 8,
        modules: [
            TrainingModule(id: "m1", title: "Electrical Safety", status: .current),
            TrainingModule(id: "m2", title: "EV Fundamentals", status: .upcoming),
            TrainingModule(id: "m3", title: "Battery Systems", status: .upcoming),
            TrainingModule(id: "m4", title: "BMS", status: .upcoming),
            TrainingModule(id: "m5", title: "Diagnostics", status: .upcoming)
        ],
        attendanceDone: 2,
        attendanceTotal: 15,
        assignmentsDone: 0,
        assignmentsTotal: 6,
        assessmentsDone: 0,
        assessmentsTotal: 3,
        certificationPending: true,
        todayModule: "Electrical Safety"
    )
}

struct SkillProgressPair: Identifiable, Hashable {
    let id: String
    var skillName: String
    var beforeLabel: String
    var afterLabel: String
    var beforeScore: Int
    var afterScore: Int
}
