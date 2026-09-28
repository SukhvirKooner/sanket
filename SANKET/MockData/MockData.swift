import Foundation

enum MockData {
    // MARK: - Skills (base profile)

    static let baseSkills: [Skill] = [
        Skill(id: "electrical", name: "Electrical Systems", scoreOutOfTen: 8, verification: .verified),
        Skill(id: "troubleshooting", name: "Troubleshooting", scoreOutOfTen: 7, verification: .verified),
        Skill(id: "safety", name: "Industrial Safety", scoreOutOfTen: 8, verification: .verified),
        Skill(id: "plc", name: "PLC", scoreOutOfTen: 4, verification: .estimated, estimatedRange: "48–57%", confidence: "Medium"),
        Skill(id: "automation", name: "Automation", scoreOutOfTen: 2, verification: .estimated, estimatedRange: "22–31%", confidence: "Low"),
        Skill(id: "motor", name: "Motor Control", scoreOutOfTen: 6, verification: .verified),
        Skill(id: "wiring", name: "Industrial Wiring", scoreOutOfTen: 7, verification: .verified)
    ]

    static let postCertSkills: [Skill] = [
        Skill(id: "electrical", name: "Electrical Systems", scoreOutOfTen: 8, verification: .verified),
        Skill(id: "troubleshooting", name: "Troubleshooting", scoreOutOfTen: 8, verification: .verified),
        Skill(id: "safety", name: "Industrial Safety", scoreOutOfTen: 9, verification: .verified),
        Skill(id: "plc", name: "PLC", scoreOutOfTen: 6, verification: .verified),
        Skill(id: "automation", name: "Automation", scoreOutOfTen: 5, verification: .estimated, estimatedRange: "52–61%", confidence: "Medium"),
        Skill(id: "motor", name: "Motor Control", scoreOutOfTen: 7, verification: .verified),
        Skill(id: "wiring", name: "Industrial Wiring", scoreOutOfTen: 7, verification: .verified),
        Skill(id: "bms", name: "BMS", scoreOutOfTen: 8, verification: .verified),
        Skill(id: "battery", name: "Battery Diagnostics", scoreOutOfTen: 7, verification: .verified),
        Skill(id: "powertrain", name: "EV Powertrain", scoreOutOfTen: 7, verification: .verified)
    ]

    static let buildNextSkills = ["PLC", "Automation", "Battery Diagnostics"]

    // MARK: - Assessment

