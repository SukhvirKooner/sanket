import SwiftUI

struct FitPercentView: View {
    let percent: Int
    var compact: Bool = false

    var body: some View {
        Text(compact ? "\(percent)%" : String(localized: "fit_percent \(percent)"))
            .font(compact ? .subheadline.weight(.semibold) : .headline)
            .foregroundStyle(SANKETTheme.accent)
            .accessibilityLabel(String(localized: "fit_percent \(percent)"))
    }
}
