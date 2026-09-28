import Foundation

enum SkillVerification: String, Codable, Hashable {
    case verified
    case estimated
}

struct Skill: Identifiable, Hashable, Codable {
    let id: String
    var name: String
    var scoreOutOfTen: Int
    var verification: SkillVerification
    /// Optional range for estimated skills, e.g. "48–57%"
    var estimatedRange: String?
    var confidence: String?

    var scoreLabel: String { "\(scoreOutOfTen)/10" }
}

struct AssessmentQuestion: Identifiable, Hashable {
    let id: String
    let skillName: String
    let promptKey: String
    let options: [AssessmentOption]
}

struct AssessmentOption: Identifiable, Hashable {
    let id: String
    let titleKey: String
    let scoreOutOfTen: Int
    let range: String
    let confidenceKey: String
}

struct AssessmentResult: Identifiable, Hashable {
    let id: String
    let skillName: String
    let range: String
    let confidenceKey: String
    let basedOnKey: String
    let scoreOutOfTen: Int
}