    static let assessmentQuestions: [AssessmentQuestion] = [
        AssessmentQuestion(
            id: "q-plc",
            skillName: "PLC",
            promptKey: "assess_q_plc",
            options: [
                AssessmentOption(id: "plc-b", titleKey: "assess_opt_beginner", scoreOutOfTen: 2, range: "18–27%", confidenceKey: "confidence_low"),
                AssessmentOption(id: "plc-w", titleKey: "assess_opt_working", scoreOutOfTen: 4, range: "48–57%", confidenceKey: "confidence_medium"),
                AssessmentOption(id: "plc-a", titleKey: "assess_opt_advanced", scoreOutOfTen: 7, range: "72–81%", confidenceKey: "confidence_high")
            ]
        ),
        AssessmentQuestion(
            id: "q-auto",
            skillName: "Automation",
            promptKey: "assess_q_automation",
            options: [
                AssessmentOption(id: "auto-b", titleKey: "assess_opt_beginner", scoreOutOfTen: 2, range: "22–31%", confidenceKey: "confidence_low"),
                AssessmentOption(id: "auto-w", titleKey: "assess_opt_working", scoreOutOfTen: 5, range: "48–56%", confidenceKey: "confidence_medium"),
                AssessmentOption(id: "auto-a", titleKey: "assess_opt_advanced", scoreOutOfTen: 8, range: "78–86%", confidenceKey: "confidence_high")
            ]
        ),
        AssessmentQuestion(
            id: "q-motor",
            skillName: "Motor Control",
            promptKey: "assess_q_motor",
            options: [
                AssessmentOption(id: "mot-b", titleKey: "assess_opt_beginner", scoreOutOfTen: 3, range: "28–36%", confidenceKey: "confidence_low"),
                AssessmentOption(id: "mot-w", titleKey: "assess_opt_working", scoreOutOfTen: 6, range: "58–67%", confidenceKey: "confidence_medium"),
                AssessmentOption(id: "mot-a", titleKey: "assess_opt_advanced", scoreOutOfTen: 9, range: "84–92%", confidenceKey: "confidence_high")
            ]
        ),
        AssessmentQuestion(
            id: "q-battery",
            skillName: "Battery basics",
            promptKey: "assess_q_battery",
            options: [
                AssessmentOption(id: "bat-b", titleKey: "assess_opt_beginner", scoreOutOfTen: 2, range: "16–24%", confidenceKey: "confidence_low"),
                AssessmentOption(id: "bat-w", titleKey: "assess_opt_working", scoreOutOfTen: 4, range: "42–51%", confidenceKey: "confidence_medium"),
                AssessmentOption(id: "bat-a", titleKey: "assess_opt_advanced", scoreOutOfTen: 7, range: "70–79%", confidenceKey: "confidence_high")
            ]
        ),
        AssessmentQuestion(
            id: "q-diag",
            skillName: "Diagnostic tools",
            promptKey: "assess_q_diag",
            options: [
                AssessmentOption(id: "diag-b", titleKey: "assess_opt_beginner", scoreOutOfTen: 3, range: "30–38%", confidenceKey: "confidence_low"),
                AssessmentOption(id: "diag-w", titleKey: "assess_opt_working", scoreOutOfTen: 5, range: "52–61%", confidenceKey: "confidence_medium"),
                AssessmentOption(id: "diag-a", titleKey: "assess_opt_advanced", scoreOutOfTen: 8, range: "76–84%", confidenceKey: "confidence_high")
            ]
        )
    ]

    // MARK: - Opportunities

    static let opportunities: [Opportunity] = [
        Opportunity(
            id: "ev-technician",
            title: "EV Technician",
            demandOutlook: "High",
            baseFitPercent: 72,
            distanceKm: 18,
            transitionWeeks: 6,
            skillsMissing: ["BMS", "Battery Diagnostics", "EV Powertrain"],
            whyLines: [
                "EV service demand in Gurugram is rising",
                "You already have 3 of 6 required skills",
                "A training centre is 18 km away"
            ],
            isNearMe: true,
            isShortTraining: true,
            isHighDemand: true
        ),
        Opportunity(
            id: "automation-tech",
            title: "Automation Technician",
            demandOutlook: "High",
            baseFitPercent: 68,
            distanceKm: 22,
            transitionWeeks: 8,
            skillsMissing: ["PLC Advanced", "SCADA", "Robot Safety"],
            whyLines: [
                "Factories near Manesar are hiring for automation",
                "Your electrical base covers 4 of 7 skills",
                "An 8-week course starts next month"
            ],
            isNearMe: true,
            isShortTraining: false,
            isHighDemand: true
        ),
        Opportunity(
            id: "industrial-maint",
            title: "Industrial Maintenance Technician",
            demandOutlook: "Steady",
            baseFitPercent: 81,
            distanceKm: 12,
            transitionWeeks: 3,
            skillsMissing: ["Predictive Maintenance", "Vibration Analysis"],
            whyLines: [
                "Closest match to your current role",
                "Only 2 skills to develop",
                "Short 3-week bridge near Okhla"
            ],
            isNearMe: true,
            isShortTraining: true,
            isHighDemand: false
        ),
        Opportunity(
            id: "solar-pv",
            title: "Solar PV Technician",
            demandOutlook: "Rising",
            baseFitPercent: 64,
            distanceKm: 27,
            transitionWeeks: 5,
            skillsMissing: ["PV Design Basics", "Inverter Setup", "Roof Safety"],
            whyLines: [
                "Rooftop solar installs are growing in NCR",
                "Your wiring experience transfers well",
                "5-week programme with tool kits provided"
            ],
            isNearMe: false,
            isShortTraining: true,
            isHighDemand: false
        ),
        Opportunity(
            id: "battery-assembly",
            title: "Battery Assembly Technician",
            demandOutlook: "High",
            baseFitPercent: 70,
            distanceKm: 19,
            transitionWeeks: 4,
            skillsMissing: ["Cell Handling", "Module Assembly", "Quality Checks"],
            whyLines: [
                "Battery plants near Gurugram need line technicians",
                "Safety background is a strong fit",
                "4-week course with 24 seats open"
            ],
            isNearMe: true,
            isShortTraining: true,
            isHighDemand: true
        ),
        Opportunity(
            id: "panel-tech",
            title: "Electrical Panel Technician",
            demandOutlook: "Steady",
            baseFitPercent: 85,
            distanceKm: 9,
            transitionWeeks: 2,
            skillsMissing: ["Panel Standards", "CAD Basics"],
            whyLines: [
                "Shortest path from your current work",
                "You already meet most skill requirements",
                "Nearest centre is only 9 km away"
            ],
            isNearMe: true,
            isShortTraining: true,
            isHighDemand: false
        )
    ]

