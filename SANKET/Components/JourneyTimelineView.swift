import SwiftUI

struct TimelineItem: Identifiable, Hashable {
    let id: String
    var title: String
    var subtitle: String?
    var state: TimelineItemState
}

enum TimelineItemState: Hashable {
    case completed
    case current
    case upcoming
}

/// Vertical timeline used for training modules and workforce journey.
struct JourneyTimelineView: View {
    let items: [TimelineItem]

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            ForEach(Array(items.enumerated()), id: \.element.id) { index, item in
                HStack(alignment: .top, spacing: 12) {
                    VStack(spacing: 0) {
                        circle(for: item.state)
                        if index < items.count - 1 {
                            Rectangle()
                                .fill(Color.secondary.opacity(0.25))
                                .frame(width: 2)
                                .frame(maxHeight: .infinity)
                        }
                    }
                    .frame(width: 22)

                    VStack(alignment: .leading, spacing: 2) {
                        Text(item.title)
                            .font(.body.weight(item.state == .current ? .semibold : .regular))
                            .foregroundStyle(item.state == .upcoming ? .secondary : .primary)
                        if let subtitle = item.subtitle {
                            Text(subtitle)
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        }
                    }
                    .padding(.bottom, index < items.count - 1 ? 18 : 0)
                    Spacer(minLength: 0)
                }
                .fixedSize(horizontal: false, vertical: true)
            }
        }
    }

    @ViewBuilder
    private func circle(for state: TimelineItemState) -> some View {
        switch state {
        case .completed:
            Image(systemName: "checkmark.circle.fill")
                .foregroundStyle(SANKETTheme.accent)
                .font(.body)
        case .current:
            Image(systemName: "circle.inset.filled")
                .foregroundStyle(SANKETTheme.accent)
                .font(.body)
        case .upcoming:
            Image(systemName: "circle")
                .foregroundStyle(.secondary)
                .font(.body)
        }
    }
}
