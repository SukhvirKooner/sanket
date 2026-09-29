import SwiftUI

struct PrimaryButton: View {
    let title: String
    var isEnabled: Bool = true
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.headline)
                .frame(maxWidth: .infinity)
                .frame(height: SANKETTheme.primaryButtonHeight)
                .foregroundStyle(.white)
                .background(isEnabled ? SANKETTheme.accent : Color.secondary.opacity(0.4), in: RoundedRectangle(cornerRadius: 12, style: .continuous))
        }
        .disabled(!isEnabled)
        .buttonStyle(.plain)
        .accessibilityAddTraits(.isButton)
    }
}

struct SecondaryButton: View {
    let title: String
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.headline)
                .frame(maxWidth: .infinity)
                .frame(height: SANKETTheme.primaryButtonHeight)
                .foregroundStyle(SANKETTheme.accent)
                .background(
                    RoundedRectangle(cornerRadius: 12, style: .continuous)
                        .stroke(SANKETTheme.accent, lineWidth: 1.5)
                )
        }
        .buttonStyle(.plain)
    }
}