    // MARK: - Career bridge

    static let careerBridge = CareerBridge(
        todayRole: "Industrial Electrician",
        targetRole: "EV Technician",
        alreadyHave: ["Electrical Systems", "Safety", "Troubleshooting"],
        toDevelop: ["Battery Diagnostics", "BMS", "EV Powertrain"],
        trainingWeeks: 6,
        nearestCentreKm: 18,
        courseCostINR: 14800,
        employerDemand: "High",
        expectedSalary: "₹16–19 LPA",
        paths: [
            TransitionPath(
                id: "path-a",
                label: "Path A",
                weeks: 6,
                demandLabel: "High demand",
                salaryRange: "₹16–19 LPA",
                centreDistanceKm: 18,
                courseCostINR: 14800,
                highlight: "Faster start · Strong local demand"
            ),
            TransitionPath(
                id: "path-b",
                label: "Path B",
                weeks: 10,
                demandLabel: "High demand",
                salaryRange: "₹18–22 LPA",
                centreDistanceKm: 22,
                courseCostINR: 21400,
                highlight: "Longer path · Higher salary band"
            )
        ]
    )

    // MARK: - Courses

    static let courses: [TrainingCourse] = [
        TrainingCourse(id: "c-battery", title: "EV Battery Diagnostics", weeks: 6, distanceKm: 18, targetRole: "EV Technician", closesGapSkills: ["Battery Diagnostics", "BMS"]),
        TrainingCourse(id: "c-bms", title: "BMS Fundamentals", weeks: 2, distanceKm: 22, targetRole: "EV Technician", closesGapSkills: ["BMS"]),
        TrainingCourse(id: "c-powertrain", title: "EV Powertrain", weeks: 3, distanceKm: 18, targetRole: "EV Technician", closesGapSkills: ["EV Powertrain"]),
        TrainingCourse(id: "c-safety-ev", title: "EV Workshop Safety", weeks: 1, distanceKm: 18, targetRole: "EV Technician", closesGapSkills: ["HV Safety"]),
        TrainingCourse(id: "c-charging", title: "Charging Systems Basics", weeks: 2, distanceKm: 24, targetRole: "EV Technician", closesGapSkills: ["Charging Systems"])
    ]

    // MARK: - Centres (fictional, near Delhi NCR coords)

