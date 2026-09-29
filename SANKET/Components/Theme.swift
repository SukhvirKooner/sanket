import SwiftUI

enum SANKETTheme {
    static let accent = Color(red: 15 / 255, green: 118 / 255, blue: 110 / 255) // #0F766E
    static let verified = Color(red: 22 / 255, green: 163 / 255, blue: 74 / 255) // calm green
    static let estimated = Color(red: 217 / 255, green: 119 / 255, blue: 6 / 255) // amber
    static let neutral = Color.secondary

    static let primaryButtonHeight: CGFloat = 50
}

struct AccentTint: ViewModifier {
    func body(content: Content) -> some View {
        content.tint(SANKETTheme.accent)
    }
}
