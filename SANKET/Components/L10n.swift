import Foundation
import SwiftUI

enum L10n {
    static func string(_ key: String.LocalizationValue) -> String {
        String(localized: key)
    }

    static func format(_ key: String, _ args: CVarArg...) -> String {
        let format = String(localized: String.LocalizationValue(key))
        return String(format: format, locale: Locale.current, arguments: args)
    }
}

/// Applies the app language override via environment.
struct LanguageEnvironmentKey: EnvironmentKey {
    static let defaultValue: AppLanguage = .english
}

extension EnvironmentValues {
    var appLanguage: AppLanguage {
        get { self[LanguageEnvironmentKey.self] }
        set { self[LanguageEnvironmentKey.self] = newValue }
    }
}