    static let centres: [TrainingCentre] = [
        TrainingCentre(
            id: "okhla",
            name: "Okhla Skill Development Centre",
            programTitle: "EV Technician Program",
            distanceKm: 18,
            weeks: 6,
            seatsAvailable: 24,
            nextBatch: "12 Nov",
            equipmentAvailable: true,
            placementLinkage: true,
            latitude: 28.5355,
            longitude: 77.2731,
            address: "Okhla Phase II, New Delhi"
        ),
        TrainingCentre(
            id: "gurugram-ev",
            name: "Gurugram EV Skill Hub",
            programTitle: "EV Battery & BMS Track",
            distanceKm: 14,
            weeks: 6,
            seatsAvailable: 17,
            nextBatch: "18 Nov",
            equipmentAvailable: true,
            placementLinkage: true,
            latitude: 28.4595,
            longitude: 77.0266,
            address: "Sector 18, Gurugram"
        ),
        TrainingCentre(
            id: "manesar",
            name: "Manesar Automation Training Institute",
            programTitle: "Industrial Automation Bridge",
            distanceKm: 32,
            weeks: 8,
            seatsAvailable: 11,
            nextBatch: "5 Dec",
            equipmentAvailable: true,
            placementLinkage: false,
            latitude: 28.3543,
            longitude: 76.9378,
            address: "IMT Manesar, Gurugram"
        ),
        TrainingCentre(
            id: "noida-panel",
            name: "Noida Electrical Trades Academy",
            programTitle: "Panel & Maintenance Fast Track",
            distanceKm: 21,
            weeks: 3,
            seatsAvailable: 29,
            nextBatch: "9 Nov",
            equipmentAvailable: true,
            placementLinkage: true,
            latitude: 28.5355,
            longitude: 77.3910,
            address: "Sector 62, Noida"
        ),
        TrainingCentre(
            id: "faridabad-solar",
            name: "Faridabad Green Energy Centre",
            programTitle: "Solar PV Technician Course",
            distanceKm: 27,
            weeks: 5,
            seatsAvailable: 16,
            nextBatch: "22 Nov",
            equipmentAvailable: false,
            placementLinkage: true,
            latitude: 28.4089,
            longitude: 77.3178,
            address: "Sector 21C, Faridabad"
        )
    ]

    // MARK: - Jobs

    static let jobMatches: [JobMatch] = [
        JobMatch(
            id: "pragati-ev",
            title: "EV Technician",
            company: "Pragati Electric Mobility",
            distanceKm: 18,
            salaryRange: "₹16–19 LPA",
            baseFitPercent: 72,
            requiredSkills: ["Electrical Systems", "Industrial Safety", "Troubleshooting", "BMS", "Battery Diagnostics", "EV Powertrain"],
            matchedSkillNames: ["Electrical Systems", "Industrial Safety", "Troubleshooting"],
            whyMatched: ["EV certification", "Electrical experience", "BMS training", "Location match"],
            whyApplyNow: "Hiring closes in 9 days · 12 openings",
            openings: 12,
            closesInDays: 9
        ),
        JobMatch(
            id: "indus-battery",
            title: "Battery Assembly Technician",
            company: "Indus Battery Works",
            distanceKm: 19,
            salaryRange: "₹12–15 LPA",
            baseFitPercent: 74,
            requiredSkills: ["Industrial Safety", "Cell Handling", "Quality Checks", "Electrical Systems"],
            matchedSkillNames: ["Industrial Safety", "Electrical Systems"],
            whyMatched: ["Safety background", "Nearby plant", "Assembly readiness"],
            whyApplyNow: "Hiring closes in 14 days · 8 openings",
            openings: 8,
            closesInDays: 14
        ),
        JobMatch(
            id: "shaktiman",
            title: "Industrial Maintenance Technician",
            company: "Shaktiman Auto Components",
            distanceKm: 12,
            salaryRange: "₹11–14 LPA",
            baseFitPercent: 81,
            requiredSkills: ["Electrical Systems", "Troubleshooting", "Motor Control", "Predictive Maintenance"],
            matchedSkillNames: ["Electrical Systems", "Troubleshooting", "Motor Control"],
            whyMatched: ["Strong role overlap", "7 years experience", "Local plant"],
            whyApplyNow: "Hiring closes in 6 days · 5 openings",
            openings: 5,
            closesInDays: 6
        ),
        JobMatch(
            id: "nimbus-auto",
            title: "Automation Technician",
            company: "Nimbus Line Systems",
            distanceKm: 22,
            salaryRange: "₹14–17 LPA",
            baseFitPercent: 69,
            requiredSkills: ["PLC", "Automation", "Electrical Systems", "Robot Safety"],
            matchedSkillNames: ["Electrical Systems", "PLC"],
            whyMatched: ["Electrical base", "Growing PLC exposure", "Shift flexibility"],
            whyApplyNow: "Hiring closes in 11 days · 7 openings",
            openings: 7,
            closesInDays: 11
        ),
        JobMatch(
            id: "orbit-solar",
            title: "Solar PV Technician",
            company: "Orbit Solar Installs",
            distanceKm: 27,
            salaryRange: "₹10–13 LPA",
            baseFitPercent: 64,
            requiredSkills: ["Industrial Wiring", "Roof Safety", "Inverter Setup", "Electrical Systems"],
            matchedSkillNames: ["Industrial Wiring", "Electrical Systems"],
            whyMatched: ["Wiring experience", "Safety habits", "Field readiness"],
            whyApplyNow: "Hiring closes in 18 days · 15 openings",
            openings: 15,
            closesInDays: 18
        ),
        JobMatch(
            id: "voltedge",
            title: "Electrical Panel Technician",
            company: "VoltEdge Panels",
            distanceKm: 9,
            salaryRange: "₹11–13 LPA",
            baseFitPercent: 85,
            requiredSkills: ["Electrical Systems", "Industrial Wiring", "Panel Standards"],
            matchedSkillNames: ["Electrical Systems", "Industrial Wiring"],
            whyMatched: ["High skill overlap", "Short commute", "Panel shop experience path"],
            whyApplyNow: "Hiring closes in 4 days · 3 openings",
            openings: 3,
            closesInDays: 4
        )
    ]

