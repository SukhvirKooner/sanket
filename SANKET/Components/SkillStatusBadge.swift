import SwiftUI

struct SkillStatusBadge: View {
    let verification: SkillVerification

    private var tint: Color {
        verification == .verified ? SANKETTheme.verified : SANKETTheme.estimated
    }

    var body: some View {
        HStack(spacing: 4) {
            Image(systemName: verification == .verified ? "checkmark.seal.fill" : "circle.dashed")
                .font(.caption2)
            Text(verification == .verified ? String(localized: "badge_verified") : String(localized: "badge_estimated"))
                .font(.caption2.weight(.semibold))
            if verification == .estimated {
                Text("≈")
                    .font(.caption2.weight(.semibold))
            }
        }
        .foregroundStyle(tint)
        .padding(.horizontal, 8)
        .padding(.vertical, 4)
        .background(tint.opacity(0.12), in: Capsule())
        .accessibilityLabel(verification == .verified ? String(localized: "badge_verified") : String(localized: "badge_estimated"))
    }
}
