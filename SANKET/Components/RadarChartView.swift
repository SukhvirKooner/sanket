import SwiftUI

struct RadarChartShape: Shape {
    var values: [Double] // 0...1
    var maxValue: Double = 1

    func path(in rect: CGRect) -> Path {
        guard values.count >= 3 else { return Path() }
        let center = CGPoint(x: rect.midX, y: rect.midY)
        let radius = min(rect.width, rect.height) / 2 * 0.85
        let step = (2 * Double.pi) / Double(values.count)
        var path = Path()
        for (index, value) in values.enumerated() {
            let angle = step * Double(index) - Double.pi / 2
            let r = radius * min(max(value / maxValue, 0), 1)
            let point = CGPoint(
                x: center.x + CGFloat(cos(angle)) * r,
                y: center.y + CGFloat(sin(angle)) * r
            )
            if index == 0 {
                path.move(to: point)
            } else {
                path.addLine(to: point)
            }
        }
        path.closeSubpath()
        return path
    }
}

struct RadarGridShape: Shape {
    let axes: Int
    let rings: Int

    func path(in rect: CGRect) -> Path {
        var path = Path()
        let center = CGPoint(x: rect.midX, y: rect.midY)
        let radius = min(rect.width, rect.height) / 2 * 0.85
        guard axes >= 3, rings >= 1 else { return path }

        for ring in 1...rings {
            let r = radius * CGFloat(ring) / CGFloat(rings)
            path.addEllipse(in: CGRect(x: center.x - r, y: center.y - r, width: r * 2, height: r * 2))
        }

        let step = (2 * Double.pi) / Double(axes)
        for i in 0..<axes {
            let angle = step * Double(i) - Double.pi / 2
            let point = CGPoint(
                x: center.x + CGFloat(cos(angle)) * radius,
                y: center.y + CGFloat(sin(angle)) * radius
            )
            path.move(to: center)
            path.addLine(to: point)
        }
        return path
    }
}

struct RadarChartView: View {
    let skills: [Skill]

    var body: some View {
        let values = skills.map { Double($0.scoreOutOfTen) / 10.0 }
        let labels = skills.map(\.name)

        VStack(spacing: 12) {
            ZStack {
                RadarGridShape(axes: max(labels.count, 3), rings: 4)
                    .stroke(Color.secondary.opacity(0.25), lineWidth: 1)
                RadarChartShape(values: values)
                    .fill(SANKETTheme.accent.opacity(0.18))
                RadarChartShape(values: values)
                    .stroke(SANKETTheme.accent, lineWidth: 2)
            }
            .frame(height: 220)
            .padding(.horizontal, 8)

            FlexibleSkillLabels(labels: labels)
        }
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(String(localized: "skill_map_title"))
    }
}

private struct FlexibleSkillLabels: View {
    let labels: [String]

    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                ForEach(labels, id: \.self) { label in
                    Text(label)
                        .font(.caption2)
                        .foregroundStyle(.secondary)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(Color.secondary.opacity(0.1), in: Capsule())
                }
            }
        }
    }
}