    static let sampleApplications: [JobApplication] = [
        JobApplication(
            id: "app-pragati",
            jobId: "pragati-ev",
            title: "EV Technician",
            company: "Pragati Electric Mobility",
            location: "Gurugram · 18 km",
            salaryRange: "₹16–19 LPA",
            status: .shortlisted,
            isPrimary: true
        ),
        JobApplication(
            id: "app-indus",
            jobId: "indus-battery",
            title: "Battery Assembly Technician",
            company: "Indus Battery Works",
            location: "Gurugram · 19 km",
            salaryRange: "₹12–15 LPA",
            status: .applied,
            isPrimary: false
        ),
        JobApplication(
            id: "app-shaktiman",
            jobId: "shaktiman",
            title: "Industrial Maintenance Technician",
            company: "Shaktiman Auto Components",
            location: "Okhla · 12 km",
            salaryRange: "₹11–14 LPA",
            status: .interview,
            isPrimary: false
        ),
        JobApplication(
            id: "app-voltedge",
            jobId: "voltedge",
            title: "Electrical Panel Technician",
            company: "VoltEdge Panels",
            location: "Delhi · 9 km",
            salaryRange: "₹11–13 LPA",
            status: .selected,
            isPrimary: false
        )
    ]

    static let skillProgressPairs: [SkillProgressPair] = [
        SkillProgressPair(id: "sp-bms", skillName: "BMS", beforeLabel: "Low confidence (Estimated)", afterLabel: "Verified / Assessed", beforeScore: 3, afterScore: 8),
        SkillProgressPair(id: "sp-battery", skillName: "Battery Diagnostics", beforeLabel: "Low confidence (Estimated)", afterLabel: "Verified / Assessed", beforeScore: 2, afterScore: 7),
        SkillProgressPair(id: "sp-power", skillName: "EV Powertrain", beforeLabel: "Not started", afterLabel: "Verified / Assessed", beforeScore: 1, afterScore: 7)
    ]

    static let journeyFutureSkills = ["Fast-charging systems", "Fleet diagnostics", "Thermal management"]

    // MARK: - Onboarding options

    static let locations = ["Delhi / Gurugram", "Noida", "Faridabad", "Manesar", "Other NCR"]
    static let ageBands = ["18–24", "25–34", "35–44", "45–54", "55+"]
    static let educationOptions = [
        "Class 10",
        "Class 12",
        "ITI Electrician",
        "ITI Electrician + Class 12",
        "Diploma",
        "Graduate"
    ]
    static let occupations = [
        "Industrial Electrician",
        "Maintenance Technician",
        "Wireman",
        "Panel Fitter",
        "Other trades"
    ]
    static let experienceBands = [1, 3, 5, 7, 10, 15]
    static let languageOptions = ["Hindi", "English", "Punjabi", "Haryanvi"]
}
