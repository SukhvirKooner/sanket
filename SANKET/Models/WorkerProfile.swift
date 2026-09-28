import Foundation

struct WorkerProfile: Hashable, Codable {
    var name: String
    var location: String
    var ageBand: String
    var education: String
    var currentOccupation: String
    var yearsExperience: Int
    var languages: [String]
    var certificationsCount: Int
    var trainingsCompleted: Int
    var profileCompleteness: Int

    static let empty = WorkerProfile(
        name: "",
        location: "",
        ageBand: "",
        education: "",
        currentOccupation: "",
        yearsExperience: 0,
        languages: [],
        certificationsCount: 0,
        trainingsCompleted: 0,
        profileCompleteness: 0
    )

    static let rahul = WorkerProfile(
        name: "Rahul Sharma",
        location: "Delhi / Gurugram",
        ageBand: "25–34",
        education: "ITI Electrician + Class 12",
        currentOccupation: "Industrial Electrician",
        yearsExperience: 7,
        languages: ["Hindi", "English"],
        certificationsCount: 2,
        trainingsCompleted: 3,
        profileCompleteness: 78
    )
}
