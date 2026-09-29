import SwiftUI

struct StatusStepper: View {
    let steps: [String]
    let currentIndex: Int

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack(spacing: 0) {
                ForEach(Array(steps.enumerated()), id: \.offset) { index, _ in
                    Circle()
                        .fill(index <= currentIndex ? SANKETTheme.accent : Color.secondary.opacity(0.25))
                        .frame(width: 12, height: 12)
                    if index < steps.count - 1 {
                        Rectangle()
                            .fill(index < currentIndex ? SANKETTheme.accent : Color.secondary.opacity(0.25))
                            .frame(height: 2)
                    }
                }
            }
            HStack {
                ForEach(Array(steps.enumerated()), id: \.offset) { index, title in
                    Text(title)
                        .font(.caption2)
                        .foregroundStyle(index <= currentIndex ? .primary : .secondary)
                        .frame(maxWidth: .infinity, alignment: index == 0 ? .leading : (index == steps.count - 1 ? .trailing : .center))
                        .lineLimit(1)
                        .minimumScaleFactor(0.7)
                }
            }
        }
        .accessibilityElement(children: .combine)
        .accessibilityLabel(steps[safe: currentIndex] ?? "")
    }
}

private extension Array {
    subscript(safe index: Int) -> Element? {
        indices.contains(index) ? self[index] : nil
    }
}
